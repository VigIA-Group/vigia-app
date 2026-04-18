import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { MotiView } from "moti";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { View } from "tamagui";

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(async () => {
      const session = await AsyncStorage.getItem("vigia_session");
      if (session) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/auth/login");
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View flex={1}>
      <LinearGradient
        colors={["#020617", "#0c1a3a", "#1e3a8a", "#0c1a3a", "#020617"]}
        locations={[0, 0.3, 0.5, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View flex={1} alignItems="center" justifyContent="center">
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "timing", duration: 800 }}
        >
          <Image
            source={require("@/assets/images/logo-dark.png")}
            style={{ width: 220, height: 80 }}
            contentFit="contain"
          />
        </MotiView>
      </View>
    </View>
  );
}
