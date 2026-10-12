import { IndustryConfig } from "@/src/data/industries";
import { useColors } from "@/src/hooks/use-colors";
import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import {
  Activity,
  ArrowRight,
  BarChart2,
  Beef,
  BellRing,
  BookOpen,
  Boxes,
  Building2,
  Camera,
  Car,
  ChevronDown,
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
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, XStack, YStack } from "tamagui";
import { VigIALogoText } from "./vigia-logo-text";

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

interface IndustrySidebarProps {
  industryConfig: IndustryConfig;
}

export function IndustrySidebar({ industryConfig }: IndustrySidebarProps) {
  const colors = useColors();
  const router = useRouter();
  const pathname = usePathname();
  const indId = industryConfig.id;
  const accent = industryConfig.accentColor;

  const IconComp = ICON_MAP[industryConfig.iconName] ?? Factory;

  const pendingAlerts = industryConfig.alerts.filter(
    (a) => a.severity === "ALTA" || a.status === "pending"
  ).length;

  const NAV_ITEMS = [
    {
      key: "home",
      label: "Dashboard",
      sublabel: "Visión general",
      href: `/${indId}/home`,
      icon: LayoutDashboard,
    },
    {
      key: "produccion",
      label: "A. Producción",
      sublabel: "Flujo y unidades",
      href: `/${indId}/produccion`,
      icon: TrendingUp,
    },
    {
      key: "operaciones",
      label: "B. Operaciones",
      sublabel: "Tiempos y cuellos",
      href: `/${indId}/operaciones`,
      icon: Clock,
    },
    {
      key: "personas",
      label: "C. Personas",
      sublabel: "Aforo y filas",
      href: `/${indId}/personas`,
      icon: Users,
    },
    {
      key: "seguridad",
      label: "D. Seguridad",
      sublabel: "EPP y perímetros",
      href: `/${indId}/seguridad`,
      icon: ShieldCheck,
    },
    {
      key: "cameras",
      label: "Cámaras en Vivo",
      sublabel: `${industryConfig.cameras.length} canales IP`,
      href: `/${indId}/cameras`,
      icon: Camera,
    },
    {
      key: "reports",
      label: "Reportes & KPIs",
      sublabel: "Auditoría ejecutiva",
      href: `/${indId}/reports`,
      icon: BarChart2,
    },
    {
      key: "alerts",
      label: "Alertas y Eventos",
      sublabel: "Visión artificial",
      href: `/${indId}/alerts`,
      icon: BellRing,
      badge: pendingAlerts,
    },
  ];

  return (
    <View
      style={{
        width: 250,
        height: "100%",
        backgroundColor: colors.card,
        borderRightWidth: 1,
        borderRightColor: colors.borderSoft,
        paddingTop: 20,
        paddingHorizontal: 14,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <YStack flex={1}>
        {/* BRAND & SECTOR IDENTITY */}
        <YStack gap={12} paddingHorizontal={4} marginBottom={16}>
          <VigIALogoText height={26} />

          {/* Current Industry Badge with Accent Glow */}
          <View
            style={{
              backgroundColor: accent + "15",
              borderWidth: 1,
              borderColor: accent + "45",
              borderRadius: 10,
              padding: 10,
            }}
          >
            <XStack alignItems="center" gap={9}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: accent + "25",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconComp size={17} color={accent} />
              </View>
              <YStack flex={1}>
                <Text
                  style={{
                    fontSize: 12.5,
                    fontWeight: "800",
                    color: colors.text,
                    fontFamily: "PlusJakartaSans",
                  }}
                  numberOfLines={1}
                >
                  {industryConfig.shortName}
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "700",
                    color: accent,
                    fontFamily: "IBMPlexMono",
                    letterSpacing: 0.5,
                  }}
                >
                  DEMO SECTORIAL
                </Text>
              </YStack>
            </XStack>
          </View>

          {/* Sector Switcher Button (NO back button, smooth selector!) */}
          <TouchableOpacity
            onPress={() => router.push("/menu" as any)}
            style={{
              backgroundColor: "rgba(10, 76, 232, 0.12)",
              borderWidth: 1,
              borderColor: "rgba(33, 152, 244, 0.35)",
              paddingHorizontal: 10,
              paddingVertical: 7,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <XStack alignItems="center" gap={7}>
              <Layers size={14} color="#38bdf8" />
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "700",
                  color: "#38bdf8",
                  fontFamily: "PlusJakartaSans",
                }}
              >
                Cambiar de Sector
              </Text>
            </XStack>
            <View
              style={{
                backgroundColor: "rgba(56, 189, 248, 0.2)",
                paddingHorizontal: 5,
                paddingVertical: 2,
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: "800",
                  color: "#38bdf8",
                  fontFamily: "IBMPlexMono",
                }}
              >
                18 DEMOS
              </Text>
            </View>
          </TouchableOpacity>
        </YStack>

        {/* ASSIGNED USER CARD */}
        <View
          style={{
            backgroundColor: colors.bg,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.borderSoft,
            padding: 10,
            marginBottom: 16,
          }}
        >
          <XStack alignItems="center" gap={9}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: accent + "25",
                borderWidth: 1.5,
                borderColor: accent,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "800",
                  color: accent,
                  fontFamily: "IBMPlexMono",
                }}
              >
                {industryConfig.assignedUser.initials}
              </Text>
            </View>
            <YStack flex={1}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: colors.text,
                  fontFamily: "PlusJakartaSans",
                }}
                numberOfLines={1}
              >
                {industryConfig.assignedUser.name}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: colors.textLabel,
                  fontFamily: "PlusJakartaSans",
                }}
                numberOfLines={1}
              >
                {industryConfig.assignedUser.role}
              </Text>
            </YStack>
          </XStack>
        </View>

        {/* VERTICAL NAVIGATION LINKS */}
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <YStack gap={3}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isSelected =
                pathname.endsWith(`/${item.key}`) ||
                (item.key === "home" && (pathname === `/${indId}` || pathname === `/${indId}/`)) ||
                (item.key === "cameras" && pathname.includes(`/${indId}/cameras`)) ||
                (item.key === "alerts" && pathname.includes(`/${indId}/alerts`)) ||
                (item.key === "reports" && pathname.includes(`/${indId}/reports`));

              return (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => router.push(item.href as any)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 11,
                    paddingVertical: 9,
                    borderRadius: 9,
                    backgroundColor: isSelected ? accent + "18" : "transparent",
                    borderWidth: 1,
                    borderColor: isSelected ? accent + "50" : "transparent",
                  }}
                >
                  <XStack alignItems="center" gap={10} flex={1}>
                    <Icon
                      size={17}
                      color={isSelected ? accent : colors.textLabel}
                      strokeWidth={isSelected ? 2.2 : 1.8}
                    />
                    <YStack flex={1}>
                      <Text
                        style={{
                          fontSize: 12.5,
                          fontWeight: isSelected ? "800" : "500",
                          color: isSelected ? accent : colors.text,
                          fontFamily: "PlusJakartaSans",
                        }}
                        numberOfLines={1}
                      >
                        {item.label}
                      </Text>
                      <Text
                        style={{
                          fontSize: 9.5,
                          color: isSelected ? accent + "cc" : colors.textLabel,
                          fontFamily: "PlusJakartaSans",
                        }}
                        numberOfLines={1}
                      >
                        {item.sublabel}
                      </Text>
                    </YStack>
                  </XStack>

                  {item.badge != null && item.badge > 0 && (
                    <View
                      style={{
                        backgroundColor: "#ef4444",
                        borderRadius: 10,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 9.5,
                          fontWeight: "800",
                          color: "#ffffff",
                          fontFamily: "IBMPlexMono",
                        }}
                      >
                        {item.badge}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </YStack>
        </ScrollView>
      </YStack>

      {/* FOOTER & SYSTEM STATUS */}
      <YStack
        gap={8}
        paddingTop={12}
        borderTopWidth={1}
        borderTopColor={colors.borderSoft}
        paddingBottom={14}
      >
        {/* Quick Link to General Demo */}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/home" as any)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 10,
            paddingVertical: 7,
            borderRadius: 8,
            backgroundColor: colors.bg,
            borderWidth: 1,
            borderColor: colors.borderSoft,
          }}
        >
          <XStack alignItems="center" gap={7}>
            <Home size={13} color="#38bdf8" />
            <Text
              style={{
                fontSize: 11,
                fontWeight: "600",
                color: colors.textSec,
                fontFamily: "PlusJakartaSans",
              }}
            >
              Demo General VigIA
            </Text>
          </XStack>
          <ChevronRight size={12} color={colors.textLabel} />
        </TouchableOpacity>

        {/* Live Stream / AI Status Indicator */}
        <XStack alignItems="center" gap={6} paddingHorizontal={4}>
          <View
            style={{
              width: 7,
              height: 7,
              borderRadius: 4,
              backgroundColor: "#10b981",
            }}
          />
          <Text style={{ fontSize: 9.5, color: colors.textLabel, fontFamily: "IBMPlexMono" }}>
            IA RTSP Activa · 30 FPS · 0.2s
          </Text>
        </XStack>
      </YStack>
    </View>
  );
}
