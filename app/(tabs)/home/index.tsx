import { EventItemCard } from "@/src/components/event-item-card";
import { InsightCard } from "@/src/components/insight-card";
import { KPICard } from "@/src/components/kpi-card";
import { ModuleCard } from "@/src/components/module-card";
import { PageContainer } from "@/src/components/page-container";
import { VigIALogoText } from "@/src/components/vigia-logo-text";

import { useSupabaseAuth } from "@/src/hooks/use-supabase-auth";
import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { useColors } from "@/src/hooks/use-colors";
import { useUser } from "@clerk/expo";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { BarChart2, Bell } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView, Text, View, XStack, YStack } from "tamagui";

const SERVICE_NAMES_ES: Record<string, string> = {
  people_analytics: "Análisis de Personas",
  person_detection: "Detección de Personas",
  vehicle_plates: "Reconocimiento de Placas",
  theft_detection: "Detección de Robos",
  heat_map: "Mapa de Calor",
  intrusion_detection: "Detección de Intrusión",
  fall_detection: "Detección de Caídas",
  tampering_detection: "Detección de Sabotaje",
};

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

function formatDayLabel(iso: string): string {
  const d = new Date(iso);
  return ["D", "L", "M", "X", "J", "V", "S"][d.getDay()];
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { isDesktop } = useBreakpoint();
  const { supabase, ready } = useSupabaseAuth();
  const { user } = useUser();

  const [todayCount, setTodayCount] = useState<number | null>(null);
  const [alertCount, setAlertCount] = useState<number | null>(null);
  const [cameraStats, setCameraStats] = useState<{ online: number; total: number } | null>(null);
  const [avgDwell, setAvgDwell] = useState<number | null>(null);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [activeModules, setActiveModules] = useState<any[]>([]);
  const [dailyPeople7d, setDailyPeople7d] = useState<{ day: string; count: number }[]>([]);
  const [unreviewedCount, setUnreviewedCount] = useState(0);
  const [heatmapUrl, setHeatmapUrl] = useState<string | null>(null);
  const [insightsData, setInsightsData] = useState<any[]>([]);

  useEffect(() => {
    if (!ready) return;

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const from = startOfDay.toISOString();
    const to = now.toISOString();

    // 1. KPI personas hoy
    supabase
      .from("pa_person_counts")
      .select("count_in")
      .eq("interval_type", "hour")
      .gte("interval_start", from)
      .lte("interval_start", to)
      .then(({ data, error }) => {
        if (error) {
          console.error("Error cargando counts:", error.message);
          return;
        }
        const total = (data ?? []).reduce((sum: number, row: any) => sum + (row.count_in || 0), 0);
        setTodayCount(total);
      });

    // 2. Alertas activas (dwell events últimas 24h)
    const since24h = new Date(Date.now() - 24 * 3600_000).toISOString();
    supabase
      .from("pa_dwell_events")
      .select("*", { count: "exact", head: true })
      .gte("created_at", since24h)
      .then(({ count, error }) => {
        if (!error && count != null) setAlertCount(count);
      });

    // 2b. Cámaras activas (online / total)
    supabase
      .from("cameras")
      .select("status")
      .eq("is_active", true)
      .then(({ data, error }) => {
        if (error) return;
        const total = (data ?? []).length;
        const online = (data ?? []).filter((c: any) => c.status !== "offline").length;
        setCameraStats({ online, total });
      });

    // 2c. Permanencia promedio (dwell events últimas 24h)
    supabase
      .from("pa_dwell_events")
      .select("dwell_seconds")
      .gte("created_at", since24h)
      .not("dwell_seconds", "is", null)
      .then(({ data, error }) => {
        if (error || !data?.length) return;
        const values = (data as any[]).map((r) => r.dwell_seconds || 0);
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        setAvgDwell(Math.round(avg / 60)); // en minutos
      });

    // 3. Eventos recientes (pa_dwell_events)
    supabase
      .from("pa_dwell_events")
      .select("*, spaces(name)")
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data, error }) => {
        if (error) {
          console.error("[home] events error:", error.message);
          return;
        }
        const mapped = (data ?? []).map((e: any) => ({
          id: e.id,
          type: "Permanencia prolongada",
          module: "people",
          severity: "MEDIA",
          cameraName: e.spaces?.name ?? "Zona",
          timestamp: e.created_at,
          description: `Visitante permaneció ${Math.round((e.duration_seconds || 0) / 60)} min en ${e.spaces?.name ?? "zona"}`,
          reviewed: false,
        }));
        setRecentEvents(mapped);
      });

    // 3. Módulos activos (service_catalog)
    supabase
      .from("service_catalog")
      .select("*")
      .limit(4)
      .then(({ data, error }) => {
        if (error) {
          console.error("[home] modules error:", error.message);
          return;
        }
        const mapped = (data ?? []).map((s: any) => ({
          id:
            s.key === "people_analytics" || s.key === "person_detection" || s.key === "heat_map"
              ? "people"
              : s.key === "vehicle_plates"
                ? "ocr"
                : s.key === "theft_detection"
                  ? "stolen"
                  : s.key === "intrusion_detection"
                    ? "intrusion"
                    : s.key === "fall_detection"
                      ? "fall"
                      : s.key === "tampering_detection"
                        ? "tampering"
                        : s.key,
          name: SERVICE_NAMES_ES[s.key] ?? s.name,
          description: s.description ?? "",
          icon:
            s.key === "vehicle_plates"
              ? "ScanLine"
              : s.key.includes("people") || s.key === "heat_map"
                ? "Users"
                : "ShieldAlert",
          color:
            s.key === "theft_detection"
              ? "#f87171"
              : s.key === "intrusion_detection"
                ? "#fbbf24"
                : s.key === "fall_detection"
                  ? "#fb923c"
                  : s.key === "tampering_detection"
                    ? "#a78bfa"
                    : "#3b82f6",
          stat: "0",
          statLabel: "Activado",
          whatItDetects: [s.description ?? ""],
          howToUse: "Configurado automáticamente",
          valueGenerated: "",
        }));
        setActiveModules(mapped);
      });

    // 4. Personas últimos 7 días
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    supabase
      .from("pa_person_counts")
      .select("interval_start, count_in")
      .eq("interval_type", "day")
      .gte("interval_start", sevenDaysAgo.toISOString())
      .lte("interval_start", to)
      .order("interval_start", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error("[home] 7d error:", error.message);
          return;
        }
        const mapped = (data ?? []).map((row: any) => ({
          day: formatDayLabel(row.interval_start),
          count: row.count_in || 0,
        }));
        setDailyPeople7d(mapped);
      });

    // 5. Unreviewed count (dwell events últimas 24h)
    // since24h ya declarado arriba
    supabase
      .from("pa_dwell_events")
      .select("*", { count: "exact", head: true })
      .gte("created_at", since24h)
      .then(({ count, error }) => {
        if (!error && count != null) setUnreviewedCount(count);
      });

    // 6. Heatmap snapshot
    supabase
      .from("pa_space_snapshots")
      .select("image_url")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data, error }) => {
        if (!error && data?.[0]?.image_url) setHeatmapUrl(data[0].image_url);
      });

    // 7. Insights heurísticos — generar + leer
    (async () => {
      try {
        await supabase.rpc("generate_insights");
        console.log("[home] generate_insights OK");
      } catch (err: any) {
        console.error("[home] generate_insights error:", err.message ?? err);
      }

      const { data, error } = await supabase
        .from("pa_insights")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("[home] insights read error:", error.message);
        return;
      }
      const mapped = (data ?? []).map((row: any) => ({
        id: row.id,
        type:
          row.severity === "info"
            ? "positive"
            : row.severity === "warning"
              ? "warning"
              : "critical",
        title: row.title,
        description: row.description,
        recommendation: row.recommendation ?? "",
        source: row.category === "dwell" ? "traffic" : row.category,
      }));
      setInsightsData(mapped);
    })();
  }, [supabase, ready]);

  const kpiList = useMemo(() => {
    const list = [
      {
        id: "kpi-traffic",
        label: "Personas hoy",
        value: todayCount != null ? todayCount.toLocaleString("es-BO") : "—",
        change: "hoy",
        changePositive: true,
        accentColor: "#3b82f6",
        icon: "Users",
      },
      {
        id: "kpi-alerts",
        label: "Alertas activas",
        value: alertCount != null ? String(alertCount) : "—",
        change: "24h",
        changePositive: false,
        accentColor: "#f87171",
        icon: "AlertTriangle",
      },
      {
        id: "kpi-dwell",
        label: "Permanencia prom.",
        value: avgDwell != null ? `${avgDwell} min` : "—",
        change: "24h",
        changePositive: true,
        accentColor: "#a78bfa",
        icon: "Timer",
      },
      {
        id: "kpi-uptime",
        label: "Cámaras activas",
        value: cameraStats != null ? `${cameraStats.online}/${cameraStats.total}` : "—",
        change:
          cameraStats && cameraStats.total > 0
            ? `${Math.round((cameraStats.online / cameraStats.total) * 100)}% online`
            : "—",
        changePositive: true,
        accentColor: "#34d399",
        icon: "Cctv",
      },
    ];
    return list;
  }, [todayCount, alertCount, avgDwell, cameraStats]);

  const maxPeople = Math.max(...dailyPeople7d.map((d) => d.count), 1);
  const userFirstName = user?.firstName ?? user?.fullName?.split(" ")[0] ?? "Usuario";
  const today = new Date();

  // ── Shared section components ─────────────────────────────────────

  const greeting = (
    <YStack paddingHorizontal={20} paddingTop={4} marginBottom={24}>
      <Text fontSize={isDesktop ? 32 : 26} fontWeight="700" color={colors.text} fontFamily="$body">
        {getGreeting()},{" "}
        <Text fontSize={isDesktop ? 32 : 26} fontWeight="700" fontFamily="$body" color="#60a5fa">
          {userFirstName}
        </Text>
      </Text>
      <Text
        fontSize={isDesktop ? 16 : 14}
        color={colors.textLabel}
        fontFamily="$body"
        marginTop={4}
      >
        {DAY_NAMES[today.getDay()]}, {today.getDate()} de {MONTH_NAMES[today.getMonth()]}{" "}
        {today.getFullYear()}
      </Text>
    </YStack>
  );

  const kpiCards = (
    <YStack marginBottom={28}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
      >
        {kpiList.map((kpi, i) => (
          <KPICard key={kpi.id} kpi={kpi} index={i} />
        ))}
      </ScrollView>
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
        <View pressStyle={{ opacity: 0.7 }} onPress={() => router.push("/(tabs)/alerts")}>
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
        {recentEvents.length === 0 ? (
          <View padding={24} alignItems="center">
            <Text fontSize={13} color={colors.textLabel} fontFamily="$body">
              Sin actividad reciente
            </Text>
          </View>
        ) : (
          recentEvents.map((event, i) => (
            <View key={event.id}>
              {i > 0 && (
                <View height={1} backgroundColor={colors.borderSoft} marginHorizontal={12} />
              )}
              <EventItemCard
                event={event}
                onPress={() => router.push(`/(tabs)/alerts/${event.id}`)}
              />
            </View>
          ))
        )}
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
        <View pressStyle={{ opacity: 0.7 }} onPress={() => router.push("/(tabs)/home/modules")}>
          <Text fontSize={isDesktop ? 14 : 13} color="#3b82f6" fontFamily="$body" fontWeight="600">
            Ver todos
          </Text>
        </View>
      </XStack>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack gap={12}>
          {activeModules.length === 0 ? (
            <Text fontSize={13} color={colors.textLabel}>
              Cargando módulos…
            </Text>
          ) : (
            activeModules.map((mod: any) => (
              <View key={mod.id + mod.name} width={150} minHeight={185}>
                <ModuleCard module={mod} />
              </View>
            ))
          )}
        </XStack>
      </ScrollView>
    </YStack>
  );

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
        <View pressStyle={{ opacity: 0.7 }} onPress={() => router.push("/(tabs)/reports")}>
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
        <Text
          fontSize={isDesktop ? 14 : 13}
          color={colors.textLabel}
          fontFamily="$body"
          marginBottom={12}
        >
          Personas detectadas — últimos 7 días
        </Text>
        {dailyPeople7d.length === 0 ? (
          <Text fontSize={13} color={colors.textLabel} textAlign="center" marginTop={20}>
            Sin datos aún
          </Text>
        ) : (
          <XStack alignItems="flex-end" gap={6} height={64}>
            {dailyPeople7d.map((point, idx) => {
              const barH = Math.max(4, (point.count / maxPeople) * 64);
              const isToday = idx === dailyPeople7d.length - 1;
              return (
                <YStack key={point.day + idx} flex={1} alignItems="center" gap={4}>
                  <View
                    height={barH}
                    borderRadius={4}
                    width="100%"
                    overflow="hidden"
                    style={{ marginTop: 64 - barH }}
                  >
                    {isToday ? (
                      <LinearGradient
                        colors={["#1e3a8a", "#3b82f6", "#60a5fa"]}
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
        )}
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
        <View pressStyle={{ opacity: 0.7 }} onPress={() => router.push("/(tabs)/alerts")}>
          <Text fontSize={isDesktop ? 14 : 13} color="#3b82f6" fontFamily="$body" fontWeight="600">
            Ver todos
          </Text>
        </View>
      </XStack>
      {insightsData.length === 0 ? (
        <View
          backgroundColor={colors.card}
          borderRadius={14}
          borderWidth={1}
          borderColor={colors.borderSoft}
          padding={16}
          alignItems="center"
        >
          <Text fontSize={13} color={colors.textLabel} fontFamily="$body">
            Aún no hay insights. Aparecerán cuando haya datos suficientes.
          </Text>
        </View>
      ) : (
        insightsData.map((ins: any) => <InsightCard key={ins.id} insight={ins} compact />)
      )}
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
        {heatmapUrl ? (
          <Image source={{ uri: heatmapUrl }} style={{ flex: 1 }} contentFit="cover" />
        ) : (
          <Image source={require("@/assets/heatmap.png")} style={{ flex: 1 }} contentFit="cover" />
        )}
      </View>
    </YStack>
  );

  const quickLink = (
    <View paddingHorizontal={20} marginBottom={28}>
      <View
        borderRadius={14}
        overflow="hidden"
        pressStyle={{ opacity: 0.8 }}
        onPress={() => router.push("/(tabs)/reports")}
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
                Reportes completos
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

  // ── Layout ────────────────────────────────────────────────────────

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
          <View pressStyle={{ opacity: 0.7 }} onPress={() => router.push("/(tabs)/alerts")}>
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

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {isDesktop ? (
            /* ── Desktop: 2-column grid ── */
            <>
              <XStack gap={0} alignItems="flex-start" paddingTop={4}>
                {/* Left column — main content */}
                <YStack flex={3} minWidth={0}>
                  {greeting}
                  {kpiCards}
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
            </>
          ) : (
            /* ── Mobile: single column ── */
            <>
              {greeting}
              {kpiCards}
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
