import type { LicensePlan } from "@/src/data/mock";
import { LICENSE_PLANS } from "@/src/data/mock";
import { supabase } from "@/src/lib/supabase";
import { useAuth, useClerk } from "@clerk/expo";
import { useSignUp } from "@clerk/expo/legacy";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowLeft, Building2, Lock, Mail } from "lucide-react-native";
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

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  // Sufijo aleatorio de 4 chars para evitar colisiones de slug únicos
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}

export default function SignupScreen() {
  const { signUp, isLoaded } = useSignUp();
  const { getToken } = useAuth();
  const clerk = useClerk();
  const router = useRouter();

  const [org, setOrg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<LicensePlan>("STARTER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Email verification step
  const [needsVerification, setNeedsVerification] = useState(false);
  const [code, setCode] = useState("");

  const handleSignup = async () => {
    console.log(isLoaded, loading, "clicked");
    if (!signUp || loading) return;
    setLoading(true);
    setError(null);

    try {
      await signUp.create({
        emailAddress: email,
        password,
        unsafeMetadata: { orgName: org, plan: selectedPlan },
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setNeedsVerification(true);
    } catch (e: any) {
      setError(e?.errors?.[0]?.message ?? e?.message ?? "Error al crear cuenta");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    console.log("[signup] handleVerify called");
    if (!signUp || loading) {
      console.log("[signup] blocked: signUp missing or loading");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // 1. Verificar código con Clerk
      console.log("[signup] verifying email code...");
      const result = await signUp.attemptEmailAddressVerification({ code });
      console.log(
        "[signup] verification result:",
        result.status,
        "sessionId:",
        result.createdSessionId
      );

      if (result.status !== "complete") {
        setError("Verificación incompleta. Intenta de nuevo.");
        return;
      }

      // 2. Activar sesión Clerk INMEDIATAMENTE para que el token esté disponible
      console.log("[signup] activating Clerk session...");
      await clerk.setActive({ session: result.createdSessionId });
      console.log("[signup] Clerk session activated");

      // 3. Obtener token directamente de la sesión de Clerk por ID
      // (useAuth/getToken puede estar desfasado en el contexto de useSignUp legacy)
      console.log("[signup] fetching token from Clerk client sessions...");
      let token: string | null = null;
      let attempts = 0;
      while (!token && attempts < 5) {
        attempts++;
        const session = clerk.client.sessions.find((s: any) => s.id === result.createdSessionId);
        if (session) {
          token = await session.getToken({ template: "supabase" });
        }
        if (!token) {
          await new Promise((r) => setTimeout(r, 200));
        }
      }
      console.log("[signup] token attempts:", attempts, "length:", token?.length ?? 0);

      const clerkUserId = signUp.createdUserId ?? "";
      console.log("[signup] clerkUserId:", clerkUserId);

      if (!token) {
        console.error("[signup] NO TOKEN from Clerk after", attempts, "attempts");
        setError("Error de autenticación. Reinicia la app e intenta de nuevo.");
        return;
      }

      // 4. Inyectar token en cliente Supabase (para pasar RLS)
      console.log("[signup] injecting token into Supabase client...");
      await supabase.auth.setSession({ access_token: token, refresh_token: "" });
      console.log("[signup] Supabase session injected");

      // 5. Insertar tenant directamente en Supabase
      console.log("[signup] inserting tenant...", {
        org,
        slug: slugify(org),
        plan: selectedPlan.toLowerCase(),
      });
      const { data: tenant, error: tErr } = await supabase
        .from("tenants")
        .insert({ name: org, slug: slugify(org), plan: selectedPlan.toLowerCase() })
        .select()
        .single();

      if (tErr || !tenant) {
        console.error(
          "[signup] TENANT INSERT FAILED:",
          tErr?.message,
          "code:",
          tErr?.code,
          "details:",
          tErr?.details
        );
        setError(
          "Cuenta creada, pero error al crear organización: " + (tErr?.message ?? "unknown")
        );
        return;
      }
      console.log("[signup] tenant CREATED:", tenant.id);

      // 6. Insertar owner user
      console.log("[signup] inserting user row...", {
        tenant_id: tenant.id,
        clerk_user_id: clerkUserId,
      });
      const { error: uErr } = await supabase.from("users").insert({
        tenant_id: tenant.id,
        clerk_user_id: clerkUserId,
        role: "owner",
        full_name: org,
        is_active: true,
      });

      if (uErr) {
        console.error(
          "[signup] USER INSERT FAILED:",
          uErr.message,
          "code:",
          uErr.code,
          "details:",
          uErr.details
        );
        setError("Cuenta creada, pero error al guardar usuario: " + uErr.message);
      } else {
        console.log("[signup] user row CREATED for tenant:", tenant.id);
      }

      // 7. Navegar a splash screen para que ella decida basado en Clerk.session real
      console.log("[signup] navigating to splash screen...");
      router.replace("/");
    } catch (e: any) {
      console.error("[signup] CATCH ERROR:", e?.message ?? e);
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
          <YStack flex={1} padding={24} paddingTop={56} gap={0}>
            {/* Back */}
            <View
              width={36}
              height={36}
              borderRadius={10}
              backgroundColor="#0f172a"
              alignItems="center"
              justifyContent="center"
              marginBottom={20}
              pressStyle={{ opacity: 0.6 }}
              onPress={() => router.back()}
            >
              <ArrowLeft size={18} color="#94a3b8" />
            </View>

            {/* Logo */}
            <YStack alignItems="center" marginBottom={20}>
              <Image
                source={require("@/assets/images/logo-dark.png")}
                style={{ width: 160, height: 56 }}
                contentFit="contain"
              />
            </YStack>

            {/* Title */}
            <YStack marginBottom={24}>
              <Text
                fontSize={24}
                fontWeight="700"
                color="#ffffff"
                fontFamily="$body"
                textAlign="center"
              >
                {needsVerification ? "Verifica tu email" : "Crear cuenta"}
              </Text>
              <Text
                fontSize={13}
                color="#64748b"
                fontFamily="$body"
                textAlign="center"
                marginTop={4}
              >
                {needsVerification
                  ? `Ingresa el código que enviamos a ${email}`
                  : "Crea tu cuenta gratis"}
              </Text>
            </YStack>

            {needsVerification ? (
              /* ── Verification code ── */
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
                  onPress={handleVerify}
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
                        Verificar y entrar
                      </Text>
                    )}
                  </View>
                </View>
                <XStack
                  justifyContent="center"
                  marginTop={8}
                  pressStyle={{ opacity: 0.7 }}
                  onPress={() =>
                    signUp?.prepareEmailAddressVerification({ strategy: "email_code" })
                  }
                >
                  <Text fontSize={13} color="#3b82f6" fontFamily="$body">
                    Reenviar código
                  </Text>
                </XStack>
              </YStack>
            ) : (
              /* ── Registration form ── */
              <YStack gap={12} marginBottom={24}>
                {/* Clerk CAPTCHA anchor (required for bot protection on web) */}
                <View nativeID="clerk-captcha" />
                <FieldRow icon={<Building2 size={16} color="#64748b" />}>
                  <TextInput
                    style={{ flex: 1, color: "#ffffff", fontSize: 14, height: 48 }}
                    placeholder="Nombre de organización"
                    placeholderTextColor="#64748b"
                    value={org}
                    onChangeText={setOrg}
                    autoCapitalize="words"
                  />
                </FieldRow>

                <FieldRow icon={<Mail size={16} color="#64748b" />}>
                  <TextInput
                    style={{ flex: 1, color: "#ffffff", fontSize: 14, height: 48 }}
                    placeholder="Email corporativo"
                    placeholderTextColor="#64748b"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </FieldRow>

                <FieldRow icon={<Lock size={16} color="#64748b" />}>
                  <TextInput
                    style={{ flex: 1, color: "#ffffff", fontSize: 14, height: 48 }}
                    placeholder="Contraseña"
                    placeholderTextColor="#64748b"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </FieldRow>

                {error && (
                  <Text fontSize={13} color="#ef4444" fontFamily="$body">
                    {error}
                  </Text>
                )}

                {/* Plan selector */}
                <YStack marginTop={12} gap={10}>
                  <Text fontSize={13} fontWeight="600" color="#94a3b8" fontFamily="$body">
                    Elige tu plan
                  </Text>
                  <XStack gap={10}>
                    {LICENSE_PLANS.map((plan) => {
                      const isSelected = selectedPlan === plan.id;
                      return (
                        <YStack
                          key={plan.id}
                          flex={1}
                          backgroundColor={isSelected ? "rgba(59,130,246,0.08)" : "#0f172a"}
                          borderRadius={14}
                          borderWidth={1.5}
                          borderColor={isSelected ? "#3b82f6" : "#334155"}
                          padding={14}
                          gap={6}
                          pressStyle={{ opacity: 0.8 }}
                          onPress={() => setSelectedPlan(plan.id)}
                        >
                          <XStack justifyContent="space-between" alignItems="center">
                            <Text
                              fontSize={13}
                              fontWeight="700"
                              color={isSelected ? "#3b82f6" : "#ffffff"}
                              fontFamily="$mono"
                            >
                              {plan.id}
                            </Text>
                            <View
                              width={14}
                              height={14}
                              borderRadius={7}
                              borderWidth={1.5}
                              borderColor={isSelected ? "#3b82f6" : "#334155"}
                              backgroundColor={isSelected ? "#3b82f6" : "transparent"}
                            />
                          </XStack>
                          <Text fontSize={20} fontWeight="700" color="#ffffff" fontFamily="$mono">
                            ${plan.price}
                            <Text fontSize={11} color="#64748b" fontFamily="$body">
                              /mes
                            </Text>
                          </Text>
                          <Text fontSize={11} color="#94a3b8" fontFamily="$body">
                            Hasta {plan.maxCameras} cámaras
                          </Text>
                        </YStack>
                      );
                    })}
                  </XStack>
                </YStack>

                {/* CTA Button */}
                <View
                  height={52}
                  borderRadius={14}
                  overflow="hidden"
                  pressStyle={{ opacity: 0.85 }}
                  onPress={handleSignup}
                  marginTop={12}
                  position="relative"
                  opacity={!org || !email || !password || loading ? 0.6 : 1}
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
                      <Text fontSize={14} fontWeight="700" color="#ffffff" fontFamily="$body">
                        Crear cuenta
                      </Text>
                    )}
                  </View>
                </View>
              </YStack>
            )}

            <YStack height={24} />
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function FieldRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <XStack
      backgroundColor="#0f172a"
      borderRadius={12}
      borderWidth={1}
      borderColor="#334155"
      alignItems="center"
      paddingHorizontal={14}
      gap={10}
    >
      {icon}
      {children}
    </XStack>
  );
}
