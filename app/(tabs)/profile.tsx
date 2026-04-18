import { PageContainer } from "@/src/components/page-container";
import { LICENSE, USER } from "@/src/data/mock";
import { useAppTheme } from "@/src/hooks/use-app-theme";
import { useColors } from "@/src/hooks/use-colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Bell, ChevronRight, LogOut, Monitor, Moon, Settings, Sun, Zap } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, Switch } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View, XStack, YStack } from "tamagui";

type ThemeOption = "dark" | "light" | "system";

const THEME_OPTIONS: { id: ThemeOption; label: string; Icon: React.ElementType }[] = [
  { id: "dark", label: "Oscuro", Icon: Moon },
  { id: "light", label: "Claro", Icon: Sun },
  { id: "system", label: "Sistema", Icon: Monitor },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { theme: appTheme, setTheme: setAppTheme } = useAppTheme();
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(
    appTheme === "dark" ? "dark" : "light"
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [realTimeAlerts, setRealTimeAlerts] = useState(true);

  const handleThemeChange = async (option: ThemeOption) => {
    setSelectedTheme(option);
    const resolved = option === "system" ? "dark" : option;
    await setAppTheme(resolved);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("vigia_session");
    router.replace("/auth/login");
  };

  const licenseExpiry = new Date(LICENSE.expiresAt);
  const expiryColor =
    LICENSE.daysRemaining < 30 ? "#f87171" : LICENSE.daysRemaining < 60 ? "#fbbf24" : "#34d399";

  const licenseProgress = Math.min(
    (new Date().getFullYear() - new Date(LICENSE.startedAt).getFullYear()) * 365 +
      ((new Date().getMonth() - new Date(LICENSE.startedAt).getMonth()) * 30) / 365,
    1
  );
  const periodProgress = 1 - LICENSE.daysRemaining / 365;

  return (
    <PageContainer>
      <View flex={1} backgroundColor={colors.bg}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header */}
          <YStack
            paddingTop={insets.top + 16}
            paddingHorizontal={20}
            paddingBottom={24}
            alignItems="center"
            gap={10}
          >
            {/* Avatar */}
            <View width={72} height={72} borderRadius={36} overflow="hidden">
              <LinearGradient
                colors={["#1e3a8a", "#3b82f6", "#60a5fa"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View flex={1} alignItems="center" justifyContent="center">
                <Text fontSize={24} fontWeight="700" color="#ffffff" fontFamily="$mono">
                  {USER.initials}
                </Text>
              </View>
            </View>

            <Text fontSize={18} fontWeight="700" color={colors.text} fontFamily="$body">
              {USER.name}
            </Text>
            <Text fontSize={13} color={colors.textTer} fontFamily="$body">
              {USER.role}
            </Text>
            <Text fontSize={12} color={colors.textLabel} fontFamily="$body">
              {USER.email}
            </Text>
          </YStack>

          {/* License Card */}
          <View marginHorizontal={16} marginBottom={20} borderRadius={16} overflow="hidden">
            <View
              borderRadius={16}
              borderWidth={1}
              overflow="hidden"
              style={{ borderColor: "transparent" }}
            >
              {/* Gradient border hack */}
              <LinearGradient
                colors={["#1e3a8a", "#3b82f6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View margin={1} borderRadius={15} overflow="hidden">
                <LinearGradient colors={["#1e293b", "#0f172a"]} style={StyleSheet.absoluteFill} />
                <YStack padding={18} gap={14}>
                  {/* Plan badge */}
                  <XStack justifyContent="space-between" alignItems="center">
                    <View borderRadius={8} overflow="hidden">
                      <LinearGradient
                        colors={["#1e3a8a", "#3b82f6"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={StyleSheet.absoluteFill}
                      />
                      <View paddingHorizontal={12} paddingVertical={5}>
                        <Text
                          fontSize={11}
                          fontWeight="700"
                          fontFamily="$mono"
                          color="#ffffff"
                          letterSpacing={1.5}
                        >
                          {LICENSE.plan}
                        </Text>
                      </View>
                    </View>
                    <Zap size={18} color="#3b82f6" />
                  </XStack>

                  <Text fontSize={18} fontWeight="700" color="#ffffff" fontFamily="$body">
                    Plan {LICENSE.plan === "PRO" ? "Profesional" : "Starter"}
                  </Text>

                  {/* Metrics */}
                  <XStack gap={20}>
                    <YStack gap={2}>
                      <Text fontSize={20} fontWeight="700" fontFamily="$mono" color="#3b82f6">
                        {LICENSE.camerasUsed}/{LICENSE.camerasTotal}
                      </Text>
                      <Text fontSize={11} color="#64748b" fontFamily="$body">
                        Cámaras activas
                      </Text>
                    </YStack>
                    <View width={1} backgroundColor="#334155" />
                    <YStack gap={2}>
                      <Text fontSize={20} fontWeight="700" fontFamily="$mono" color={expiryColor}>
                        {LICENSE.daysRemaining}
                      </Text>
                      <Text fontSize={11} color="#64748b" fontFamily="$body">
                        Días restantes
                      </Text>
                    </YStack>
                  </XStack>

                  {/* Progress bar */}
                  <YStack gap={6}>
                    <View
                      height={6}
                      borderRadius={3}
                      backgroundColor={colors.border}
                      overflow="hidden"
                    >
                      <View
                        height={6}
                        borderRadius={3}
                        width={`${Math.round(periodProgress * 100)}%` as `${number}%`}
                        backgroundColor={expiryColor}
                      />
                    </View>
                    <XStack justifyContent="space-between">
                      <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
                        Inicio
                      </Text>
                      <Text fontSize={10} color={expiryColor} fontFamily="$body" fontWeight="600">
                        Vence{" "}
                        {licenseExpiry.toLocaleDateString("es-BO", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </Text>
                    </XStack>
                  </YStack>

                  {/* Manage button */}
                  <View
                    height={42}
                    borderRadius={10}
                    borderWidth={1}
                    borderColor={colors.border}
                    alignItems="center"
                    justifyContent="center"
                    pressStyle={{ opacity: 0.7 }}
                  >
                    <Text fontSize={13} fontWeight="600" color={colors.textTer} fontFamily="$body">
                      Gestionar licencia
                    </Text>
                  </View>
                </YStack>
              </View>
            </View>
          </View>

          {/* Organization */}
          <SectionCard title="Organización">
            <InfoRow label="Empresa" value={USER.organization} />
            <Divider />
            <InfoRow label="Ubicación" value={USER.location} />
            <Divider />
            <InfoRow label="Cámaras activas" value={String(USER.activeCameras)} />
          </SectionCard>

          {/* Preferences */}
          <SectionCard title="Preferencias">
            {/* Theme selector */}
            <YStack padding={14} gap={10}>
              <Text fontSize={12} color={colors.textLabel} fontFamily="$body">
                Tema de la aplicación
              </Text>
              <XStack gap={8}>
                {THEME_OPTIONS.map(({ id, label, Icon }) => {
                  const isSelected = selectedTheme === id;
                  return (
                    <YStack
                      key={id}
                      flex={1}
                      alignItems="center"
                      paddingVertical={10}
                      borderRadius={10}
                      borderWidth={1}
                      borderColor={isSelected ? "#3b82f6" : colors.border}
                      backgroundColor={isSelected ? "rgba(59,130,246,0.1)" : colors.cardAlt}
                      gap={6}
                      pressStyle={{ opacity: 0.7 }}
                      onPress={() => handleThemeChange(id)}
                    >
                      <Icon size={16} color={isSelected ? "#3b82f6" : colors.textLabel} />
                      <Text
                        fontSize={11}
                        fontFamily="$body"
                        fontWeight="600"
                        color={isSelected ? "#3b82f6" : colors.textLabel}
                      >
                        {label}
                      </Text>
                    </YStack>
                  );
                })}
              </XStack>
            </YStack>
            <Divider />
            <XStack padding={14} justifyContent="space-between" alignItems="center">
              <XStack gap={10} alignItems="center">
                <Bell size={16} color={colors.textLabel} />
                <Text fontSize={13} color={colors.textSec} fontFamily="$body">
                  Notificaciones push
                </Text>
              </XStack>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.border, true: "rgba(59,130,246,0.5)" }}
                thumbColor={notificationsEnabled ? "#3b82f6" : colors.textLabel}
              />
            </XStack>
            <Divider />
            <XStack padding={14} justifyContent="space-between" alignItems="center">
              <XStack gap={10} alignItems="center">
                <Zap size={16} color={colors.textLabel} />
                <Text fontSize={13} color={colors.textSec} fontFamily="$body">
                  Alertas en tiempo real
                </Text>
              </XStack>
              <Switch
                value={realTimeAlerts}
                onValueChange={setRealTimeAlerts}
                trackColor={{ false: colors.border, true: "rgba(59,130,246,0.5)" }}
                thumbColor={realTimeAlerts ? "#3b82f6" : colors.textLabel}
              />
            </XStack>
            <Divider />
            {/* Settings link */}
            <XStack
              padding={14}
              justifyContent="space-between"
              alignItems="center"
              pressStyle={{ opacity: 0.7 }}
              onPress={() => router.push("/settings")}
            >
              <XStack gap={10} alignItems="center">
                <Settings size={16} color={colors.textLabel} />
                <Text fontSize={13} color={colors.textSec} fontFamily="$body">
                  Configuración avanzada
                </Text>
              </XStack>
              <ChevronRight size={16} color={colors.textLabel} />
            </XStack>
          </SectionCard>

          {/* Logout */}
          <View marginHorizontal={16} marginTop={4} marginBottom={20}>
            <XStack
              height={50}
              borderRadius={12}
              backgroundColor="rgba(248,113,113,0.1)"
              borderWidth={1}
              borderColor="rgba(248,113,113,0.2)"
              alignItems="center"
              justifyContent="center"
              gap={10}
              pressStyle={{ opacity: 0.7 }}
              onPress={handleLogout}
            >
              <LogOut size={16} color="#f87171" />
              <Text fontSize={14} fontWeight="600" color="#f87171" fontFamily="$body">
                Cerrar sesión
              </Text>
            </XStack>
          </View>
        </ScrollView>
      </View>
    </PageContainer>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  const colors = useColors();
  return (
    <YStack marginHorizontal={16} marginBottom={14}>
      <Text
        fontSize={11}
        fontWeight="700"
        color={colors.textLabel}
        fontFamily="$body"
        letterSpacing={1.2}
        marginBottom={8}
        marginLeft={4}
      >
        {title.toUpperCase()}
      </Text>
      <View
        backgroundColor={colors.card}
        borderRadius={14}
        borderWidth={1}
        borderColor={colors.borderSoft}
        overflow="hidden"
      >
        {children}
      </View>
    </YStack>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const colors = useColors();
  return (
    <XStack padding={14} justifyContent="space-between" alignItems="center">
      <Text fontSize={12} color={colors.textLabel} fontFamily="$body">
        {label}
      </Text>
      <Text
        fontSize={13}
        color={colors.textSec}
        fontFamily="$body"
        fontWeight="500"
        maxWidth={200}
        textAlign="right"
      >
        {value}
      </Text>
    </XStack>
  );
}

function Divider() {
  const colors = useColors();
  return <View height={1} backgroundColor={colors.borderSoft} />;
}
