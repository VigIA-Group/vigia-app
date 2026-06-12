import { OwlState } from "@/src/components/owl-state";
import { useClerk } from "@clerk/expo";
import { useSignIn } from "@clerk/expo/legacy";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { Text, View, XStack, YStack } from "tamagui";

export default function LoginScreen() {
  const { signIn, isLoaded } = useSignIn();
  const clerk = useClerk();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Two-factor / email-code verification
  const [needsCode, setNeedsCode] = useState(false);
  const [code, setCode] = useState("");

  const handleLogin = async () => {
    if (!isLoaded || loading) return;
    setLoading(true);
    setError(null);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        // ACTIVAR la sesión en Clerk — sin esto useAuth() no detecta login
        await clerk.setActive({ session: result.createdSessionId });
        router.replace("/"); // splash screen decidirá basado en Clerk.session real
      } else if (
        result.status === "needs_second_factor" ||
        result.status === "needs_new_password"
      ) {
        // Trigger email code second factor
        await signIn.prepareSecondFactor({ strategy: "email_code" });
        setNeedsCode(true);
      }
    } catch (e: any) {
      const msg = e?.errors?.[0]?.message ?? e?.message ?? "Credenciales incorrectas";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!isLoaded || loading) return;
    setLoading(true);
    setError(null);

    try {
      const result = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code,
      });
      if (result.status === "complete") {
        await clerk.setActive({ session: result.createdSessionId });
        router.replace("/"); // splash screen decidirá basado en Clerk.session real
      }
    } catch (e: any) {
      setError(e?.errors?.[0]?.message ?? e?.message ?? "Código incorrecto");
    } finally {
      setLoading(false);
    }
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
              <OwlState variant={error ? "intrusion" : "idle"} size="medium" floating />
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
                {needsCode ? "Verificar cuenta" : "Bienvenido"}
              </Text>
              <Text
                fontSize={14}
                color="#64748b"
                fontFamily="$body"
                textAlign="center"
                marginTop={4}
              >
                {needsCode
                  ? "Ingresa el código enviado a tu email"
                  : "Ingresa a tu panel de monitoreo"}
              </Text>
            </YStack>

            {needsCode ? (
              /* ── Email verification code ── */
              <YStack gap={14} marginBottom={20}>
                <XStack
                  backgroundColor="#0f172a"
                  borderRadius={12}
                  borderWidth={1}
                  borderColor="#334155"
                  alignItems="center"
                  paddingHorizontal={14}
                >
                  <TextInput
                    style={{
                      flex: 1,
                      color: "#ffffff",
                      fontSize: 22,
                      height: 56,
                      letterSpacing: 8,
                      textAlign: "center",
                    }}
                    placeholder="000000"
                    placeholderTextColor="#64748b"
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </XStack>
                {error && (
                  <Text fontSize={13} color="#ef4444" fontFamily="$body">
                    {error}
                  </Text>
                )}
                <View
                  height={52}
                  borderRadius={14}
                  overflow="hidden"
                  position="relative"
                  pressStyle={{ opacity: 0.85 }}
                  onPress={handleVerifyCode}
                >
                  <LinearGradient
                    colors={["#1e3a8a", "#2563eb", "#60a5fa"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                    pointerEvents="none"
                  />
                  <View flex={1} alignItems="center" justifyContent="center">
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text fontSize={15} fontWeight="700" color="#ffffff" fontFamily="$body">
                        Verificar
                      </Text>
                    )}
                  </View>
                </View>
                <XStack
                  justifyContent="center"
                  marginTop={8}
                  pressStyle={{ opacity: 0.7 }}
                  onPress={() => signIn?.prepareSecondFactor({ strategy: "email_code" })}
                >
                  <Text fontSize={13} color="#3b82f6" fontFamily="$body">
                    Reenviar código
                  </Text>
                </XStack>
              </YStack>
            ) : (
              /* ── Email + password form ── */
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
                    style={{ flex: 1, color: "#ffffff", fontSize: 14, height: 48 }}
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
                    style={{ flex: 1, color: "#ffffff", fontSize: 14, height: 48 }}
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

                {error && (
                  <Text fontSize={13} color="#ef4444" fontFamily="$body">
                    {error}
                  </Text>
                )}

                {/* Login Button */}
                <View
                  height={52}
                  borderRadius={14}
                  overflow="hidden"
                  position="relative"
                  pressStyle={{ opacity: 0.85 }}
                  onPress={handleLogin}
                  opacity={!email || !password || loading ? 0.6 : 1}
                >
                  <LinearGradient
                    colors={["#1e3a8a", "#2563eb", "#60a5fa"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                    pointerEvents="none"
                  />
                  <View flex={1} alignItems="center" justifyContent="center">
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text fontSize={15} fontWeight="700" color="#ffffff" fontFamily="$body">
                        Ingresar
                      </Text>
                    )}
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
            )}
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
