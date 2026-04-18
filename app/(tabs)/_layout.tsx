import { WebSidebar } from "@/src/components/web-sidebar";
import { getUnreviewedCount } from "@/src/data/mock";
import { useAppTheme } from "@/src/hooks/use-app-theme";
import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { useColors } from "@/src/hooks/use-colors";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import { BarChart2, BellRing, Cctv, CircleUser, LayoutDashboard } from "lucide-react-native";
import { Platform, StyleSheet, View } from "react-native";
import { Text } from "tamagui";

const BLUE = "#3b82f6";
const INACTIVE = "#64748b";

function TabBarIcon({
  IconComponent,
  focused,
  alertCount,
}: {
  IconComponent: React.ElementType;
  focused: boolean;
  alertCount?: number;
}) {
  return (
    <View style={styles.iconWrapper}>
      <View style={[styles.pill, focused && styles.pillActive]}>
        {focused && (
          <LinearGradient
            colors={["rgba(30,58,138,0.18)", "rgba(96,165,250,0.10)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}
        <IconComponent
          size={20}
          color={focused ? BLUE : INACTIVE}
          strokeWidth={focused ? 2.2 : 1.8}
        />
      </View>
      {alertCount != null && alertCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{alertCount > 9 ? "9+" : String(alertCount)}</Text>
        </View>
      )}
    </View>
  );
}

export default function TabLayout() {
  const unreviewedCount = getUnreviewedCount();
  const colors = useColors();
  const { theme } = useAppTheme();
  const { isWide } = useBreakpoint();

  const tabs = (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: isWide
          ? { display: "none" }
          : [styles.tabBar, { borderTopColor: colors.tabBorder, backgroundColor: "transparent" }],
        tabBarBackground: () =>
          isWide ? null : Platform.OS === "ios" ? (
            <BlurView
              intensity={80}
              tint={theme === "dark" ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.tabBar }]} />
          ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon IconComponent={LayoutDashboard} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="cameras"
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon IconComponent={Cctv} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon IconComponent={BarChart2} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon IconComponent={BellRing} focused={focused} alertCount={unreviewedCount} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon IconComponent={CircleUser} focused={focused} />,
        }}
      />
    </Tabs>
  );

  if (isWide) {
    return (
      <View style={{ flex: 1, flexDirection: "row", backgroundColor: colors.bg }}>
        <WebSidebar />
        <View style={{ flex: 1 }}>{tabs}</View>
      </View>
    );
  }

  return tabs;
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
    height: 68,
    paddingBottom: 10,
    paddingTop: 8,
    elevation: 0,
    backgroundColor: "transparent",
  },
  iconWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    width: 44,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  pillActive: {
    // gradient handles the background
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -4,
    backgroundColor: "#f87171",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#ffffff",
  },
});
