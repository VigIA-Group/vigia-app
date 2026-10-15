import BottomSheet, { BottomSheetScrollView } from "@/src/components/bottom-sheet";
import { BidirectionalTrafficChart } from "@/src/components/charts/bidirectional-traffic-chart";
import { ConversionChart } from "@/src/components/charts/conversion-chart";
import { DailyTrafficTable } from "@/src/components/charts/daily-traffic-table";
import { OperationalIncidentsFeed } from "@/src/components/charts/operational-incidents-feed";
import { OperationsKpiSummary } from "@/src/components/charts/operations-kpi-summary";
import { ProductVarietyBreakdownCard } from "@/src/components/charts/product-variety-breakdown-card";
import { ProductionDowntimeTimeline } from "@/src/components/charts/production-downtime-timeline";
import { ProductionKpiSummary } from "@/src/components/charts/production-kpi-summary";
import { ProductionQualityControlCard } from "@/src/components/charts/production-quality-control-card";
import { ProductionThroughputChart } from "@/src/components/charts/production-throughput-chart";
import { StoreOccupancyGauge } from "@/src/components/charts/store-occupancy-gauge";
import { StoreOpeningPunctualityCard } from "@/src/components/charts/store-opening-punctuality-card";
import { SvgBarChart } from "@/src/components/charts/svg-bar-chart";
import { SvgLineChart } from "@/src/components/charts/svg-line-chart";
import { SvgMultiLineChart } from "@/src/components/charts/svg-multi-line-chart";
import { TrafficHeatmapMatrix } from "@/src/components/charts/traffic-heatmap-matrix";
import { UniformComplianceCard } from "@/src/components/charts/uniform-compliance-card";
import { WeekdayVsWeekendCard } from "@/src/components/charts/weekday-vs-weekend-card";
import { ZoneDwellChart } from "@/src/components/charts/zone-dwell-chart";
import { RestaurantTableServiceCard } from "@/src/components/charts/restaurant-table-service-card";
import { InsightCard } from "@/src/components/insight-card";
import { PageContainer } from "@/src/components/page-container";
import { ReportChatSheet } from "@/src/components/report-chat-sheet";
import { getIndustryById } from "@/src/data/industries";
import {
  ALERTS_BY_MODULE,
  CAMERA_HOURLY,
  CAMERAS,
  DAILY_ALERTS_7D,
  DAILY_PEOPLE_30D,
  DAILY_PEOPLE_7D,
  DAILY_PEOPLE_7D_PREV,
  DailyPeoplePoint,
  filterHourly,
  getPeakHourToday,
  getWeeklyChangePercent,
  HOUR_RANGES,
  HourRange,
  HOURLY_ACTIVITY_TODAY,
  INSIGHTS,
} from "@/src/data/mock";
import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { useColors } from "@/src/hooks/use-colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import {
  BarChart2,
  Bell,
  Briefcase,
  ChevronRight,
  Factory,
  Filter,
  GitCompareArrows,
  Map,
  MessageCircle,
  ShieldAlert,
  Users,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import { Platform, ScrollView, Switch, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View, XStack, YStack } from "tamagui";

type ReportTab = "traffic" | "production" | "operations" | "alerts" | "modules" | "heatmaps";
type Period = "today" | "7d" | "30d";
type TrafficSubTab = "all" | "occupancy" | "trends" | "breakdown";

const TRAFFIC_SUB_TABS: { id: TrafficSubTab; label: string }[] = [
  { id: "all", label: "Vista Completa" },
  { id: "occupancy", label: "Aforo & En Vivo" },
  { id: "trends", label: "Tendencias & Matriz" },
  { id: "breakdown", label: "Desglose & Conversión" },
];

const TABS: { id: ReportTab; label: string; Icon: typeof BarChart2 }[] = [
  { id: "traffic", label: "Tráfico", Icon: Users },
  { id: "production", label: "Producción", Icon: Factory },
  { id: "operations", label: "Operaciones", Icon: Briefcase },
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

export default function IndustryReportsScreen() {
  const { industry } = useLocalSearchParams<{ industry: string }>();
  const ind = industry ? getIndustryById(industry) : undefined;

  const insets = useSafeAreaInsets();
  const colors = useColors();
  const chatSheetRef = useRef<BottomSheet>(null);
  const filterSheetRef = useRef<BottomSheet>(null);
  const { isDesktop } = useBreakpoint();

  const [activeTab, setActiveTab] = useState<ReportTab>("traffic");
  const [trafficSubTab, setTrafficSubTab] = useState<TrafficSubTab>("all");
  const [period, setPeriod] = useState<Period>("7d");
  const [hourRange, setHourRange] = useState<HourRange>("all");
  const [selectedHourFrom, setSelectedHourFrom] = useState<number | null>(null);
  const [selectedHourTo, setSelectedHourTo] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [compareRange, setCompareRange] = useState(false);
  const [compareStart, setCompareStart] = useState<Date | null>(null);
  const [compareEnd, setCompareEnd] = useState<Date | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showDatePickerFor, setShowDatePickerFor] = useState<
    "single" | "start" | "end" | "compareStart" | "compareEnd" | "startTime" | "endTime" | null
  >(null);
  const [datePickerMode, setDatePickerMode] = useState<"date" | "time">("date");
  const [comparePeriod, setComparePeriod] = useState(false);
  const [selectedBar, setSelectedBar] = useState<{ label: string; value: number } | null>(null);
  const [selectedModuleBar, setSelectedModuleBar] = useState<string | null>(null);

  const onBarPress = (label: string, value: number) => setSelectedBar({ label, value });

  const totalAlerts7d = DAILY_ALERTS_7D.reduce(
    (s, d) => s + d.intrusion + d.stolen + d.fall + d.ocr + d.people + d.tampering,
    0
  );
  const maxAlerts = Math.max(...ALERTS_BY_MODULE.map((a) => a.count), 1);
  const topModule = ALERTS_BY_MODULE.reduce((b, a) => (a.count > b.count ? a : b));

  const heatmapCameras = CAMERAS.filter((c) => c.status !== "offline");

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

  const isHourlySeries = (data: unknown[]): data is Array<{ hour: string; count: number }> =>
    data.length > 0 && typeof (data[0] as any).hour === "string";

  const selectedRangeLabel =
    rangeStart && rangeEnd ? `${formatDay(rangeStart)} → ${formatDay(rangeEnd)}` : null;
  const compareRangeLabel =
    compareStart && compareEnd ? `${formatDay(compareStart)} → ${formatDay(compareEnd)}` : null;

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

  const sectorName = ind?.name ?? "Sector";
  const chatContext = `${sectorName} — ${TABS.find((t) => t.id === activeTab)?.label} — ${
    selectedRangeLabel
      ? `Rango: ${selectedRangeLabel}`
      : selectedDay
        ? `Día: ${formatDay(selectedDay)}`
        : period === "today"
          ? "Hoy"
          : period === "7d"
            ? "últimos 7 días"
            : "últimos 30 días"
  }${selectedHourFrom !== null || selectedHourTo !== null ? ` • Horas ${selectedHourFrom ?? 0}-${selectedHourTo ?? 23}` : ""}`;

  return (
    <PageContainer>
      <View flex={1} backgroundColor={colors.bg}>
        {/* Header */}
        <XStack
          paddingTop={insets.top + 8}
          paddingHorizontal={20}
          paddingBottom={12}
          justifyContent="space-between"
          alignItems="center"
          backgroundColor={colors.bg}
        >
          <YStack gap={2}>
            <XStack alignItems="center" gap={8}>
              <Text fontSize={20} fontWeight="700" color={colors.text} fontFamily="$body">
                Reportes & Analíticas
              </Text>
              {ind && (
                <View
                  backgroundColor={ind.accentColor + "20"}
                  borderWidth={1}
                  borderColor={ind.accentColor + "50"}
                  paddingHorizontal={8}
                  paddingVertical={2}
                  borderRadius={6}
                >
                  <Text fontSize={11} fontWeight="800" color={ind.accentColor} fontFamily="$body">
                    {ind.shortName}
                  </Text>
                </View>
              )}
            </XStack>
            <Text fontSize={12} color={colors.textLabel} fontFamily="$body">
              Videoanalítica de IA aplicada a {sectorName.toLowerCase()}
            </Text>
          </YStack>

          <XStack alignItems="center" gap={10}>
            {/* Quick Sector Switcher */}
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

            <TouchableOpacity
              onPress={() => filterSheetRef.current?.expand()}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.borderSoft,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Filter size={16} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => chatSheetRef.current?.expand()}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "#0A4CE8",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MessageCircle size={16} color="#ffffff" />
            </TouchableOpacity>
          </XStack>
        </XStack>

        {/* Navigation Tabs */}
        <View paddingHorizontal={16} paddingBottom={8}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack gap={8}>
              {TABS.map((tab) => {
                const active = activeTab === tab.id;
                const TabIcon = tab.Icon;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    onPress={() => setActiveTab(tab.id)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      borderRadius: 10,
                      backgroundColor: active ? "rgba(10, 76, 232, 0.15)" : colors.card,
                      borderWidth: 1,
                      borderColor: active ? "#056EFA" : colors.borderSoft,
                    }}
                  >
                    <TabIcon size={15} color={active ? "#056EFA" : colors.textLabel} />
                    <Text
                      fontSize={13}
                      fontWeight={active ? "700" : "500"}
                      color={active ? "#056EFA" : colors.textSec}
                      fontFamily="$body"
                    >
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </XStack>
          </ScrollView>
        </View>

        {/* Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 100, gap: 14 }}
        >
          {/* ══ 1. TRÁFICO ══ */}
          {activeTab === "traffic" && (
            <YStack gap={14}>
              {/* Traffic sub-tabs */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: -4 }}
              >
                <XStack gap={8} paddingVertical={2}>
                  {TRAFFIC_SUB_TABS.map((subTab) => {
                    const active = trafficSubTab === subTab.id;
                    return (
                      <View
                        key={subTab.id}
                        paddingHorizontal={14}
                        paddingVertical={6}
                        borderRadius={20}
                        backgroundColor={active ? "rgba(10, 76, 232, 0.15)" : colors.card}
                        borderWidth={1}
                        borderColor={active ? "#056EFA" : colors.borderSoft}
                        pressStyle={{ opacity: 0.7 }}
                        onPress={() => setTrafficSubTab(subTab.id)}
                      >
                        <Text
                          fontSize={12}
                          fontWeight={active ? "700" : "500"}
                          color={active ? "#056EFA" : colors.textSec}
                          fontFamily="$body"
                        >
                          {subTab.label}
                        </Text>
                      </View>
                    );
                  })}
                </XStack>
              </ScrollView>

              {/* SECCIÓN 1: Aforo & En Vivo */}
              {(trafficSubTab === "all" || trafficSubTab === "occupancy") && (
                <XStack gap={14} flexDirection={isDesktop ? "row" : "column"} alignItems="stretch">
                  <View flex={isDesktop ? 1 : undefined} width={isDesktop ? undefined : "100%"}>
                    <StoreOccupancyGauge />
                  </View>
                  <View flex={isDesktop ? 1 : undefined} width={isDesktop ? undefined : "100%"}>
                    <BidirectionalTrafficChart />
                  </View>
                </XStack>
              )}

              {/* SECCIÓN 2: Tendencias & Matriz */}
              {(trafficSubTab === "all" || trafficSubTab === "trends") && (
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
                      color="#056EFA"
                    />
                    <KpiMini
                      label="Promedio / día"
                      value={avgTraffic.toLocaleString("es-BO")}
                      color="#056EFA"
                    />
                    <KpiMini
                      label="Pico"
                      value={maxDay.count.toLocaleString("es-BO")}
                      color="#a78bfa"
                    />
                  </XStack>

                  {selectedBar && (
                    <XStack
                      backgroundColor="rgba(5, 110, 250, 0.10)"
                      borderRadius={10}
                      borderWidth={1}
                      borderColor="rgba(5, 110, 250, 0.3)"
                      paddingHorizontal={14}
                      paddingVertical={10}
                      alignItems="center"
                      gap={8}
                    >
                      <View width={8} height={8} borderRadius={4} backgroundColor="#056EFA" />
                      <Text fontSize={13} color={colors.text} fontFamily="$body">
                        <Text fontWeight="700" color="#056EFA" fontFamily="$mono">
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
                  <XStack
                    gap={14}
                    alignItems="flex-start"
                    flexDirection={isDesktop ? "row" : "column"}
                  >
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
                              trackColor={{ false: colors.cardAlt, true: "#056EFA" }}
                              thumbColor="#ffffff"
                              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                            />
                          </XStack>
                        )}
                      </XStack>

                      {isHourlySeries(trafficData) && (
                        <XStack
                          backgroundColor="rgba(10, 76, 232, 0.12)"
                          borderColor="rgba(10, 76, 232, 0.3)"
                          borderWidth={1}
                          borderRadius={8}
                          paddingHorizontal={10}
                          paddingVertical={5}
                          alignSelf="flex-start"
                          alignItems="center"
                          gap={6}
                          marginBottom={10}
                        >
                          <View width={6} height={6} borderRadius={3} backgroundColor="#056EFA" />
                          <Text fontSize={11} fontWeight="700" color="#056EFA" fontFamily="$body">
                            Hora pico: {getPeakHourToday().hour}:00 – {getPeakHourToday().count}{" "}
                            personas
                          </Text>
                        </XStack>
                      )}

                      {isHourlySeries(trafficData) ? (
                        <SvgLineChart
                          data={trafficData}
                          xKey="hour"
                          yKey="count"
                          color="#056EFA"
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
                          color="#056EFA"
                          compareData={applicableCompareTraffic as DailyPeoplePoint[] | undefined}
                          compareColor="#475569"
                          height={period === "30d" || (rangeStart && rangeEnd) ? 200 : 190}
                          labelColor={colors.textLabel}
                          gridColor={colors.borderSoft}
                          onBarPress={onBarPress}
                        />
                      )}

                      {comparePeriod && period === "7d" && (
                        <XStack
                          justifyContent="space-between"
                          alignItems="center"
                          marginTop={12}
                          flexWrap="wrap"
                          gap={8}
                        >
                          <XStack gap={16}>
                            <XStack gap={5} alignItems="center">
                              <View
                                width={12}
                                height={3}
                                borderRadius={2}
                                backgroundColor="#056EFA"
                              />
                              <Text fontSize={11} color={colors.textTer} fontFamily="$body">
                                Actual
                              </Text>
                            </XStack>
                            <XStack gap={5} alignItems="center">
                              <View
                                width={12}
                                height={3}
                                borderRadius={2}
                                backgroundColor="#475569"
                              />
                              <Text fontSize={11} color={colors.textTer} fontFamily="$body">
                                Período anterior
                              </Text>
                            </XStack>
                          </XStack>
                          <View
                            backgroundColor={
                              getWeeklyChangePercent() >= 0
                                ? "rgba(52, 211, 153, 0.15)"
                                : "rgba(248, 113, 113, 0.15)"
                            }
                            paddingHorizontal={8}
                            paddingVertical={3}
                            borderRadius={6}
                          >
                            <Text
                              fontSize={11}
                              fontWeight="700"
                              fontFamily="$mono"
                              color={getWeeklyChangePercent() >= 0 ? "#34d399" : "#f87171"}
                            >
                              {getWeeklyChangePercent() >= 0 ? "+" : ""}
                              {getWeeklyChangePercent()}% vs. semana anterior
                            </Text>
                          </View>
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
                                      <Text
                                        fontSize={10}
                                        color={colors.textLabel}
                                        fontFamily="$body"
                                      >
                                        {cam.room}
                                      </Text>
                                    </YStack>
                                    <Text
                                      fontSize={12}
                                      fontWeight="700"
                                      color="#056EFA"
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
                                      backgroundColor="#056EFA"
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

                  {/* Matriz Semanal de Calor */}
                  <TrafficHeatmapMatrix />
                </YStack>
              )}

              {/* SECCIÓN 3: Desglose & Conversión */}
              {(trafficSubTab === "all" || trafficSubTab === "breakdown") && (
                <YStack gap={14}>
                  <WeekdayVsWeekendCard />
                  <ConversionChart />
                  <DailyTrafficTable />
                </YStack>
              )}
            </YStack>
          )}

          {/* ══ 2. PRODUCCIÓN ══ */}
          {activeTab === "production" && (
            <YStack gap={14}>
              <ProductionKpiSummary />
              <ProductionThroughputChart />
              <XStack gap={14} flexDirection={isDesktop ? "row" : "column"} alignItems="stretch">
                <View flex={1}>
                  <ProductionQualityControlCard />
                </View>
                <View flex={1}>
                  <ProductVarietyBreakdownCard />
                </View>
              </XStack>
              <ProductionDowntimeTimeline />
            </YStack>
          )}

          {/* ══ 3. OPERACIONES ══ */}
          {activeTab === "operations" && (
            <YStack gap={14}>
              {(ind?.id === "restaurantes" || ind?.id === "cocinas-profesionales") && (
                <RestaurantTableServiceCard />
              )}
              <OperationsKpiSummary />
              <XStack gap={14} flexDirection={isDesktop ? "row" : "column"} alignItems="stretch">
                <View flex={1}>
                  <UniformComplianceCard />
                </View>
                <View flex={1}>
                  <StoreOpeningPunctualityCard />
                </View>
              </XStack>
              <OperationalIncidentsFeed />
            </YStack>
          )}

          {/* ══ 4. ALERTAS ══ */}
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
                    { yKey: "people", color: "#056EFA", label: "Personas" },
                    { yKey: "ocr", color: "#6366f1", label: "OCR/Placas" },
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
                    { color: "#056EFA", label: "Personas" },
                    { color: "#6366f1", label: "OCR" },
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

          {/* ══ 5. MÓDULOS ══ */}
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

          {/* ══ 6. MAPAS DE CALOR ══ */}
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

              <ZoneDwellChart />

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

                      <View
                        height={160}
                        borderRadius={10}
                        overflow="hidden"
                        marginBottom={12}
                        borderWidth={1}
                        borderColor={colors.border}
                      >
                        <Image
                          source={require("../../../assets/heatmap.png")}
                          style={{ width: "100%", height: "100%" }}
                          contentFit="cover"
                        />
                      </View>
                      <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
                        Heatmap de la cámara: {cam.name} ({cam.room}).
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
                Filtros de Reportes — {ind?.shortName ?? "Sector"}
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

        <ReportChatSheet sheetRef={chatSheetRef} contextLabel={chatContext} />
      </View>
    </PageContainer>
  );
}
