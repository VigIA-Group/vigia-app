/**
 * usePushNotifications
 *
 * Registers the device for Expo push notifications and uploads the token
 * to the VigIA gateway so alert notifications can be delivered.
 *
 * Usage — call once in the root layout after the user is signed in:
 *   usePushNotifications()
 */

import { useAuth } from "@clerk/expo";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

// Foreground notification behaviour — show banner + play sound while app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function usePushNotifications() {
  const { getToken, isSignedIn } = useAuth();
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) return;

    let subscription: Notifications.Subscription | null = null;

    async function register() {
      // Push notifications only work on physical devices
      if (!Device.isDevice) return;

      // Request permission
      const { status: existing } = await Notifications.getPermissionsAsync();
      let finalStatus = existing;
      if (existing !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") return;

      // Android: create the default channel
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("alerts", {
          name: "Alertas VigIA",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#1d4ed8",
        });
      }

      // Get token — requires a valid EAS project ID in app.json extra.eas.projectId
      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

      if (!projectId) {
        console.warn("[push] No EAS projectId found in app.json — skipping token registration");
        return;
      }

      const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync({ projectId });
      if (!expoPushToken || tokenRef.current === expoPushToken) return;

      tokenRef.current = expoPushToken;

      // Upload token to gateway
      try {
        const jwt = await getToken();
        await fetch(`${API_BASE}/push-tokens`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
          },
          body: JSON.stringify({
            token: expoPushToken,
            platform: Platform.OS,
            device_name: Device.deviceName ?? undefined,
          }),
        });
      } catch (e) {
        console.warn("[push] Failed to upload push token:", e);
      }
    }

    register();

    // Listen for notifications received while app is in foreground
    subscription = Notifications.addNotificationReceivedListener((notification) => {
      console.log("[push] Notification received:", notification.request.content.title);
    });

    return () => {
      subscription?.remove();
    };
  }, [isSignedIn, getToken]);
}

/**
 * Deactivates the current push token in the gateway on logout.
 * Call this before signOut().
 */
export async function deregisterPushToken(getToken: () => Promise<string | null>) {
  try {
    const token = tokenRef.current;
    if (!token) return;
    const jwt = await getToken();
    await fetch(`${API_BASE}/push-tokens/${encodeURIComponent(token)}`, {
      method: "DELETE",
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
    });
  } catch {
    // Non-fatal
  }
}

// Module-level ref so deregisterPushToken can access the last known token
const tokenRef = { current: null as string | null };
