import { useAuth } from "@clerk/expo";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { MotiView } from "moti";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "tamagui";

export default function SplashScreen() {
  const { isSignedIn, isLoaded } = useAuth({ treatPendingAsSignedOut: false });
  const [decided, setDecided] = useState(false);

  useEffect(() => {
    // Esperar mínimo 1.5s para el splash visual + tiempo para Clerk
    const minDelay = new Promise((r) => setTimeout(r, 1500));

    // Esperar a que Clerk esté listo (máximo 5s)
    const waitForClerk = async () => {
      let attempts = 0;
      while (!isLoaded && attempts < 50) {
        attempts++;
        await new Promise((r) => setTimeout(r, 100));
      }
      console.log("[splash] Clerk loaded:", isLoaded, "isSignedIn:", isSignedIn);
    };

    Promise.all([minDelay, waitForClerk()]).then(() => {
      if (decided) return;
      setDecided(true);

      if (isSignedIn) {
        console.log("[splash] session found → home");
        router.replace("/(tabs)/home");
      } else {
        console.log("[splash] no session → login");
        router.replace("/auth/login");
      }
    });
  }, [isLoaded, isSignedIn]);

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
        {!isLoaded && (
          <Text fontSize={12} color="#64748b" marginTop={16} fontFamily="$body">
            Iniciando…
          </Text>
        )}
      </View>
    </View>
  );
}
