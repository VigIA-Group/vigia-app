import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ArrowRight, Sparkles } from "lucide-react-native";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";

export default function SignupScreen() {
  useEffect(() => {
    // Demo comercial pública: no requiere creación de cuenta
    const timer = setTimeout(() => {
      router.replace("/menu" as any);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View flex={1}>
      <LinearGradient colors={["#020617", "#0c1a3a", "#020617"]} style={StyleSheet.absoluteFill} />
      <YStack flex={1} padding={24} alignItems="center" justifyContent="center" gap={20}>
        <Image
          source={require("@/assets/images/logo-dark.png")}
          style={{ width: 200, height: 70 }}
          contentFit="contain"
        />

        <YStack gap={8} alignItems="center">
          <XStack
            backgroundColor="rgba(33, 152, 244, 0.15)"
            borderWidth={1}
            borderColor="rgba(33, 152, 244, 0.35)"
            paddingHorizontal={12}
            paddingVertical={4}
            borderRadius={20}
            alignItems="center"
            gap={6}
          >
            <Sparkles size={12} color="#38bdf8" />
            <Text fontSize={12} fontWeight="700" color="#38bdf8">
              DEMO COMERCIAL PÚBLICA
            </Text>
          </XStack>

          <Text
            fontSize={24}
            fontWeight="800"
            color="#ffffff"
            fontFamily="$body"
            textAlign="center"
          >
            Acceso Inmediato
          </Text>
          <Text fontSize={13} color="#94a3b8" fontFamily="$body" textAlign="center" maxWidth={320}>
            No es necesario registrarse. Puedes explorar todas las industrias y módulos de VigIA
            libremente.
          </Text>
        </YStack>

        <View
          height={50}
          width={280}
          borderRadius={14}
          overflow="hidden"
          pressStyle={{ opacity: 0.85 }}
          onPress={() => router.replace("/menu" as any)}
        >
          <LinearGradient
            colors={["#02209A", "#0A4CE8", "#2198F4"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <XStack flex={1} alignItems="center" justifyContent="center" gap={8}>
            <Text fontSize={14} fontWeight="700" color="#ffffff" fontFamily="$body">
              Entrar al Selector de Demos
            </Text>
            <ArrowRight size={16} color="#ffffff" />
          </XStack>
        </View>
      </YStack>
    </View>
  );
}
