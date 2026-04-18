import type { LicensePlan } from "@/src/data/mock";
import { LICENSE_PLANS } from "@/src/data/mock";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ArrowLeft, Building2, Lock, Mail } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";

export default function SignupScreen() {
  const [org, setOrg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<LicensePlan>("STARTER");

  const handleSignup = async () => {
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
                Crear cuenta
              </Text>
              <Text
                fontSize={13}
                color="#64748b"
                fontFamily="$body"
                textAlign="center"
                marginTop={4}
              >
                Comienza tu prueba gratuita de 14 días
              </Text>
            </YStack>

            {/* Form */}
            <YStack gap={12} marginBottom={24}>
              <FieldRow icon={<Building2 size={16} color="#64748b" />}>
                <TextInput
                  style={{
                    flex: 1,
                    color: "#ffffff",
                    fontFamily: "DMSans_400Regular",
                    fontSize: 14,
                    height: 48,
                  }}
                  placeholder="Nombre de organización"
                  placeholderTextColor="#64748b"
                  value={org}
                  onChangeText={setOrg}
                  autoCapitalize="words"
                />
              </FieldRow>

              <FieldRow icon={<Mail size={16} color="#64748b" />}>
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
              </FieldRow>

              <FieldRow icon={<Lock size={16} color="#64748b" />}>
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
                  secureTextEntry
                />
              </FieldRow>
            </YStack>

            {/* Plan selector */}
            <YStack marginBottom={24} gap={10}>
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
                          alignItems="center"
                          justifyContent="center"
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
            >
              <LinearGradient
                colors={["#1e3a8a", "#2563eb", "#60a5fa"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
              <View flex={1} alignItems="center" justifyContent="center">
                <Text fontSize={14} fontWeight="700" color="#ffffff" fontFamily="$body">
                  Comenzar prueba gratuita de 14 días
                </Text>
              </View>
            </View>

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
