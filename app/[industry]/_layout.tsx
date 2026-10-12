import { IndustrySidebar } from "@/src/components/industry-sidebar";
import { PageContainer } from "@/src/components/page-container";
import { VigIALogoText } from "@/src/components/vigia-logo-text";
import { getIndustryById, isValidIndustry } from "@/src/data/industries";
import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { useColors } from "@/src/hooks/use-colors";
import { router, Slot, useLocalSearchParams, usePathname } from "expo-router";
import {
  Activity,
  BarChart2,
  Beef,
  BookOpen,
  Boxes,
  Building2,
  Camera,
  Car,
  ChevronRight,
  Clock,
  Cpu,
  Croissant,
  Dumbbell,
  Factory,
  Flame,
  GraduationCap,
  HardHat,
  Home,
  Hotel,
  Layers,
  LayoutDashboard,
  LucideIcon,
  Pill,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users,
  UtensilsCrossed,
} from "lucide-react-native";
import React from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View, XStack, YStack } from "tamagui";

const ICON_MAP: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Flame,
  ShoppingBag,
  ShoppingCart,
  Croissant,
  Factory,
  Beef,
  Cpu,
  Truck,
  Car,
  Building2,
  Hotel,
  Activity,
  HardHat,
  ShieldAlert,
  ShieldCheck,
  Dumbbell,
  Pill,
  GraduationCap,
  BookOpen,
};

export default function IndustryLayout() {
  const { industry } = useLocalSearchParams<{ industry: string }>();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const pathname = usePathname();
  const { isWide } = useBreakpoint();

  const industryConfig = industry ? getIndustryById(industry) : undefined;

  // Invalid industry handler
  if (!industry || !isValidIndustry(industry) || !industryConfig) {
    return (
      <PageContainer>
        <View
          flex={1}
          backgroundColor={colors.bg}
          alignItems="center"
          justifyContent="center"
          padding={24}
        >
          <YStack
            backgroundColor={colors.card}
            borderRadius={16}
            borderWidth={1}
            borderColor={colors.borderSoft}
            padding={28}
            alignItems="center"
            gap={14}
            maxWidth={440}
          >
            <View
              width={54}
              height={54}
              borderRadius={27}
              backgroundColor="rgba(248, 113, 113, 0.12)"
              alignItems="center"
              justifyContent="center"
            >
              <ShieldAlert size={28} color="#f87171" />
            </View>
            <Text
              fontSize={20}
              fontWeight="800"
              color={colors.text}
              fontFamily="$body"
              textAlign="center"
            >
              Industria no encontrada
            </Text>
            <Text
              fontSize={13}
              color={colors.textSec}
              fontFamily="$body"
              textAlign="center"
              lineHeight={18}
            >
              La ruta "{industry}" no corresponde a ninguna de las 18 industrias configuradas en la
              demo de VigIA.
            </Text>
            <TouchableOpacity
              onPress={() => router.replace("/menu" as any)}
              style={{
                backgroundColor: "#0A4CE8",
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginTop: 8,
              }}
            >
              <Layers size={16} color="#ffffff" />
              <Text fontSize={13} fontWeight="700" color="#ffffff" fontFamily="$body">
                Explorar los 18 Sectores
              </Text>
            </TouchableOpacity>
          </YStack>
        </View>
      </PageContainer>
    );
  }

  // DESKTOP & WIDE SCREEN: Elegant Full SaaS Sidebar Layout
  if (isWide) {
    return (
      <View style={{ flex: 1, flexDirection: "row", backgroundColor: colors.bg }}>
        <IndustrySidebar industryConfig={industryConfig} />
        <View style={{ flex: 1, minWidth: 0, backgroundColor: colors.bg }}>
          <Slot />
        </View>
      </View>
    );
  }

  // MOBILE: Clean App Bar (NO back button!) and Sub-Navigation
  const IconComponent = ICON_MAP[industryConfig.iconName] ?? Factory;
  const indId = industryConfig.id;

  const NAV_TABS = [
    { key: "home", label: "Dashboard", href: `/${indId}/home`, icon: LayoutDashboard },
    { key: "produccion", label: "Producción", href: `/${indId}/produccion`, icon: TrendingUp },
    { key: "operaciones", label: "Operaciones", href: `/${indId}/operaciones`, icon: Clock },
    { key: "personas", label: "Personas", href: `/${indId}/personas`, icon: Users },
    { key: "seguridad", label: "Seguridad", href: `/${indId}/seguridad`, icon: ShieldCheck },
    { key: "cameras", label: "Cámaras", href: `/${indId}/cameras`, icon: Camera },
    { key: "reports", label: "Reportes", href: `/${indId}/reports`, icon: BarChart2 },
    { key: "alerts", label: "Alertas", href: `/${indId}/alerts`, icon: ShieldAlert },
  ];

  return (
    <PageContainer>
      <View flex={1} backgroundColor={colors.bg}>
        {/* MOBILE APP HEADER (Clean, NO back button) */}
        <View
          backgroundColor={colors.card}
          borderBottomWidth={1}
          borderBottomColor={colors.borderSoft}
          paddingTop={Math.max(insets.top, 10)}
          paddingBottom={10}
          paddingHorizontal={16}
        >
          <XStack justifyContent="space-between" alignItems="center">
            <XStack alignItems="center" gap={10}>
              <VigIALogoText height={24} />
              <View height={16} width={1} backgroundColor={colors.borderSoft} />
              {/* Sector Pill */}
              <View
                style={{
                  backgroundColor: industryConfig.accentColor + "18",
                  borderWidth: 1,
                  borderColor: industryConfig.accentColor + "40",
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 6,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <IconComponent size={13} color={industryConfig.accentColor} />
                <Text
                  fontSize={11.5}
                  fontWeight="800"
                  color={industryConfig.accentColor}
                  fontFamily="$body"
                >
                  {industryConfig.shortName}
                </Text>
              </View>
            </XStack>

            {/* Quick Sector Switcher (18 Sectores) */}
            <TouchableOpacity
              onPress={() => router.push("/menu" as any)}
              style={{
                backgroundColor: "rgba(10, 76, 232, 0.12)",
                borderWidth: 1,
                borderColor: "rgba(33, 152, 244, 0.35)",
                paddingHorizontal: 9,
                paddingVertical: 5,
                borderRadius: 7,
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Layers size={13} color="#38bdf8" />
              <Text fontSize={11} fontWeight="700" color="#38bdf8" fontFamily="$body">
                Sectores (18)
              </Text>
            </TouchableOpacity>
          </XStack>

          {/* MOBILE SUB-NAVIGATION TABS */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6, paddingTop: 10 }}
          >
            {NAV_TABS.map((tab) => {
              const TabIcon = tab.icon;
              const isSelected =
                pathname.endsWith(`/${tab.key}`) ||
                (tab.key === "home" && (pathname === `/${indId}` || pathname === `/${indId}/`)) ||
                (tab.key === "cameras" && pathname.includes(`/${indId}/cameras`)) ||
                (tab.key === "alerts" && pathname.includes(`/${indId}/alerts`)) ||
                (tab.key === "reports" && pathname.includes(`/${indId}/reports`));

              return (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => router.push(tab.href as any)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 7,
                    borderRadius: 8,
                    backgroundColor: isSelected ? industryConfig.accentColor + "20" : "transparent",
                    borderWidth: 1,
                    borderColor: isSelected ? industryConfig.accentColor : "transparent",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <TabIcon
                    size={14}
                    color={isSelected ? industryConfig.accentColor : colors.textLabel}
                  />
                  <Text
                    fontSize={11.5}
                    fontWeight={isSelected ? "800" : "500"}
                    color={isSelected ? industryConfig.accentColor : colors.textLabel}
                    fontFamily="$body"
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* SCREEN CONTENT */}
        <View flex={1}>
          <Slot />
        </View>
      </View>
    </PageContainer>
  );
}
