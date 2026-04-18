import { getUnreviewedCount } from "@/src/data/mock";
import { useColors } from "@/src/hooks/use-colors";
import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import { BarChart2, BellRing, Cctv, CircleUser, LayoutDashboard } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { Text, YStack } from "tamagui";
import { VigIALogoText } from "./vigia-logo-text";

const BLUE = "#3b82f6";
const INACTIVE = "#64748b";

const NAV_ITEMS = [
  { name: "home", label: "Inicio", href: "/(tabs)/home", Icon: LayoutDashboard },
  { name: "cameras", label: "Cámaras", href: "/(tabs)/cameras", Icon: Cctv },
  { name: "reports", label: "Reportes", href: "/(tabs)/reports", Icon: BarChart2 },
  { name: "alerts", label: "Alertas", href: "/(tabs)/alerts", Icon: BellRing },
  { name: "profile", label: "Perfil", href: "/(tabs)/profile", Icon: CircleUser },
] as const;

export function WebSidebar() {
  const colors = useColors();
  const router = useRouter();
  const pathname = usePathname();
  const unreviewedCount = getUnreviewedCount();

  return (
    <View
      style={{
        width: 220,
        height: "100%",
        backgroundColor: colors.card,
        borderRightWidth: 1,
        borderRightColor: colors.borderSoft,
        paddingTop: 24,
        paddingHorizontal: 12,
        flexShrink: 0,
      }}
    >
      <View style={{ paddingHorizontal: 8, marginBottom: 32 }}>
        <VigIALogoText height={24} />
      </View>

      <YStack gap={4}>
        {NAV_ITEMS.map(({ name, label, href, Icon }) => {
          const focused = pathname.includes(name);
          const isAlerts = name === "alerts";

          return (
            <View
              key={name}
              style={[
                {
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 10,
                  overflow: "hidden",
                  cursor: "pointer",
                } as any,
              ]}
              // @ts-ignore
              onClick={() => router.push(href)}
            >
              {focused && (
                <LinearGradient
                  colors={["rgba(30,58,138,0.15)", "rgba(96,165,250,0.08)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <View style={{ position: "relative" }}>
                <Icon
                  size={18}
                  color={focused ? BLUE : INACTIVE}
                  strokeWidth={focused ? 2.2 : 1.8}
                />
                {isAlerts && unreviewedCount > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      backgroundColor: "#f87171",
                      borderRadius: 8,
                      minWidth: 14,
                      height: 14,
                      alignItems: "center",
                      justifyContent: "center",
                      paddingHorizontal: 2,
                    }}
                  >
                    <Text style={{ fontSize: 8, fontWeight: "700", color: "#fff" }}>
                      {unreviewedCount > 9 ? "9+" : String(unreviewedCount)}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: focused ? "600" : "400",
                  color: focused ? BLUE : INACTIVE,
                  fontFamily: "DMSans_400Regular",
                }}
              >
                {label}
              </Text>
            </View>
          );
        })}
      </YStack>
    </View>
  );
}
