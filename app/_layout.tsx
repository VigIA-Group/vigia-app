import { ThemeContext, useThemeState } from "@/src/hooks/use-app-theme";
import config from "@/tamagui.config";
import {
    PlusJakartaSans_300Light,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TamaguiProvider, Theme } from "tamagui";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const { theme: appTheme, setTheme: setAppTheme } = useThemeState("dark");

  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_300Light,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    async function init() {
      const savedTheme = await AsyncStorage.getItem("vigia_theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        setAppTheme(savedTheme);
      }
    }
    init();

    if (Platform.OS === "web" && typeof document !== "undefined") {
      const linkId = "vigia-google-fonts";
      if (!document.getElementById(linkId)) {
        const link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        link.href =
          "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap";
        document.head.appendChild(link);
      }

      const styleId = "vigia-runtime-fonts";
      if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
          @font-face {
            font-family: 'PlusJakartaSans';
            src: local('Plus Jakarta Sans'), local('PlusJakartaSans');
            font-weight: 300 800;
            font-display: swap;
          }
          @font-face {
            font-family: 'IBMPlexMono';
            src: local('Plus Jakarta Sans'), local('PlusJakartaSans');
            font-weight: 300 800;
            font-display: swap;
          }
          html, body, #root, [data-tamagui-component], input, button, textarea, select, text, tspan, * {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `;
        document.head.appendChild(style);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <TamaguiProvider config={config} defaultTheme="dark">
          <Theme name={appTheme}>
            <ThemeContext.Provider value={{ theme: appTheme, setTheme: setAppTheme }}>
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
  );
}
