import BottomSheet, { BottomSheetScrollView } from "@/src/components/bottom-sheet";
import { SvgBarChart } from "@/src/components/charts/svg-bar-chart";
import { SvgLineChart } from "@/src/components/charts/svg-line-chart";
import { SvgMultiLineChart } from "@/src/components/charts/svg-multi-line-chart";
import { HeatmapCanvas, type HeatPoint } from "@/src/components/heatmap-canvas";
import { InsightCard } from "@/src/components/insight-card";
import { PageContainer } from "@/src/components/page-container";
// import { ReportChatSheet } from "@/src/components/report-chat-sheet"; // Deshabilitado hasta tener backend de IA
import {
  filterHourly,
  HOUR_RANGES,
  INSIGHTS,
  type DailyPeoplePoint,
  type HourRange,
} from "@/src/data/mock";
import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { useColors } from "@/src/hooks/use-colors";
import { useSupabaseAuth } from "@/src/hooks/use-supabase-auth";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  BarChart2,
  Bell,
  Filter,
  GitCompareArrows,
  Map,
  MessageCircle,
  ShieldAlert,
  Users,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Platform, ScrollView, Switch } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View, XStack, YStack } from "tamagui";

type ReportTab = "traffic" | "alerts" | "modules" | "heatmaps";
type Period = "today" | "7d" | "30d";

const TABS: { id: ReportTab; label: string; Icon: typeof BarChart2 }[] = [
  { id: "traffic", label: "Tráfico", Icon: Users },
  { id: "alerts", label: "Alertas", Icon: Bell },
  { id: "modules", label: "Módulos", Icon: ShieldAlert },
  { id: "heatmaps", label: "Mapas de Calor", Icon: Map },
];

const PERIODS: { id: Period; label: string }[] = [
  { id: "today", label: "Hoy" },
  { id: "7d", label: "7 días" },
  { id: "30d", label: "30 días" },
];

const HOUR_RANGE_KEYS = Object.keys(HOUR_RANGES) as HourRange[];

function SectionHeader({
  title,
  value,
  valueColor,
}: {
  title: string;
  value?: string;
  valueColor?: string;
}) {
  const colors = useColors();
  return (
    <XStack justifyContent="space-between" alignItems="center" marginBottom={10}>
      <Text
        fontSize={11}
        fontWeight="700"
        color={colors.textLabel}
        fontFamily="$body"
        letterSpacing={1.2}
      >
        {title.toUpperCase()}
      </Text>
      {value && (
        <Text fontSize={12} fontWeight="700" color={valueColor ?? "#3b82f6"} fontFamily="$mono">
          {value}
        </Text>
      )}
    </XStack>
  );
}

function KpiMini({ label, value, color }: { label: string; value: string; color: string }) {
  const colors = useColors();
  return (
    <View
      flex={1}
      backgroundColor={colors.card}
      borderRadius={12}
      borderWidth={1}
      borderColor={colors.borderSoft}
      borderTopWidth={2}
      borderTopColor={color}
      padding={12}
      gap={3}
    >
      <Text fontSize={18} fontWeight="700" color={color} fontFamily="$mono">
        {value}
      </Text>
      <Text fontSize={10} color={colors.textLabel} fontFamily="$body" numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

function ModuleBar({
  label,
  count,
  total,
  color,
  selected,
  onPress,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
  selected: boolean;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <YStack gap={4} pressStyle={{ opacity: 0.8 }} onPress={onPress}>
      <XStack justifyContent="space-between" alignItems="center">
        <Text
          fontSize={12}
          fontFamily="$body"
          color={selected ? colors.text : colors.textSec}
          fontWeight={selected ? "700" : "400"}
        >
          {label}
        </Text>
        <Text fontSize={12} fontWeight="700" color={color} fontFamily="$mono">
          {count}
        </Text>
      </XStack>
      <View height={8} borderRadius={4} backgroundColor={colors.cardAlt} overflow="hidden">
        <View
          height={8}
          borderRadius={4}
          backgroundColor={color}
          width={`${Math.round((count / total) * 100)}%` as `${number}%`}
        />
      </View>
      {selected && (
        <Text fontSize={11} color={colors.textTer} fontFamily="$body">
          {((count / total) * 100).toFixed(1)}% del total de alertas
        </Text>
      )}
    </YStack>
  );
}

export default function ReportsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const filterSheetRef = useRef<BottomSheet>(null);
  const { isDesktop } = useBreakpoint();
  const { supabase, ready } = useSupabaseAuth();

  // ── Live data from Supabase ────────────────────────────────────────────────
  const [CAMERAS, setCameras] = useState<any[]>([]);
  const [DAILY_PEOPLE_7D, setDailyPeople7d] = useState<DailyPeoplePoint[]>([]);
  const [DAILY_PEOPLE_30D, setDailyPeople30d] = useState<DailyPeoplePoint[]>([]);
  const [DAILY_PEOPLE_7D_PREV, setDailyPeople7dPrev] = useState<DailyPeoplePoint[]>([]);
  const [HOURLY_ACTIVITY_TODAY, setHourlyActivityToday] = useState<
    { hour: string; count: number }[]
  >([]);
  const [ALERTS_BY_MODULE, setAlertsByModule] = useState<
    { moduleId: string; label: string; count: number; color: string }[]
  >([]);
  const [DAILY_ALERTS_7D, setDailyAlerts7d] = useState<any[]>([]);
  const [CAMERA_HOURLY, setCameraHourly] = useState<
    Record<string, { hour: string; count: number }[]>
  >({});

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;

    async function load() {
      try {
        // Cameras
        const { data: cams } = await supabase
          .from("cameras")
          .select("*, camera_services(is_enabled, service_catalog(key))")
          .eq("is_active", true);
        if (!cancelled) {
          const mapped = (cams ?? []).map((cam: any) => {
            const services = (cam.camera_services ?? [])
              .filter((cs: any) => cs.is_enabled)
              .map((cs: any) => cs.service_catalog?.key)
              .filter(Boolean);
            return { ...cam, services };
          });
          setCameras(mapped);
        }

        // Daily people 7d
        const now = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const { data: dp7 } = await supabase
          .from("pa_person_counts")
          .select("interval_start, count_in")
          .eq("interval_type", "day")
          .gte("interval_start", sevenDaysAgo.toISOString())
          .lte("interval_start", now.toISOString())
          .order("interval_start", { ascending: true });
        if (!cancelled) {
          const mapped = (dp7 ?? []).map((row: any) => ({
            day: new Date(row.interval_start)
              .toLocaleDateString("es-BO", { weekday: "short" })
              .slice(0, 3),
            date: row.interval_start.split("T")[0],
            count: row.count_in || 0,
          }));
          setDailyPeople7d(mapped);
        }

        // Daily people 30d
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const { data: dp30 } = await supabase
          .from("pa_person_counts")
          .select("interval_start, count_in")
          .eq("interval_type", "day")
          .gte("interval_start", thirtyDaysAgo.toISOString())
          .lte("interval_start", now.toISOString())
          .order("interval_start", { ascending: true });
        if (!cancelled) {
          const mapped = (dp30 ?? []).map((row: any) => ({
            day: new Date(row.interval_start)
              .toLocaleDateString("es-BO", { weekday: "short" })
              .slice(0, 3),
            date: row.interval_start.split("T")[0],
            count: row.count_in || 0,
          }));
          setDailyPeople30d(mapped);
        }

        // Prev 7d (comparative)
        const prev7Start = new Date();
        prev7Start.setDate(prev7Start.getDate() - 14);
        const prev7End = new Date();
        prev7End.setDate(prev7End.getDate() - 7);
        const { data: dpPrev } = await supabase
          .from("pa_person_counts")
          .select("interval_start, count_in")
          .eq("interval_type", "day")
          .gte("interval_start", prev7Start.toISOString())
          .lte("interval_start", prev7End.toISOString())
          .order("interval_start", { ascending: true });
        if (!cancelled) {
          const mapped = (dpPrev ?? []).map((row: any) => ({
            day: new Date(row.interval_start)
              .toLocaleDateString("es-BO", { weekday: "short" })
              .slice(0, 3),
            date: row.interval_start.split("T")[0],
            count: row.count_in || 0,
          }));
          setDailyPeople7dPrev(mapped);
        }

        // Hourly today
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const { data: hourly } = await supabase
          .from("pa_person_counts")
          .select("interval_start, count_in")
          .eq("interval_type", "hour")
          .gte("interval_start", startOfDay.toISOString())
          .lte("interval_start", now.toISOString())
          .order("interval_start", { ascending: true });
        if (!cancelled) {
          const mapped = (hourly ?? []).map((row: any) => ({
            hour: new Date(row.interval_start).getHours().toString().padStart(2, "0") + ":00",
            count: row.count_in || 0,
          }));
          setHourlyActivityToday(mapped);
        }

        // Alerts proxy from dwell events
        const { data: dwells } = await supabase
          .from("pa_dwell_events")
          .select("created_at")
          .gte("created_at", sevenDaysAgo.toISOString());
        if (!cancelled) {
          const byDay: Record<string, any> = {};
          const days = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];
          days.forEach((d) => {
            byDay[d] = {
              day: d,
              intrusion: 0,
              stolen: 0,
              fall: 0,
              ocr: 0,
              people: 0,
              tampering: 0,
            };
          });
          (dwells ?? []).forEach((e: any) => {
            const d = new Date(e.created_at)
              .toLocaleDateString("es-BO", { weekday: "short" })
              .slice(0, 3);
            const key = d.charAt(0).toUpperCase() + d.slice(1);
            if (byDay[key]) byDay[key].people++;
          });
          setDailyAlerts7d(Object.values(byDay));
          setAlertsByModule([
            {
              moduleId: "people",
              label: "Análisis de Personas",
              count: (dwells ?? []).length,
              color: "#3b82f6",
            },
          ]);
        }

        // Camera hourly (empty for now — needs per-camera hourly aggregation)
        setCameraHourly({});
      } catch (err: any) {
        console.error("[reports] load error:", err.message);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [supabase, ready]);

  const [activeTab, setActiveTab] = useState<ReportTab>("traffic");
  const [period, setPeriod] = useState<Period>("7d");
  const [hourRange, setHourRange] = useState<HourRange>("all");
  // ── Heatmap state ──────────────────────────────────────────────────────────
  const [heatmapPoints, setHeatmapPoints] = useState<Record<string, HeatPoint[]>>({});
  const [heatmapSnapshots, setHeatmapSnapshots] = useState<Record<string, string | null>>({});
  const [selectedHourFrom, setSelectedHourFrom] = useState<number | null>(null);
  const [selectedHourTo, setSelectedHourTo] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [compareRange, setCompareRange] = useState(false);
  const [compareStart, setCompareStart] = useState<Date | null>(null);
  const [compareEnd, setCompareEnd] = useState<Date | null>(null);
  const [, setShowFilters] = useState(false);
  const [showDatePickerFor, setShowDatePickerFor] = useState<
    "single" | "start" | "end" | "compareStart" | "compareEnd" | "startTime" | "endTime" | null
  >(null);
  const [, setDatePickerMode] = useState<"date" | "time">("date");
  const [comparePeriod, setComparePeriod] = useState(false);
  const [selectedBar, setSelectedBar] = useState<{ label: string; value: number } | null>(null);
  const [selectedModuleBar, setSelectedModuleBar] = useState<string | null>(null);

  const onBarPress = (label: string, value: number) => setSelectedBar({ label, value });

  const heatmapCameras = CAMERAS.filter((c) => c.status !== "offline");

  // Load live heatmap data from Supabase
  useEffect(() => {
    if (!ready || activeTab !== "heatmaps") return;
    heatmapCameras.forEach(async (cam) => {
      try {
        const spaceId = (cam as any).space_id ?? cam.id;
        const intervalType = period === "today" ? "hour" : period === "7d" ? "day" : "week";
        const intervalStart = new Date();
        intervalStart.setHours(0, 0, 0, 0);

        const { data } = await supabase
          .from("pa_heatmap_data")
          .select("points")
          .eq("space_id", spaceId)
          .eq("interval_type", intervalType)
          .eq("interval_start", intervalStart.toISOString())
          .single();
        if (data?.points?.length) {
          setHeatmapPoints((prev) => ({ ...prev, [cam.id]: data.points }));
        }

        const { data: snapshots } = await supabase
          .from("pa_space_snapshots")
          .select("image_url")
          .eq("space_id", spaceId)
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(1);
        if (snapshots?.[0]?.image_url) {
          setHeatmapSnapshots((prev) => ({ ...prev, [cam.id]: snapshots[0].image_url }));
        }
      } catch {
        // silently fall back to placeholder
      }
    });
  }, [supabase, ready, activeTab, period, heatmapCameras]);

  const totalAlerts7d = DAILY_ALERTS_7D.reduce(
    (s, d) => s + d.intrusion + d.stolen + d.fall + d.ocr + d.people + d.tampering,
    0
  );
  const maxAlerts = Math.max(...ALERTS_BY_MODULE.map((a) => a.count), 1);
  const topModule =
    ALERTS_BY_MODULE.length > 0
      ? ALERTS_BY_MODULE.reduce((b, a) => (a.count > b.count ? a : b))
      : { moduleId: "people", label: "Análisis de Personas", count: 0, color: "#3b82f6" };

  const formatDay = (date: Date | null) =>
    date
      ? date.toLocaleDateString("es-BO", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "N/D";

  const withinDateRange = (value: string, start: Date | null, end: Date | null) => {
    if (!start || !end) return true;
    const t = new Date(value).getTime();
    const startDay = new Date(start);
    const endDay = new Date(end);
    startDay.setHours(0, 0, 0, 0);
    endDay.setHours(23, 59, 59, 999);
    return t >= startDay.getTime() && t <= endDay.getTime();
  };

  const isHourlySeries = (data: unknown[]): data is { hour: string; count: number }[] =>
    data.length > 0 && typeof (data[0] as any).hour === "string";

  const baseTrafficData =
    selectedDay && !rangeStart && !rangeEnd
      ? HOURLY_ACTIVITY_TODAY
      : rangeStart && rangeEnd
        ? DAILY_PEOPLE_30D.filter((d) => withinDateRange(d.date, rangeStart, rangeEnd))
        : period === "today"
          ? HOURLY_ACTIVITY_TODAY
          : period === "7d"
            ? DAILY_PEOPLE_7D
            : DAILY_PEOPLE_30D;

  const trafficDataPreFilter = baseTrafficData.map((item) => {
    if ("hour" in item) {
      return item;
    }
    return item as DailyPeoplePoint;
  });

  const trafficData = isHourlySeries(trafficDataPreFilter)
    ? trafficDataPreFilter.filter((row) => {
        if (selectedHourFrom !== null) {
          if (Number(row.hour.replace("h", "")) < selectedHourFrom) return false;
        }
        if (selectedHourTo !== null) {
          if (Number(row.hour.replace("h", "")) > selectedHourTo) return false;
        }
        return true;
      })
    : (trafficDataPreFilter as DailyPeoplePoint[]);

  const compareRangeData =
    compareRange && compareStart && compareEnd
      ? DAILY_PEOPLE_30D.filter((d) => withinDateRange(d.date, compareStart, compareEnd))
      : undefined;

  const applicableCompareTraffic =
    comparePeriod && period === "7d" ? DAILY_PEOPLE_7D_PREV : compareRangeData;

  const totalTraffic = trafficData.reduce((s, d) => s + ("count" in d ? d.count : 0), 0);
  const avgTraffic = Math.round(totalTraffic / (trafficData.length || 1));
  const maxDay = trafficData.reduce(
    (b, d) => ("count" in d && d.count > (b as any).count ? d : b),
    trafficData[0] ?? ({ day: "-", date: "-", count: 0 } as DailyPeoplePoint)
  ) as DailyPeoplePoint;

  const hourTotal = isHourlySeries(trafficData) ? trafficData.reduce((s, d) => s + d.count, 0) : 0;

  return (
    <PageContainer>
      <View flex={1} backgroundColor={colors.bg}>
        {/* Header */}
        <YStack
          paddingTop={insets.top + 10}
          paddingHorizontal={20}
          paddingBottom={14}
          backgroundColor={colors.card}
          borderBottomWidth={1}
          borderBottomColor={colors.borderSoft}
          gap={12}
        >
          <XStack justifyContent="space-between" alignItems="center">
            <YStack>
              <Text fontSize={22} fontWeight="700" color={colors.text} fontFamily="$body">
                Reportes
              </Text>
              <Text fontSize={12} color={colors.textTer} fontFamily="$body">
                SuperFamilia Mercados — Cochabamba
              </Text>
            </YStack>
            <XStack gap={8}>
              <View
                width={38}
                height={38}
                borderRadius={10}
                backgroundColor={colors.card}
                borderWidth={1}
                borderColor={colors.borderSoft}
                alignItems="center"
                justifyContent="center"
                pressStyle={{ opacity: 0.7 }}
                onPress={() => filterSheetRef.current?.expand()}
              >
                <Filter size={18} color={colors.textSec} />
              </View>
              <View
                width={38}
                height={38}
                borderRadius={10}
                backgroundColor="rgba(59,130,246,0.12)"
                alignItems="center"
                justifyContent="center"
                pressStyle={{ opacity: 0.7 }}
                // onPress={() => chatSheetRef.current?.expand()}
              >
                <MessageCircle size={18} color="#3b82f6" opacity={0.4} />
              </View>
            </XStack>
          </XStack>

          {/* Period */}
          <XStack gap={6}>
            {PERIODS.map((p) => {
              const active = period === p.id;
              return (
                <View
                  key={p.id}
                  paddingHorizontal={14}
                  paddingVertical={7}
                  borderRadius={20}
                  backgroundColor={active ? "#3b82f6" : colors.card}
                  borderWidth={1}
                  borderColor={active ? "#3b82f6" : colors.border}
                  pressStyle={{ opacity: 0.7 }}
                  onPress={() => {
                    setPeriod(p.id);
                    setSelectedBar(null);
                  }}
                >
                  <Text
                    fontSize={12}
                    fontWeight={active ? "700" : "500"}
                    color={active ? "#ffffff" : colors.textSec}
                    fontFamily="$body"
                  >
                    {p.label}
                  </Text>
                </View>
              );
            })}
          </XStack>

          {/* Date filters */}
          {/* <YStack gap={10}>
            <SectionHeader
              title="Filtro de rango"
              value={
                compareRange
                  ? `Base: ${selectedRangeLabel ?? "-"} + Comparación: ${compareRangeLabel ?? "-"}`
                  : selectedRangeLabel
                    ? selectedRangeLabel
                    : selectedDay
                      ? `Día: ${formatDay(selectedDay)}`
                      : "Sin rango"
              }
            />
            <XStack gap={8} flexWrap="wrap">
              <View
                paddingHorizontal={12}
                paddingVertical={8}
                borderRadius={16}
                borderWidth={1}
                borderColor={colors.borderSoft}
                backgroundColor={colors.cardAlt}
                pressStyle={{ opacity: 0.7 }}
                onPress={() => {
                  setShowDatePickerFor("single");
                  setDatePickerMode("date");
                }}
              >
                <Text fontSize={11} color={colors.text} fontFamily="$body">
                  Día específico
                </Text>
                <Text fontSize={12} fontWeight="700" color="#3b82f6" fontFamily="$mono">
                  {selectedDay ? formatDay(selectedDay) : "Seleccionar"}
                </Text>
              </View>

              <View
                paddingHorizontal={12}
                paddingVertical={8}
                borderRadius={16}
                borderWidth={1}
                borderColor={colors.borderSoft}
                backgroundColor={colors.cardAlt}
                pressStyle={{ opacity: 0.7 }}
                onPress={() => {
                  setShowDatePickerFor("start");
                  setDatePickerMode("date");
                }}
              >
                <Text fontSize={11} color={colors.text} fontFamily="$body">
                  Inicio rango
                </Text>
                <Text fontSize={12} fontWeight="700" color="#3b82f6" fontFamily="$mono">
                  {rangeStart ? formatDay(rangeStart) : "Seleccionar"}
                </Text>
              </View>

              <View
                paddingHorizontal={12}
                paddingVertical={8}
                borderRadius={16}
                borderWidth={1}
                borderColor={colors.borderSoft}
                backgroundColor={colors.cardAlt}
                pressStyle={{ opacity: 0.7 }}
                onPress={() => {
                  setShowDatePickerFor("end");
                  setDatePickerMode("date");
                }}
              >
                <Text fontSize={11} color={colors.text} fontFamily="$body">
                  Fin rango
                </Text>
                <Text fontSize={12} fontWeight="700" color="#3b82f6" fontFamily="$mono">
                  {rangeEnd ? formatDay(rangeEnd) : "Seleccionar"}
                </Text>
              </View>
            </XStack>

            <XStack alignItems="center" gap={8}>
              <Text fontSize={12} color={colors.textLabel} fontFamily="$body">
                Comparar con otro rango
              </Text>
              <Switch
                value={compareRange}
                onValueChange={setCompareRange}
                trackColor={{ false: colors.cardAlt, true: "#3b82f6" }}
                thumbColor="#ffffff"
                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
              />
            </XStack>

            {compareRange && (
              <XStack gap={8} flexWrap="wrap">
                <View
                  paddingHorizontal={12}
                  paddingVertical={8}
                  borderRadius={16}
                  borderWidth={1}
                  borderColor={colors.borderSoft}
                  backgroundColor={colors.cardAlt}
                  pressStyle={{ opacity: 0.7 }}
                  onPress={() => {
                    setShowDatePickerFor("compareStart");
                    setDatePickerMode("date");
                  }}
                >
                  <Text fontSize={11} color={colors.text} fontFamily="$body">
                    Inicio comparación
                  </Text>
                  <Text fontSize={12} fontWeight="700" color="#3b82f6" fontFamily="$mono">
                    {compareStart ? formatDay(compareStart) : "Seleccionar"}
                  </Text>
                </View>
                <View
                  paddingHorizontal={12}
                  paddingVertical={8}
                  borderRadius={16}
                  borderWidth={1}
                  borderColor={colors.borderSoft}
                  backgroundColor={colors.cardAlt}
                  pressStyle={{ opacity: 0.7 }}
                  onPress={() => {
                    setShowDatePickerFor("compareEnd");
                    setDatePickerMode("date");
                  }}
                >
                  <Text fontSize={11} color={colors.text} fontFamily="$body">
                    Fin comparación
                  </Text>
                  <Text fontSize={12} fontWeight="700" color="#3b82f6" fontFamily="$mono">
                    {compareEnd ? formatDay(compareEnd) : "Seleccionar"}
                  </Text>
                </View>
              </XStack>
            )}

            <XStack gap={6}>
              {[0, 6, 12, 18, 23].map((h) => (
                <View
                  key={h}
                  paddingHorizontal={10}
                  paddingVertical={7}
                  borderRadius={20}
                  borderWidth={1}
                  borderColor={colors.borderSoft}
                  backgroundColor={
                    selectedHourFrom === h || selectedHourTo === h
                      ? "rgba(59,130,246,0.15)"
                      : colors.cardAlt
                  }
                  pressStyle={{ opacity: 0.7 }}
                  onPress={() => {
                    if (selectedHourFrom === null || selectedHourFrom !== h) {
                      setSelectedHourFrom(h);
                      if (selectedHourTo !== null && selectedHourTo < h) setSelectedHourTo(23);
                    }
                    if (selectedHourFrom === h) {
                      setSelectedHourFrom(null);
                    }
                  }}
                >
                  <Text
                    fontSize={11}
                    fontFamily="$body"
                    color={
                      selectedHourFrom === h || selectedHourTo === h ? "#3b82f6" : colors.textTer
                    }
                  >
                    {h}:00
                  </Text>
                </View>
              ))}
              <View
                paddingHorizontal={12}
                paddingVertical={7}
                borderRadius={20}
                borderWidth={1}
                borderColor={colors.borderSoft}
                backgroundColor={colors.cardAlt}
                pressStyle={{ opacity: 0.7 }}
                onPress={() => {
                  setSelectedHourFrom(null);
                  setSelectedHourTo(null);
                }}
              >
                <Text fontSize={11} color={colors.textTer} fontFamily="$body">
                  Limpiar horas
                </Text>
              </View>
            </XStack>
          </YStack> */}

          {showDatePickerFor &&
            (Platform.OS === "web" ? (
              <View marginTop={10}>
                <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
                  Selecciona fecha (web)
                </Text>
                <input
                  type="date"
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid #ccc",
                    background: colors.card,
                    color: colors.text,
                  }}
                  onChange={(e) => {
                    const selected = new Date(e.target.value);
                    if (showDatePickerFor === "single") setSelectedDay(selected);
                    if (showDatePickerFor === "start") setRangeStart(selected);
                    if (showDatePickerFor === "end") setRangeEnd(selected);
                    if (showDatePickerFor === "compareStart") setCompareStart(selected);
                    if (showDatePickerFor === "compareEnd") setCompareEnd(selected);
                    setShowDatePickerFor(null);
                  }}
                />
              </View>
            ) : (
              <DateTimePicker
                value={
                  showDatePickerFor === "single"
                    ? (selectedDay ?? new Date())
                    : showDatePickerFor === "start"
                      ? (rangeStart ?? new Date())
                      : showDatePickerFor === "end"
                        ? (rangeEnd ?? new Date())
                        : showDatePickerFor === "compareStart"
                          ? (compareStart ?? new Date())
                          : showDatePickerFor === "compareEnd"
                            ? (compareEnd ?? new Date())
                            : new Date()
                }
                mode="date"
                display="default"
                onChange={(event, value) => {
                  if (!value) {
                    setShowDatePickerFor(null);
                    return;
                  }
                  if (showDatePickerFor === "single") setSelectedDay(value);
                  if (showDatePickerFor === "start") setRangeStart(value);
                  if (showDatePickerFor === "end") setRangeEnd(value);
                  if (showDatePickerFor === "compareStart") setCompareStart(value);
                  if (showDatePickerFor === "compareEnd") setCompareEnd(value);
                  setShowDatePickerFor(null);
                }}
              />
            ))}

          {/* Time picker (native) for hour range */}
          {showDatePickerFor &&
            (showDatePickerFor === "startTime" || showDatePickerFor === "endTime") &&
            Platform.OS !== "web" && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                display="default"
                onChange={(event, value) => {
                  if (value) {
                    const h = value.getHours();
                    if (showDatePickerFor === "startTime") setSelectedHourFrom(h);
                    if (showDatePickerFor === "endTime") setSelectedHourTo(h);
                  }
                  setShowDatePickerFor(null);
                }}
              />
            )}

          {/* Hour range — today only */}
          {period === "today" && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <XStack gap={6}>
                {HOUR_RANGE_KEYS.map((key) => {
                  const active = hourRange === key;
                  return (
                    <View
                      key={key}
                      paddingHorizontal={12}
                      paddingVertical={5}
                      borderRadius={20}
                      backgroundColor={active ? "rgba(59,130,246,0.15)" : colors.cardAlt}
                      borderWidth={1}
                      borderColor={active ? "#3b82f6" : colors.borderSoft}
                      pressStyle={{ opacity: 0.7 }}
                      onPress={() => {
                        setHourRange(key);
                        setSelectedBar(null);
                      }}
                    >
                      <Text
                        fontSize={11}
                        fontWeight={active ? "700" : "400"}
                        color={active ? "#3b82f6" : colors.textTer}
                        fontFamily="$body"
                      >
                        {HOUR_RANGES[key].label}
                      </Text>
                    </View>
                  );
                })}
              </XStack>
            </ScrollView>
          )}

          {/* Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -20 }}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 4, flexDirection: "row" }}
          >
            {TABS.map(({ id, label, Icon }) => {
              const active = activeTab === id;
              return (
                <View
                  key={id}
                  flexDirection="row"
                  alignItems="center"
                  gap={5}
                  paddingHorizontal={13}
                  paddingVertical={8}
                  borderRadius={10}
                  overflow="hidden"
                  borderWidth={1}
                  borderColor={active ? "#3b82f6" : "transparent"}
                  backgroundColor="transparent"
                  pressStyle={{ opacity: 0.7 }}
                  onPress={() => {
                    setActiveTab(id);
                    setSelectedBar(null);
                  }}
                >
                  <Icon size={14} color={active ? "#3b82f6" : colors.textLabel} />
                  <Text
                    fontSize={12}
                    fontWeight={active ? "700" : "500"}
                    color={active ? "#3b82f6" : colors.textLabel}
                    fontFamily="$body"
                  >
                    {label}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </YStack>

        {/* Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        >
          {/* ══ TRÁFICO ══ */}
          {activeTab === "traffic" && (
            <YStack gap={14}>
              <XStack gap={8}>
                <KpiMini
                  label={
                    period === "today"
                      ? "Personas hoy"
                      : period === "7d"
                        ? "Esta semana"
                        : "Este mes"
                  }
                  value={totalTraffic.toLocaleString("es-BO")}
                  color="#3b82f6"
                />
                <KpiMini
                  label="Promedio / día"
                  value={avgTraffic.toLocaleString("es-BO")}
                  color="#3b82f6"
                />
                <KpiMini
                  label={`Pico`}
                  value={maxDay.count.toLocaleString("es-BO")}
                  color="#a78bfa"
                />
              </XStack>

              {selectedBar && (
                <XStack
                  backgroundColor="rgba(59,130,246,0.10)"
                  borderRadius={10}
                  borderWidth={1}
                  borderColor="rgba(59,130,246,0.3)"
                  paddingHorizontal={14}
                  paddingVertical={10}
                  alignItems="center"
                  gap={8}
                >
                  <View width={8} height={8} borderRadius={4} backgroundColor="#3b82f6" />
                  <Text fontSize={13} color={colors.text} fontFamily="$body">
                    <Text fontWeight="700" color="#3b82f6" fontFamily="$mono">
                      {selectedBar.label}
                    </Text>
                    {"  "}
                    <Text fontFamily="$mono" color={colors.text}>
                      {selectedBar.value.toLocaleString("es-BO")}
                    </Text>{" "}
                    personas detectadas
                  </Text>
                </XStack>
              )}

              {/* Desktop: chart left, side panel right */}
              <XStack gap={14} alignItems="flex-start" flexDirection={isDesktop ? "row" : "column"}>
                <View
                  flex={isDesktop ? 3 : undefined}
                  backgroundColor={colors.card}
                  borderRadius={14}
                  borderWidth={1}
                  borderColor={colors.borderSoft}
                  padding={16}
                  width={isDesktop ? undefined : "100%"}
                >
                  <XStack justifyContent="space-between" alignItems="center" marginBottom={4}>
                    <SectionHeader
                      title={
                        period === "today"
                          ? `Afluencia por hora — ${HOUR_RANGES[hourRange].label}`
                          : period === "7d"
                            ? "Personas por día — 7 días"
                            : "Personas por día — 30 días"
                      }
                    />
                    {period === "7d" && (
                      <XStack gap={6} alignItems="center">
                        <GitCompareArrows size={13} color={colors.textLabel} />
                        <Text fontSize={11} color={colors.textTer} fontFamily="$body">
                          Comparar
                        </Text>
                        <Switch
                          value={comparePeriod}
                          onValueChange={setComparePeriod}
                          trackColor={{ false: colors.cardAlt, true: "#3b82f6" }}
                          thumbColor="#ffffff"
                          style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                        />
                      </XStack>
                    )}
                  </XStack>

                  {isHourlySeries(trafficData) ? (
                    <SvgLineChart
                      data={trafficData}
                      xKey="hour"
                      yKey="count"
                      color="#3b82f6"
                      height={190}
                      labelColor={colors.textLabel}
                      gridColor={colors.borderSoft}
                      xLabelStep={2}
                      xLabelSuffix="h"
                      onPointPress={onBarPress}
                    />
                  ) : (
                    <SvgBarChart
                      data={trafficData as DailyPeoplePoint[]}
                      xKey={rangeStart && rangeEnd ? "date" : period === "30d" ? "date" : "day"}
                      yKey="count"
                      color="#3b82f6"
                      compareData={applicableCompareTraffic as DailyPeoplePoint[] | undefined}
                      compareColor="#475569"
                      height={period === "30d" || (rangeStart && rangeEnd) ? 200 : 190}
                      labelColor={colors.textLabel}
                      gridColor={colors.borderSoft}
                      onBarPress={onBarPress}
                    />
                  )}

                  {comparePeriod && period === "7d" && (
                    <XStack gap={16} marginTop={10}>
                      <XStack gap={5} alignItems="center">
                        <View width={12} height={3} borderRadius={2} backgroundColor="#3b82f6" />
                        <Text fontSize={11} color={colors.textTer} fontFamily="$body">
                          Actual
                        </Text>
                      </XStack>
                      <XStack gap={5} alignItems="center">
                        <View width={12} height={3} borderRadius={2} backgroundColor="#475569" />
                        <Text fontSize={11} color={colors.textTer} fontFamily="$body">
                          Período anterior
                        </Text>
                      </XStack>
                    </XStack>
                  )}
                </View>

                {/* Right column (desktop) or below (mobile) */}
                <YStack
                  flex={isDesktop ? 2 : undefined}
                  gap={14}
                  width={isDesktop ? undefined : "100%"}
                >
                  {/* By-camera for today */}
                  {period === "today" && (
                    <View
                      backgroundColor={colors.card}
                      borderRadius={14}
                      borderWidth={1}
                      borderColor={colors.borderSoft}
                      padding={16}
                    >
                      <SectionHeader
                        title={`Por cámara — ${HOUR_RANGES[hourRange].label}`}
                        value={`Total: ${hourTotal.toLocaleString("es-BO")}`}
                      />
                      <YStack gap={10}>
                        {CAMERAS.filter((c) => c.status !== "offline").map((cam) => {
                          const camTotal = filterHourly(
                            CAMERA_HOURLY[cam.id] ?? [],
                            hourRange
                          ).reduce((s, d) => s + d.count, 0);
                          if (camTotal === 0) return null;
                          return (
                            <YStack key={cam.id} gap={4}>
                              <XStack justifyContent="space-between" alignItems="center">
                                <YStack>
                                  <Text
                                    fontSize={12}
                                    fontWeight="600"
                                    color={colors.textSec}
                                    fontFamily="$body"
                                  >
                                    {cam.name}
                                  </Text>
                                  <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
                                    {cam.room}
                                  </Text>
                                </YStack>
                                <Text
                                  fontSize={12}
                                  fontWeight="700"
                                  color="#3b82f6"
                                  fontFamily="$mono"
                                >
                                  {camTotal.toLocaleString("es-BO")}
                                </Text>
                              </XStack>
                              <View
                                height={6}
                                borderRadius={3}
                                backgroundColor={colors.cardAlt}
                                overflow="hidden"
                              >
                                <View
                                  height={6}
                                  borderRadius={3}
                                  backgroundColor="#3b82f6"
                                  width={
                                    `${Math.round((camTotal / (hourTotal || 1)) * 100)}%` as `${number}%`
                                  }
                                />
                              </View>
                            </YStack>
                          );
                        })}
                      </YStack>
                    </View>
                  )}

                  <YStack gap={8}>
                    <SectionHeader title="Insights — Tráfico" />
                    {INSIGHTS.filter((i) => i.source === "traffic").map((ins) => (
                      <InsightCard key={ins.id} insight={ins} />
                    ))}
                  </YStack>
                </YStack>
              </XStack>
            </YStack>
          )}

          {/* ══ ALERTAS ══ */}
          {activeTab === "alerts" && (
            <YStack gap={14}>
              <XStack gap={8}>
                <KpiMini label="Alertas 7 días" value={String(totalAlerts7d)} color="#f87171" />
                <KpiMini
                  label="Módulo líder"
                  value={topModule.label.split(" ")[0]}
                  color={topModule.color}
                />
                <KpiMini
                  label="Promedio / día"
                  value={(totalAlerts7d / 7).toFixed(1)}
                  color="#fbbf24"
                />
              </XStack>

              {selectedBar && (
                <XStack
                  backgroundColor="rgba(248,113,113,0.08)"
                  borderRadius={10}
                  borderWidth={1}
                  borderColor="rgba(248,113,113,0.25)"
                  paddingHorizontal={14}
                  paddingVertical={10}
                  alignItems="center"
                  gap={8}
                >
                  <View width={8} height={8} borderRadius={4} backgroundColor="#f87171" />
                  <Text fontSize={13} color={colors.text} fontFamily="$body">
                    <Text fontWeight="700" color="#f87171" fontFamily="$mono">
                      {selectedBar.label}
                    </Text>
                    {"  "}
                    <Text fontFamily="$mono">{selectedBar.value}</Text> alertas
                  </Text>
                </XStack>
              )}

              {/* Desktop: daily chart left, by-module right */}
              <XStack gap={14} alignItems="flex-start" flexDirection={isDesktop ? "row" : "column"}>
                <View
                  flex={1}
                  backgroundColor={colors.card}
                  borderRadius={14}
                  borderWidth={1}
                  borderColor={colors.borderSoft}
                  padding={16}
                  width={isDesktop ? undefined : "100%"}
                >
                  <SectionHeader title="Alertas diarias — 7 días" />
                  <SvgBarChart
                    data={DAILY_ALERTS_7D.map((d) => ({
                      ...d,
                      total: d.intrusion + d.stolen + d.fall + d.ocr + d.people + d.tampering,
                    }))}
                    xKey="day"
                    yKey="total"
                    color="#f87171"
                    height={180}
                    labelColor={colors.textLabel}
                    gridColor={colors.borderSoft}
                    onBarPress={onBarPress}
                  />
                </View>

                <View
                  flex={1}
                  backgroundColor={colors.card}
                  borderRadius={14}
                  borderWidth={1}
                  borderColor={colors.borderSoft}
                  padding={16}
                  width={isDesktop ? undefined : "100%"}
                >
                  <SectionHeader
                    title="Alertas por módulo — 7 días"
                    value={`Total: ${totalAlerts7d}`}
                  />
                  <YStack gap={10}>
                    {ALERTS_BY_MODULE.map((item) => (
                      <ModuleBar
                        key={item.moduleId}
                        label={item.label}
                        count={item.count}
                        total={maxAlerts}
                        color={item.color}
                        selected={selectedModuleBar === item.moduleId}
                        onPress={() =>
                          setSelectedModuleBar(
                            selectedModuleBar === item.moduleId ? null : item.moduleId
                          )
                        }
                      />
                    ))}
                  </YStack>
                </View>
              </XStack>

              <View
                backgroundColor={colors.card}
                borderRadius={14}
                borderWidth={1}
                borderColor={colors.borderSoft}
                padding={16}
              >
                <SectionHeader title="Alertas por módulo por día" />
                <SvgMultiLineChart
                  data={DAILY_ALERTS_7D}
                  xKey="day"
                  lines={[
                    { yKey: "intrusion", color: "#fbbf24", label: "Intrusión" },
                    { yKey: "people", color: "#3b82f6", label: "Personas" },
                    { yKey: "ocr", color: "#3b82f6", label: "OCR/Placas" },
                    { yKey: "stolen", color: "#f87171", label: "Robados" },
                    { yKey: "fall", color: "#fb923c", label: "Caídas" },
                    { yKey: "tampering", color: "#a78bfa", label: "Tampering" },
                  ]}
                  height={190}
                  labelColor={colors.textLabel}
                  gridColor={colors.borderSoft}
                />
                <XStack gap={10} marginTop={10} flexWrap="wrap">
                  {[
                    { color: "#fbbf24", label: "Intrusión" },
                    { color: "#3b82f6", label: "Personas" },
                    { color: "#3b82f6", label: "OCR" },
                    { color: "#f87171", label: "Robados" },
                    { color: "#fb923c", label: "Caídas" },
                    { color: "#a78bfa", label: "Tampering" },
                  ].map((item) => (
                    <XStack key={item.label} gap={5} alignItems="center">
                      <View width={10} height={3} borderRadius={2} backgroundColor={item.color} />
                      <Text fontSize={10} color={colors.textTer} fontFamily="$body">
                        {item.label}
                      </Text>
                    </XStack>
                  ))}
                </XStack>
              </View>

              <YStack gap={8}>
                <SectionHeader title="Insights — Alertas" />
                {INSIGHTS.filter((i) => i.source === "alerts").map((ins) => (
                  <InsightCard key={ins.id} insight={ins} />
                ))}
              </YStack>
            </YStack>
          )}

          {/* ══ MÓDULOS ══ */}
          {activeTab === "modules" && (
            <YStack gap={14}>
              <View
                backgroundColor={colors.card}
                borderRadius={14}
                borderWidth={1}
                borderColor={colors.borderSoft}
                padding={16}
              >
                <SectionHeader title="Actividad por módulo — 7 días" />
                <YStack gap={10}>
                  {ALERTS_BY_MODULE.map((item) => {
                    const isSelected = selectedModuleBar === item.moduleId;
                    const dailyData = DAILY_ALERTS_7D.map((d) => ({
                      ...d,
                      val: d[item.moduleId as keyof typeof d] as number,
                    }));
                    return (
                      <YStack key={item.moduleId} gap={6}>
                        <View
                          backgroundColor={colors.cardAlt}
                          borderRadius={10}
                          borderWidth={1}
                          borderColor={isSelected ? item.color + "55" : colors.borderSoft}
                          borderLeftWidth={3}
                          borderLeftColor={item.color}
                          padding={12}
                          pressStyle={{ opacity: 0.8 }}
                          onPress={() => setSelectedModuleBar(isSelected ? null : item.moduleId)}
                        >
                          <XStack justifyContent="space-between" alignItems="center">
                            <Text
                              fontSize={13}
                              fontWeight="600"
                              color={colors.text}
                              fontFamily="$body"
                            >
                              {item.label}
                            </Text>
                            <XStack gap={6} alignItems="center">
                              <Text
                                fontSize={15}
                                fontWeight="700"
                                color={item.color}
                                fontFamily="$mono"
                              >
                                {item.count}
                              </Text>
                              <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
                                alertas
                              </Text>
                            </XStack>
                          </XStack>
                          {isSelected && (
                            <YStack gap={6} marginTop={10}>
                              <SvgBarChart
                                data={dailyData}
                                xKey="day"
                                yKey="val"
                                color={item.color}
                                height={130}
                                labelColor={colors.textLabel}
                                gridColor={colors.borderSoft}
                                onBarPress={onBarPress}
                              />
                              {selectedBar && (
                                <Text fontSize={12} color={colors.textSec} fontFamily="$body">
                                  {selectedBar.label}:{" "}
                                  <Text fontWeight="700" color={item.color} fontFamily="$mono">
                                    {selectedBar.value}
                                  </Text>{" "}
                                  alertas
                                </Text>
                              )}
                            </YStack>
                          )}
                        </View>
                      </YStack>
                    );
                  })}
                </YStack>
              </View>
              <YStack gap={8}>
                <SectionHeader title="Insights — Módulos y Cámaras" />
                {INSIGHTS.filter((i) => i.source === "alerts" || i.source === "cameras").map(
                  (ins) => (
                    <InsightCard key={ins.id} insight={ins} />
                  )
                )}
              </YStack>
            </YStack>
          )}

          {/* ══ HEATMAPS ══ */}
          {activeTab === "heatmaps" && (
            <YStack gap={14}>
              {period === "today" && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <XStack gap={6} paddingBottom={4}>
                    {HOUR_RANGE_KEYS.map((key) => {
                      const active = hourRange === key;
                      return (
                        <View
                          key={key}
                          paddingHorizontal={12}
                          paddingVertical={5}
                          borderRadius={20}
                          backgroundColor={active ? "rgba(59,130,246,0.15)" : colors.cardAlt}
                          borderWidth={1}
                          borderColor={active ? "#3b82f6" : colors.borderSoft}
                          pressStyle={{ opacity: 0.7 }}
                          onPress={() => setHourRange(key)}
                        >
                          <Text
                            fontSize={11}
                            fontWeight={active ? "700" : "400"}
                            color={active ? "#3b82f6" : colors.textTer}
                            fontFamily="$body"
                          >
                            {HOUR_RANGES[key].label}
                          </Text>
                        </View>
                      );
                    })}
                  </XStack>
                </ScrollView>
              )}

              <View
                flexDirection={isDesktop ? "row" : "column"}
                flexWrap={isDesktop ? "wrap" : "nowrap"}
                gap={14}
              >
                {heatmapCameras.map((cam) => {
                  const camHourly = CAMERA_HOURLY[cam.id] ?? [];
                  const filtered = filterHourly(camHourly, hourRange);
                  const peak = camHourly.reduce(
                    (b, d) => (d.count > b.count ? d : b),
                    camHourly[0] ?? { hour: "–", count: 0 }
                  );
                  const total = camHourly.reduce((s, d) => s + d.count, 0);
                  return (
                    <View
                      key={cam.id}
                      backgroundColor={colors.card}
                      borderRadius={14}
                      borderWidth={1}
                      borderColor={colors.borderSoft}
                      padding={16}
                      width={isDesktop ? ("calc(50% - 7px)" as any) : "100%"}
                    >
                      <XStack
                        justifyContent="space-between"
                        alignItems="flex-start"
                        marginBottom={12}
                      >
                        <YStack flex={1} gap={1}>
                          <Text
                            fontSize={13}
                            fontWeight="700"
                            color={colors.text}
                            fontFamily="$body"
                          >
                            {cam.name}
                          </Text>
                          <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
                            {cam.floor} · {cam.room}
                          </Text>
                        </YStack>
                        <XStack gap={6} alignItems="center">
                          <View
                            width={7}
                            height={7}
                            borderRadius={4}
                            backgroundColor={
                              cam.status === "online"
                                ? "#34d399"
                                : cam.status === "alert"
                                  ? "#f87171"
                                  : "#64748b"
                            }
                          />
                          <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
                            {cam.status}
                          </Text>
                        </XStack>
                      </XStack>

                      {/* Heatmap — Skia canvas with real data or fallback */}
                      <View
                        height={160}
                        borderRadius={10}
                        overflow="hidden"
                        marginBottom={12}
                        borderWidth={1}
                        borderColor={colors.border}
                      >
                        <HeatmapCanvas
                          snapshotUrl={heatmapSnapshots[cam.id] ?? null}
                          points={heatmapPoints[cam.id] ?? []}
                          width={isDesktop ? 340 : 340}
                          height={160}
                        />
                      </View>
                      <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
                        Mapa de calor — {cam.name} ({cam.room}). Datos en tiempo real vía
                        people-analytics.
                      </Text>

                      <SectionHeader
                        title={`Afluencia horaria — ${HOUR_RANGES[hourRange].label}`}
                        value={`${total.toLocaleString("es-BO")} pers.`}
                      />
                      {filtered.length > 0 && (
                        <SvgLineChart
                          data={filtered}
                          xKey="hour"
                          yKey="count"
                          color="#3b82f6"
                          height={110}
                          labelColor={colors.textLabel}
                          gridColor={colors.borderSoft}
                          xLabelStep={2}
                          xLabelSuffix="h"
                          onPointPress={onBarPress}
                        />
                      )}

                      <XStack gap={8} marginTop={10}>
                        <View
                          flex={1}
                          backgroundColor={colors.cardAlt}
                          borderRadius={8}
                          padding={9}
                          gap={2}
                        >
                          <Text fontSize={14} fontWeight="700" color="#3b82f6" fontFamily="$mono">
                            {total.toLocaleString("es-BO")}
                          </Text>
                          <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
                            Total hoy
                          </Text>
                        </View>
                        <View
                          flex={1}
                          backgroundColor={colors.cardAlt}
                          borderRadius={8}
                          padding={9}
                          gap={2}
                        >
                          <Text fontSize={14} fontWeight="700" color="#a78bfa" fontFamily="$mono">
                            {peak.hour}:00h
                          </Text>
                          <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
                            Hora pico
                          </Text>
                        </View>
                        <View
                          flex={1}
                          backgroundColor={colors.cardAlt}
                          borderRadius={8}
                          padding={9}
                          gap={2}
                        >
                          <Text fontSize={14} fontWeight="700" color="#fbbf24" fontFamily="$mono">
                            {cam.metrics.alertsToday}
                          </Text>
                          <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
                            Alertas hoy
                          </Text>
                        </View>
                      </XStack>
                    </View>
                  );
                })}
              </View>
            </YStack>
          )}

          {/* AI Chat CTA — deshabilitado hasta tener backend de IA */}
          {/*
          <View
            backgroundColor={colors.card}
            borderRadius={14}
            borderWidth={1}
            borderColor={colors.borderSoft}
            padding={16}
            marginTop={8}
            pressStyle={{ opacity: 0.8 }}
            onPress={() => chatSheetRef.current?.expand()}
          >
            <XStack alignItems="center" gap={12}>
              <View
                width={44}
                height={44}
                borderRadius={12}
                overflow="hidden"
                alignItems="center"
                justifyContent="center"
              >
                <LinearGradient
                  colors={["#1e3a8a", "#3b82f6"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                />
                <Sparkles size={22} color="#ffffff" />
              </View>
              <YStack flex={1}>
                <Text fontSize={14} fontWeight="600" color={colors.text} fontFamily="$body">
                  Pregunta al asistente VigIA
                </Text>
                <Text fontSize={12} color={colors.textTer} fontFamily="$body">
                  ¿Hubo una campaña? ¿Qué causó el pico?
                </Text>
              </YStack>
              <Text fontSize={20} color={colors.textLabel} fontFamily="$body">
                ›
              </Text>
            </XStack>
          </View>
          */}
        </ScrollView>

        {/* Filter Modal */}
        <BottomSheet
          ref={filterSheetRef}
          snapPoints={["85%"]}
          index={-1}
          enablePanDownToClose
          backgroundStyle={{ backgroundColor: colors.card }}
        >
          <BottomSheetScrollView
            contentContainerStyle={{ paddingBottom: 40 }}
            style={{ backgroundColor: colors.card }}
          >
            <YStack padding={20} gap={24} maxWidth={600} alignSelf="center" width="100%">
              <Text fontSize={18} fontWeight="700" color={colors.text} fontFamily="$body">
                Filtros de Reportes
              </Text>

              {/* Period */}
              <YStack gap={12}>
                <Text
                  fontSize={11}
                  fontWeight="700"
                  color={colors.textLabel}
                  fontFamily="$body"
                  letterSpacing={1.2}
                >
                  PERÍODO
                </Text>
                <XStack gap={8}>
                  {PERIODS.map((p) => {
                    const active = period === p.id;
                    return (
                      <View
                        key={p.id}
                        paddingHorizontal={16}
                        paddingVertical={8}
                        borderRadius={20}
                        backgroundColor={active ? "#3b82f6" : colors.card}
                        borderWidth={1}
                        borderColor={active ? "#3b82f6" : colors.border}
                        pressStyle={{ opacity: 0.7 }}
                        onPress={() => setPeriod(p.id)}
                      >
                        <Text
                          fontSize={12}
                          fontWeight={active ? "700" : "500"}
                          color={active ? "#ffffff" : colors.textSec}
                          fontFamily="$body"
                        >
                          {p.label}
                        </Text>
                      </View>
                    );
                  })}
                </XStack>
              </YStack>

              {/* Date filters */}
              <YStack gap={12}>
                <Text
                  fontSize={11}
                  fontWeight="700"
                  color={colors.textLabel}
                  fontFamily="$body"
                  letterSpacing={1.2}
                >
                  RANGO DE FECHAS
                </Text>
                <XStack gap={8} flexWrap="wrap">
                  <View
                    paddingHorizontal={12}
                    paddingVertical={8}
                    borderRadius={12}
                    borderWidth={1}
                    borderColor={colors.borderSoft}
                    backgroundColor={colors.cardAlt}
                    pressStyle={{ opacity: 0.7 }}
                    onPress={() => {
                      setShowDatePickerFor("single");
                      setDatePickerMode("date");
                    }}
                  >
                    <Text fontSize={11} color={colors.text} fontFamily="$body">
                      Día específico
                    </Text>
                    <Text fontSize={12} fontWeight="700" color="#3b82f6" fontFamily="$mono">
                      {selectedDay ? formatDay(selectedDay) : "Seleccionar"}
                    </Text>
                  </View>

                  <View
                    paddingHorizontal={12}
                    paddingVertical={8}
                    borderRadius={12}
                    borderWidth={1}
                    borderColor={colors.borderSoft}
                    backgroundColor={colors.cardAlt}
                    pressStyle={{ opacity: 0.7 }}
                    onPress={() => {
                      setShowDatePickerFor("start");
                      setDatePickerMode("date");
                    }}
                  >
                    <Text fontSize={11} color={colors.text} fontFamily="$body">
                      Inicio rango
                    </Text>
                    <Text fontSize={12} fontWeight="700" color="#3b82f6" fontFamily="$mono">
                      {rangeStart ? formatDay(rangeStart) : "Seleccionar"}
                    </Text>
                  </View>

                  <View
                    paddingHorizontal={12}
                    paddingVertical={8}
                    borderRadius={12}
                    borderWidth={1}
                    borderColor={colors.borderSoft}
                    backgroundColor={colors.cardAlt}
                    pressStyle={{ opacity: 0.7 }}
                    onPress={() => {
                      setShowDatePickerFor("end");
                      setDatePickerMode("date");
                    }}
                  >
                    <Text fontSize={11} color={colors.text} fontFamily="$body">
                      Fin rango
                    </Text>
                    <Text fontSize={12} fontWeight="700" color="#3b82f6" fontFamily="$mono">
                      {rangeEnd ? formatDay(rangeEnd) : "Seleccionar"}
                    </Text>
                  </View>
                </XStack>

                <XStack alignItems="center" gap={8}>
                  <Text fontSize={12} color={colors.textLabel} fontFamily="$body">
                    Comparar con otro rango
                  </Text>
                  <Switch
                    value={compareRange}
                    onValueChange={setCompareRange}
                    trackColor={{ false: colors.cardAlt, true: "#3b82f6" }}
                    thumbColor="#ffffff"
                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                  />
                </XStack>

                {compareRange && (
                  <XStack gap={8} flexWrap="wrap">
                    <View
                      paddingHorizontal={12}
                      paddingVertical={8}
                      borderRadius={12}
                      borderWidth={1}
                      borderColor={colors.borderSoft}
                      backgroundColor={colors.cardAlt}
                      pressStyle={{ opacity: 0.7 }}
                      onPress={() => {
                        setShowDatePickerFor("compareStart");
                        setDatePickerMode("date");
                      }}
                    >
                      <Text fontSize={11} color={colors.text} fontFamily="$body">
                        Inicio comparación
                      </Text>
                      <Text fontSize={12} fontWeight="700" color="#3b82f6" fontFamily="$mono">
                        {compareStart ? formatDay(compareStart) : "Seleccionar"}
                      </Text>
                    </View>

                    <View
                      paddingHorizontal={12}
                      paddingVertical={8}
                      borderRadius={12}
                      borderWidth={1}
                      borderColor={colors.borderSoft}
                      backgroundColor={colors.cardAlt}
                      pressStyle={{ opacity: 0.7 }}
                      onPress={() => {
                        setShowDatePickerFor("compareEnd");
                        setDatePickerMode("date");
                      }}
                    >
                      <Text fontSize={11} color={colors.text} fontFamily="$body">
                        Fin comparación
                      </Text>
                      <Text fontSize={12} fontWeight="700" color="#3b82f6" fontFamily="$mono">
                        {compareEnd ? formatDay(compareEnd) : "Seleccionar"}
                      </Text>
                    </View>
                  </XStack>
                )}
              </YStack>

              {/* Time filters */}
              {period === "today" && (
                <YStack gap={12}>
                  <Text
                    fontSize={11}
                    fontWeight="700"
                    color={colors.textLabel}
                    fontFamily="$body"
                    letterSpacing={1.2}
                  >
                    RANGO DE HORAS
                  </Text>
                  <XStack gap={8}>
                    <View
                      paddingHorizontal={12}
                      paddingVertical={8}
                      borderRadius={12}
                      borderWidth={1}
                      borderColor={colors.borderSoft}
                      backgroundColor={colors.cardAlt}
                      pressStyle={{ opacity: 0.7 }}
                      onPress={() => {
                        setShowDatePickerFor("startTime");
                        setDatePickerMode("time");
                      }}
                    >
                      <Text fontSize={11} color={colors.text} fontFamily="$body">
                        Hora inicio
                      </Text>
                      <Text fontSize={12} fontWeight="700" color="#3b82f6" fontFamily="$mono">
                        {selectedHourFrom ? `${selectedHourFrom}:00` : "Seleccionar"}
                      </Text>
                    </View>

                    <View
                      paddingHorizontal={12}
                      paddingVertical={8}
                      borderRadius={12}
                      borderWidth={1}
                      borderColor={colors.borderSoft}
                      backgroundColor={colors.cardAlt}
                      pressStyle={{ opacity: 0.7 }}
                      onPress={() => {
                        setShowDatePickerFor("endTime");
                        setDatePickerMode("time");
                      }}
                    >
                      <Text fontSize={11} color={colors.text} fontFamily="$body">
                        Hora fin
                      </Text>
                      <Text fontSize={12} fontWeight="700" color="#3b82f6" fontFamily="$mono">
                        {selectedHourTo ? `${selectedHourTo}:00` : "Seleccionar"}
                      </Text>
                    </View>
                  </XStack>
                </YStack>
              )}

              {/* Clear filters */}
              <View
                height={44}
                borderRadius={12}
                borderWidth={1}
                borderColor={colors.border}
                alignItems="center"
                justifyContent="center"
                pressStyle={{ opacity: 0.7 }}
                onPress={() => {
                  setPeriod("7d");
                  setSelectedDay(null);
                  setRangeStart(null);
                  setRangeEnd(null);
                  setCompareRange(false);
                  setCompareStart(null);
                  setCompareEnd(null);
                  setSelectedHourFrom(null);
                  setSelectedHourTo(null);
                  setHourRange("all");
                  setShowFilters(false);
                }}
              >
                <Text fontSize={13} fontWeight="600" color={colors.textTer} fontFamily="$body">
                  Limpiar filtros
                </Text>
              </View>
            </YStack>
          </BottomSheetScrollView>
        </BottomSheet>

        {/* <ReportChatSheet sheetRef={chatSheetRef} contextLabel={chatContext} /> */}
      </View>
    </PageContainer>
  );
}
