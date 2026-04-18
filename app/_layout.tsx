import { ThemeContext, useThemeState } from "@/src/hooks/use-app-theme";
import config from "@/tamagui.config";
import {
    IBMPlexMono_400Regular,
    IBMPlexMono_700Bold,
    useFonts as useIBMPlexMono,
} from "@expo-google-fonts/ibm-plex-mono";
import {
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    useFonts as useOutfit,
} from "@expo-google-fonts/outfit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-gesture-handler";
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
  const [fontsReady, setFontsReady] = useState(false);

  const [outfitLoaded] = useOutfit({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  const [monoLoaded] = useIBMPlexMono({
    IBMPlexMono_400Regular,
    IBMPlexMono_700Bold,
  });

  useEffect(() => {
    if (outfitLoaded && monoLoaded) {
      setFontsReady(true);
    }
  }, [outfitLoaded, monoLoaded]);

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
