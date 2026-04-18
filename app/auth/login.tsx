import { OwlState } from "@/src/components/owl-state";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    await AsyncStorage.setItem("vigia_session", "mock_session");
    router.replace("/(tabs)/home");
  };

  return (
    <View flex={1}>
      <LinearGradient colors={["#020617", "#0c1a3a", "#020617"]} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <YStack flex={1} padding={24} paddingTop={60} gap={0}>
            {/* Logo */}
            <YStack alignItems="center" marginBottom={24}>
              <Image
                source={require("@/assets/images/logo-dark.png")}
                style={{ width: 180, height: 64 }}
                contentFit="contain"
              />
            </YStack>

            {/* Owl */}
            <YStack alignItems="center" marginBottom={28}>
              <OwlState variant="idle" size="medium" floating />
            </YStack>

            {/* Title */}
            <YStack marginBottom={28}>
              <Text
                fontSize={26}
                fontWeight="700"
                color="#ffffff"
                fontFamily="$body"
                textAlign="center"
              >
                Bienvenido
              </Text>
              <Text
                fontSize={14}
                color="#64748b"
                fontFamily="$body"
                textAlign="center"
                marginTop={4}
              >
                Ingresa a tu panel de monitoreo
              </Text>
            </YStack>

            {/* Form */}
            <YStack gap={14} marginBottom={20}>
              {/* Email */}
              <XStack
                backgroundColor="#0f172a"
                borderRadius={12}
                borderWidth={1}
                borderColor="#334155"
                alignItems="center"
                paddingHorizontal={14}
                gap={10}
              >
                <Mail size={16} color="#64748b" />
                <TextInput
                  style={{
                    flex: 1,
                    color: "#ffffff",
                    fontFamily: "DMSans_400Regular",
                    fontSize: 14,
                    height: 48,
                  }}
                  placeholder="Email corporativo"
                  placeholderTextColor="#64748b"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </XStack>

              {/* Password */}
              <XStack
                backgroundColor="#0f172a"
                borderRadius={12}
                borderWidth={1}
                borderColor="#334155"
                alignItems="center"
                paddingHorizontal={14}
                gap={10}
              >
                <Lock size={16} color="#64748b" />
                <TextInput
                  style={{
                    flex: 1,
                    color: "#ffffff",
                    fontFamily: "DMSans_400Regular",
                    fontSize: 14,
                    height: 48,
                  }}
                  placeholder="Contraseña"
                  placeholderTextColor="#64748b"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPass}
                />
                <View pressStyle={{ opacity: 0.6 }} onPress={() => setShowPass(!showPass)}>
                  {showPass ? (
                    <EyeOff size={16} color="#64748b" />
                  ) : (
                    <Eye size={16} color="#64748b" />
                  )}
                </View>
              </XStack>
            </YStack>

            {/* Login Button */}
            <View
              height={52}
              borderRadius={14}
              overflow="hidden"
              pressStyle={{ opacity: 0.85 }}
              onPress={handleLogin}
            >
              <LinearGradient
                colors={["#1e3a8a", "#2563eb", "#60a5fa"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
              <View flex={1} alignItems="center" justifyContent="center">
                <Text fontSize={15} fontWeight="700" color="#ffffff" fontFamily="$body">
                  Ingresar
                </Text>
              </View>
            </View>

            {/* Sign up link */}
            <XStack
              justifyContent="center"
              marginTop={20}
              gap={4}
              pressStyle={{ opacity: 0.7 }}
              onPress={() => router.push("/auth/signup")}
            >
              <Text fontSize={13} color="#64748b" fontFamily="$body">
                ¿Primera vez?
              </Text>
              <Text fontSize={13} color="#3b82f6" fontFamily="$body" fontWeight="600">
                Crear cuenta
              </Text>
            </XStack>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
