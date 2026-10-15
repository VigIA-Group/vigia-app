import { EventItemCard } from "@/src/components/event-item-card";
import { InsightCard } from "@/src/components/insight-card";
import { KPICard } from "@/src/components/kpi-card";
import { ModuleCard } from "@/src/components/module-card";
import { PageContainer } from "@/src/components/page-container";
import { RestaurantTableServiceCard } from "@/src/components/charts/restaurant-table-service-card";
import { VigIALogoText } from "@/src/components/vigia-logo-text";
import { getIndustryById } from "@/src/data/industries";
import {
  EventItem,
  Insight,
  KPI,
  Module,
  ModuleId,
  MODULES,
} from "@/src/data/mock";
import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { useColors } from "@/src/hooks/use-colors";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { BarChart2, Bell, ChevronRight, Layers } from "lucide-react-native";
import React from "react";
import { Platform, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View, XStack, YStack } from "tamagui";

const TODAY = new Date("2026-09-09");
const DAY_NAMES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MONTH_NAMES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
}

export default function IndustryHomeScreen() {
  const { industry } = useLocalSearchParams<{ industry: string }>();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { isDesktop } = useBreakpoint();

  const ind = industry ? getIndustryById(industry) : undefined;
  if (!ind) return null;

  // 1. Adapting KPIs to KPICard type
  const allKPIs: KPI[] = ind.kpis.map((k) => ({
    id: k.id,
    label: k.label,
    value: k.value,
    change: k.change,
    changePositive: k.changePositive,
    period: k.period,
    icon: k.icon,
    accentColor: k.accentColor,
  }));

  // 2. Adapting recent events/alerts to EventItemCard type
  const recentEvents: EventItem[] = ind.alerts.slice(0, 5).map((alt, idx) => ({
    id: alt.id,
    type: alt.title,
    cameraId: alt.cameraId || "cam-001",
    cameraName: alt.cameraName,
    zone: alt.zone,
    module: (idx % 2 === 0 ? "people" : idx % 3 === 0 ? "intrusion" : "ocr") as ModuleId,
    timestamp: alt.timestamp.includes(":")
      ? `2026-09-09T${alt.timestamp}:00`
      : new Date().toISOString(),
    severity: alt.severity,
    title: alt.title,
    description: alt.desc,
    reviewed: alt.status === "reviewed",
    hasVideoClip: true,
  }));

  // 3. Adapting active modules to ModuleCard type with sector context
  const activeModules: Module[] = MODULES.slice(0, 4).map((mod, idx) => {
    if (idx === 0) {
      return {
        ...mod,
        name: ind.production.unitName ? `Flujo ${ind.production.unitName}` : mod.name,
        stat: String(ind.production.totalProduced || "1,204"),
        statLabel: ind.production.unitName || "Unidades hoy",
      };
    }
    if (idx === 1) {
      return {
        ...mod,
        name: "Aforo & Personas",
        stat: String(ind.people.trafficToday.currentOccupancy || "48"),
        statLabel: "Ocupación actual",
      };
    }
    if (idx === 2) {
      return {
        ...mod,
        name: "Permanencia Zonas",
        stat: String(ind.operations.bottlenecks.length || "2"),
        statLabel: "Cuellos de botella",
      };
    }
    return {
      ...mod,
      name: "Seguridad & EPP",
      stat: String(ind.alerts.length || "0"),
      statLabel: "Alertas activas",
    };
  });

  // 4. Adapting 7-day traffic chart
  const dailyPoints = ind.people.dayComparison.map((d) => ({
    day: d.day,
    count: d.count,
  }));
  const maxDaily = Math.max(...dailyPoints.map((d) => d.count), 1);
  const weeklyChange = parseFloat(ind.kpis[0]?.change?.replace(/[^0-9.-]/g, "") || "12.4");

  // 5. Adapting insights
  const sectorInsights: Insight[] = ind.insights.slice(0, 3).map((ins) => ({
    id: ins.id,
    type: ins.positive ? "positive" : ins.type === "alert" ? "critical" : "warning",
    title: ins.title,
    description: ins.desc,
    metric: ins.change,
    recommendation: ins.actionLabel || ins.desc,
    source: "general" as const,
  }));

  const unreviewedCount = ind.alerts.filter((a) => a.status === "pending").length;

  // ── Sections matching normal demo ─────────────────────────────────

  const greeting = (
    <YStack paddingHorizontal={20} paddingTop={4} marginBottom={24}>
      <Text fontSize={isDesktop ? 32 : 26} fontWeight="700" color={colors.text} fontFamily="$body">
        {getGreeting()},{" "}
        <Text fontSize={isDesktop ? 32 : 26} fontWeight="700" fontFamily="$body" color="#60a5fa">
          {ind.assignedUser.name.split(" ")[0]}
        </Text>
      </Text>
      <Text
        fontSize={isDesktop ? 16 : 14}
        color={colors.textLabel}
        fontFamily="$body"
        marginTop={4}
      >
        {ind.assignedUser.role} · {ind.assignedUser.organization}
      </Text>
      <Text
        fontSize={isDesktop ? 14 : 12}
        color={colors.textTer}
        fontFamily="$body"
        marginTop={2}
      >
        {DAY_NAMES[TODAY.getDay()]}, {TODAY.getDate()} de {MONTH_NAMES[TODAY.getMonth()]}{" "}
        {TODAY.getFullYear()}
      </Text>
    </YStack>
  );

  const industryBanner = (
    <View paddingHorizontal={20} marginBottom={20}>
      <TouchableOpacity
        onPress={() => router.push("/menu" as any)}
        style={{
          borderRadius: 14,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "rgba(33, 152, 244, 0.35)",
        }}
      >
        <LinearGradient
          colors={["#050E1D", "#02209A", "#0A4CE8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ padding: 14 }}
        >
          <XStack justifyContent="space-between" alignItems="center">
            <XStack alignItems="center" gap={10} flex={1}>
              <View
                width={36}
                height={36}
                borderRadius={10}
                backgroundColor="rgba(33, 152, 244, 0.2)"
                alignItems="center"
                justifyContent="center"
              >
                <Layers size={18} color="#38bdf8" />
              </View>
              <YStack flex={1} gap={2}>
                <XStack alignItems="center" gap={6}>
                  <Text fontSize={12} fontWeight="800" color="#ffffff" fontFamily="$body">
                    Sector: {ind.name}
                  </Text>
                  <View
                    backgroundColor="rgba(56, 189, 248, 0.2)"
                    paddingHorizontal={6}
                    paddingVertical={2}
                    borderRadius={4}
                  >
                    <Text fontSize={9} fontWeight="700" color="#38bdf8" fontFamily="$mono">
                      {ind.cameras.length} CÁMARAS IP
                    </Text>
                  </View>
                </XStack>
                <Text fontSize={10.5} color="rgba(255, 255, 255, 0.75)" fontFamily="$body">
                  Cambiar de industria o volver al selector general
                </Text>
              </YStack>
            </XStack>
            <ChevronRight size={16} color="#38bdf8" />
          </XStack>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const kpiCards = (
    <YStack marginBottom={28}>
      {isDesktop ? (
        <XStack paddingHorizontal={20} gap={10} flexWrap="wrap">
          {allKPIs.map((kpi, i) => (
            <View key={kpi.id} flex={1} minWidth={140}>
              <KPICard kpi={kpi} index={i} />
            </View>
          ))}
        </XStack>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
        >
          {allKPIs.map((kpi, i) => (
            <KPICard key={kpi.id} kpi={kpi} index={i} />
          ))}
        </ScrollView>
      )}
    </YStack>
  );

  const recentActivity = (
    <YStack marginBottom={28} paddingHorizontal={20}>
      <XStack justifyContent="space-between" alignItems="center" marginBottom={14}>
        <Text
          fontSize={isDesktop ? 20 : 17}
          fontWeight="700"
          color={colors.text}
          fontFamily="$body"
        >
          Actividad reciente
        </Text>
        <View pressStyle={{ opacity: 0.7 }} onPress={() => router.push(`/${ind.id}/alerts` as any)}>
          <Text fontSize={isDesktop ? 14 : 13} color="#3b82f6" fontFamily="$body" fontWeight="600">
            Ver todo
          </Text>
        </View>
      </XStack>
      <View
        backgroundColor={colors.card}
        borderRadius={14}
        borderWidth={1}
        borderColor={colors.borderSoft}
        overflow="hidden"
      >
        {recentEvents.map((event, i) => (
          <View key={event.id}>
            {i > 0 && <View height={1} backgroundColor={colors.borderSoft} marginHorizontal={12} />}
            <EventItemCard
              event={event}
              onPress={() => router.push(`/${ind.id}/alerts/${event.id}` as any)}
            />
          </View>
        ))}
      </View>
    </YStack>
  );

  const activeModulesSection = (
    <YStack marginBottom={28} paddingHorizontal={20}>
      <XStack justifyContent="space-between" alignItems="center" marginBottom={14}>
        <Text
          fontSize={isDesktop ? 20 : 17}
          fontWeight="700"
          color={colors.text}
          fontFamily="$body"
        >
          Módulos activos
        </Text>
        <View pressStyle={{ opacity: 0.7 }} onPress={() => router.push(`/${ind.id}/reports` as any)}>
          <Text fontSize={isDesktop ? 14 : 13} color="#3b82f6" fontFamily="$body" fontWeight="600">
            Ver métricas
          </Text>
        </View>
      </XStack>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack gap={12}>
          {activeModules.map((mod) => (
            <View key={mod.id} width={150} minHeight={185}>
              <ModuleCard module={mod} />
            </View>
          ))}
        </XStack>
      </ScrollView>
    </YStack>
  );

  const restaurantServiceSection =
    ind.id === "restaurantes" || ind.id === "cocinas-profesionales" ? (
      <View paddingHorizontal={20} marginBottom={28}>
        <RestaurantTableServiceCard />
      </View>
    ) : null;

  const weekReport = (
    <YStack paddingHorizontal={20} marginBottom={28}>
      <XStack justifyContent="space-between" alignItems="center" marginBottom={14}>
        <Text
          fontSize={isDesktop ? 20 : 17}
          fontWeight="700"
          color={colors.text}
          fontFamily="$body"
        >
          Reporte de la semana
        </Text>
        <View pressStyle={{ opacity: 0.7 }} onPress={() => router.push(`/${ind.id}/reports` as any)}>
          <Text fontSize={isDesktop ? 14 : 13} color="#3b82f6" fontFamily="$body" fontWeight="600">
            Ver reportes
          </Text>
        </View>
      </XStack>
      <View
        backgroundColor={colors.card}
        borderRadius={14}
        borderWidth={1}
        borderColor={colors.borderSoft}
        padding={16}
      >
        <XStack justifyContent="space-between" alignItems="center" marginBottom={24}>
          <Text fontSize={isDesktop ? 14 : 13} color={colors.textLabel} fontFamily="$body">
            {ind.production.unitName || "Flujo"} — últimos 7 días
          </Text>
          <Text
            fontSize={11}
            fontWeight="700"
            color={weeklyChange >= 0 ? "#34d399" : "#f87171"}
            fontFamily="$mono"
          >
            {weeklyChange >= 0 ? "+" : ""}
            {weeklyChange}% vs. semana anterior
          </Text>
        </XStack>
        <XStack alignItems="flex-end" gap={6} height={64}>
          {dailyPoints.map((point) => {
            const barH = Math.max(4, (point.count / maxDaily) * 64);
            const isToday = point.day === "Mar";
            return (
              <YStack key={point.day} flex={1} alignItems="center" gap={4}>
                <View
                  height={barH}
                  borderRadius={4}
                  width="100%"
                  overflow="hidden"
                  style={{ marginTop: 64 - barH }}
                >
                  {isToday ? (
                    <LinearGradient
                      colors={["#02209A", "#0A4CE8", "#056EFA"]}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 0, y: 0 }}
                      style={{ flex: 1 }}
                    />
                  ) : (
                    <View flex={1} backgroundColor={colors.cardAlt} />
                  )}
                </View>
                <Text
                  fontSize={10}
                  color={isToday ? "#3b82f6" : colors.textLabel}
                  fontFamily="$mono"
                >
                  {point.day}
                </Text>
              </YStack>
            );
          })}
        </XStack>
      </View>
    </YStack>
  );

  const insights = (
    <YStack paddingHorizontal={20} marginBottom={28}>
      <XStack justifyContent="space-between" alignItems="center" marginBottom={14}>
        <Text
          fontSize={isDesktop ? 20 : 17}
          fontWeight="700"
          color={colors.text}
          fontFamily="$body"
        >
          Insights
        </Text>
        <View pressStyle={{ opacity: 0.7 }} onPress={() => router.push(`/${ind.id}/alerts` as any)}>
          <Text fontSize={isDesktop ? 14 : 13} color="#3b82f6" fontFamily="$body" fontWeight="600">
            Ver todos
          </Text>
        </View>
      </XStack>
      {sectorInsights.map((ins) => (
        <InsightCard key={ins.id} insight={ins} compact />
      ))}
    </YStack>
  );

  const heatmap = (
    <YStack paddingHorizontal={20} marginBottom={28}>
      <Text
        fontSize={isDesktop ? 20 : 17}
        fontWeight="700"
        color={colors.text}
        fontFamily="$body"
        marginBottom={14}
      >
        Mapa de calor
      </Text>
      <View
        backgroundColor={colors.card}
        borderRadius={14}
        borderWidth={1}
        borderColor={colors.borderSoft}
        overflow="hidden"
        height={200}
      >
        <Image source={require("@/assets/heatmap.png")} style={{ flex: 1 }} contentFit="cover" />
      </View>
    </YStack>
  );

  const quickLink = (
    <View paddingHorizontal={20} marginBottom={28}>
      <View
        borderRadius={14}
        overflow="hidden"
        pressStyle={{ opacity: 0.8 }}
        onPress={() => router.push(`/${ind.id}/reports` as any)}
      >
        <LinearGradient
          colors={["#1e3a8a", "#2563eb", "#3b82f6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ padding: 16 }}
        >
          <XStack alignItems="center" gap={12}>
            <View
              width={48}
              height={48}
              borderRadius={12}
              backgroundColor="rgba(255,255,255,0.15)"
              alignItems="center"
              justifyContent="center"
            >
              <BarChart2 size={24} color="#ffffff" />
            </View>
            <YStack flex={1}>
              <Text
                fontSize={isDesktop ? 16 : 15}
                fontWeight="700"
                color="#ffffff"
                fontFamily="$body"
              >
                Reportes completos de {ind.shortName}
              </Text>
              <Text
                fontSize={isDesktop ? 13 : 12}
                color="rgba(255,255,255,0.75)"
                fontFamily="$body"
                marginTop={2}
              >
                Gráficos por día, hora, módulo y comparativas
              </Text>
            </YStack>
            <Text fontSize={20} color="rgba(255,255,255,0.8)">
              ›
            </Text>
          </XStack>
        </LinearGradient>
      </View>
    </View>
  );

  // ── Layout (Identical to app/(tabs)/home/index.tsx) ────────────────

  return (
    <PageContainer>
      <View flex={1} backgroundColor={colors.bg}>
        {/* Fixed Header */}
        <XStack
          paddingTop={insets.top + 8}
          paddingHorizontal={20}
          paddingBottom={12}
          justifyContent="space-between"
          alignItems="center"
          backgroundColor={colors.bg}
        >
          <VigIALogoText height={30} />
          <XStack alignItems="center" gap={12}>
            <TouchableOpacity
              onPress={() => router.push("/menu" as any)}
              style={{
                backgroundColor: "rgba(33, 152, 244, 0.15)",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "rgba(33, 152, 244, 0.3)",
              }}
            >
              <Text fontSize={12} fontWeight="700" color="#38bdf8" fontFamily="$body">
                Sectores
              </Text>
            </TouchableOpacity>
            <View
              pressStyle={{ opacity: 0.7 }}
              onPress={() => router.push(`/${ind.id}/alerts` as any)}
            >
              <View>
                <Bell size={22} color={colors.textTer} />
                {unreviewedCount > 0 && (
                  <View
                    position="absolute"
                    top={-4}
                    right={-4}
                    width={16}
                    height={16}
                    borderRadius={8}
                    backgroundColor="#f87171"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize={9} fontWeight="700" color="#ffffff" fontFamily="$body">
                      {unreviewedCount > 9 ? "9+" : unreviewedCount}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </XStack>
        </XStack>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {isDesktop ? (
            /* ── Desktop: 2-column grid ── */
            <XStack gap={0} alignItems="flex-start" paddingTop={4}>
              {/* Left column — main content */}
              <YStack flex={3} minWidth={0}>
                {greeting}
                {industryBanner}
                {kpiCards}
                {restaurantServiceSection}
                {recentActivity}
                {heatmap}
              </YStack>

              {/* Right column — secondary */}
              <YStack flex={2} minWidth={0} paddingTop={4}>
                {activeModulesSection}
                {weekReport}
                {insights}
                {quickLink}
              </YStack>
            </XStack>
          ) : (
            /* ── Mobile: single column ── */
            <>
              {greeting}
              {industryBanner}
              {kpiCards}
              {restaurantServiceSection}
              {recentActivity}
              {activeModulesSection}
              {weekReport}
              {insights}
              {heatmap}
              {quickLink}
            </>
          )}
        </ScrollView>
      </View>
    </PageContainer>
  );
}
