import { ThemeContext, useThemeState } from "@/src/hooks/use-app-theme";
import { usePushNotifications } from "@/src/hooks/use-push-notifications";
import config from "@/tamagui.config";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  useFonts as useDMSans,
} from "@expo-google-fonts/dm-sans";
import {
  IBMPlexMono_400Regular,
  IBMPlexMono_700Bold,
  useFonts as useIBMPlexMono,
} from "@expo-google-fonts/ibm-plex-mono";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TamaguiProvider, Theme } from "tamagui";

SplashScreen.preventAutoHideAsync();

const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!PUBLISHABLE_KEY) {
  throw new Error("Agrega EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY a tu archivo .env");
}

export const unstable_settings = {
  anchor: "(tabs)",
};

/** Redirects between auth and app based on Clerk session state */
function AuthGate() {
  const { isSignedIn, isLoaded } = useAuth({ treatPendingAsSignedOut: false });
  usePushNotifications();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "auth";
    // segments nunca es vacío en expo-router; index es ["index"] o [""]
    const firstSegment = segments[0] as string;
    const isRoot = segments.length === 1 && (firstSegment === "index" || firstSegment === "");

    // No redirigir desde la splash screen (index) — ella decide sola
    if (isRoot) return;

    // Logged in → si está en auth, mandar a home
    if (isSignedIn && inAuthGroup) {
      router.replace("/(tabs)/home");
      return;
    }

    // Not logged in → si está fuera de auth, mandar a login
    if (!isSignedIn && !inAuthGroup) {
      router.replace("/auth/login");
    }
  }, [isSignedIn, isLoaded, segments, router]);

  return null;
}

export default function RootLayout() {
  const { theme: appTheme, setTheme: setAppTheme } = useThemeState("dark");
  const [fontsReady, setFontsReady] = useState(false);
  const router = useRouter();

  const [dmSansLoaded] = useDMSans({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  const [monoLoaded] = useIBMPlexMono({
    IBMPlexMono_400Regular,
    IBMPlexMono_700Bold,
  });

  useEffect(() => {
    if (dmSansLoaded && monoLoaded) {
      setFontsReady(true);
    }
  }, [dmSansLoaded, monoLoaded]);

  useEffect(() => {
    async function init() {
      const savedTheme = await AsyncStorage.getItem("vigia_theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        setAppTheme(savedTheme);
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (fontsReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsReady]);

  if (!fontsReady) return null;

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      tokenCache={tokenCache}
      routerPush={(to: string) => router.push(to as any)}
      routerReplace={(to: string) => router.replace(to as any)}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <TamaguiProvider config={config} defaultTheme="dark">
            <Theme name={appTheme}>
              <ThemeContext.Provider value={{ theme: appTheme, setTheme: setAppTheme }}>
                <AuthGate />
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="auth/login" />
                  <Stack.Screen name="auth/signup" />
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen
                    name="settings"
                    options={{ presentation: "modal", animation: "slide_from_bottom" }}
                  />
                </Stack>
                <StatusBar style={appTheme === "dark" ? "light" : "dark"} />
              </ThemeContext.Provider>
            </Theme>
          </TamaguiProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ClerkProvider>
  );
}
