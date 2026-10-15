import BottomSheet, { BottomSheetScrollView } from "@/src/components/bottom-sheet";
import { EventItemCard } from "@/src/components/event-item-card";
import { InsightCard } from "@/src/components/insight-card";
import { ModuleChip } from "@/src/components/module-chip";
import { OwlState } from "@/src/components/owl-state";
import { PageContainer } from "@/src/components/page-container";
import { getIndustryById } from "@/src/data/industries";
import type { EventItem, HourRange, Insight, ModuleId, Severity } from "@/src/data/mock";
import { HOUR_RANGES, MODULES, groupEventsByDate } from "@/src/data/mock";
import { useColors } from "@/src/hooks/use-colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { Bell, Filter, Sparkles, X } from "lucide-react-native";
import React, { useCallback, useRef, useState } from "react";
import { Platform, ScrollView, SectionList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View, XStack, YStack } from "tamagui";

const SEVERITIES: Severity[] = ["ALTA", "MEDIA", "BAJA"];
const DATE_RANGES = ["Hoy", "Últimos 7 días", "Últimos 30 días"] as const;
type DateRange = (typeof DATE_RANGES)[number];
type ActiveView = "alerts" | "insights";

function normalizeDate(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function filterEvents(
  events: EventItem[],
  modules: ModuleId[],
  severities: Severity[],
  dateRange: DateRange | null,
  hourRange: HourRange | null,
  selectedDay: Date | null,
  rangeStart: Date | null,
  rangeEnd: Date | null,
  startTime: Date | null,
  endTime: Date | null
): EventItem[] {
  return events.filter((e) => {
    const moduleMatch = modules.length === 0 || modules.includes(e.module);
    const severityMatch = severities.length === 0 || severities.includes(e.severity);

    const evt = new Date(e.timestamp);
    let dateMatch = true;
    if (selectedDay) {
      dateMatch = normalizeDate(evt).getTime() === normalizeDate(selectedDay).getTime();
    } else if (rangeStart && rangeEnd) {
      const start = normalizeDate(rangeStart).getTime();
      const end = normalizeDate(rangeEnd).getTime() + 86399999;
      dateMatch = evt.getTime() >= start && evt.getTime() <= end;
    } else if (dateRange) {
      const now = new Date();
      if (dateRange === "Hoy") {
        dateMatch = evt.toDateString() === now.toDateString();
      } else if (dateRange === "Últimos 7 días") {
        dateMatch = now.getTime() - evt.getTime() < 7 * 86400000;
      } else {
        dateMatch = now.getTime() - evt.getTime() < 30 * 86400000;
      }
    }

    let hourMatch = true;
    if (startTime && endTime) {
      const eventTime = evt.getHours() * 60 + evt.getMinutes();
      const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
      const endMinutes = endTime.getHours() * 60 + endTime.getMinutes();
      hourMatch = eventTime >= startMinutes && eventTime <= endMinutes;
    } else if (hourRange && hourRange !== "all") {
      const { start, end } = HOUR_RANGES[hourRange];
      const h = evt.getHours();
      hourMatch = h >= start && h < end;
    }

    return moduleMatch && severityMatch && dateMatch && hourMatch;
  });
}

export default function IndustryAlertsScreen() {
  const { industry } = useLocalSearchParams<{ industry: string }>();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const filterSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["70%", "92%"];

  const ind = industry ? getIndustryById(industry) : undefined;

  const [activeView, setActiveView] = useState<ActiveView>("alerts");
  const [selectedModules, setSelectedModules] = useState<ModuleId[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<Severity[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | null>(null);
  const [selectedHourRange, setSelectedHourRange] = useState<HourRange | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  if (!ind) return null;

  // Map industry alerts into EventItem[]
  const rawEvents: EventItem[] = ind.alerts.map((alt, idx) => ({
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

  // Map industry insights into Insight[]
  const industryInsights: Insight[] = ind.insights.map((ins) => ({
    id: ins.id,
    type: ins.positive ? "positive" : ins.type === "alert" ? "critical" : "warning",
    title: ins.title,
    description: ins.desc,
    metric: ins.change,
    recommendation: ins.actionLabel || ins.desc,
    source: "general" as const,
  }));

  const filtered = filterEvents(
    rawEvents,
    selectedModules,
    selectedSeverities,
    selectedDateRange,
    selectedHourRange,
    selectedDay,
    rangeStart,
    rangeEnd,
    startTime,
    endTime
  );
  const grouped = groupEventsByDate(filtered);

  const hasFilters =
    selectedModules.length > 0 ||
    selectedSeverities.length > 0 ||
    selectedDay !== null ||
    (rangeStart !== null && rangeEnd !== null) ||
    selectedDateRange !== null ||
    (selectedHourRange !== null && selectedHourRange !== "all") ||
    (startTime !== null && endTime !== null);

  const toggleModule = (id: ModuleId) => {
    setSelectedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const toggleSeverity = (s: Severity) => {
    setSelectedSeverities((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const openFilters = useCallback(() => {
    filterSheetRef.current?.expand();
  }, []);

  const SEVERITY_COLORS: Record<Severity, string> = {
    ALTA: "#f87171",
    MEDIA: "#fbbf24",
    BAJA: "#34d399",
  };

  return (
    <PageContainer>
      <View flex={1} backgroundColor={colors.bg}>
        {/* Header (Exact identical layout as normal demo) */}
        <YStack
          paddingTop={insets.top + 8}
          paddingHorizontal={20}
          paddingBottom={12}
          backgroundColor={colors.bg}
          gap={10}
          borderBottomWidth={1}
          borderBottomColor={colors.borderSoft}
        >
          {/* Title + filter button */}
          <XStack justifyContent="space-between" alignItems="center">
            <YStack>
              <Text fontSize={22} fontWeight="700" color={colors.text} fontFamily="$body">
                Notificaciones — {ind.name}
              </Text>
              <Text fontSize={12} color={colors.textTer} fontFamily="$body">
                {ind.assignedUser.organization}
              </Text>
            </YStack>
            <View
              width={36}
              height={36}
              borderRadius={10}
              backgroundColor={hasFilters ? "rgba(59,130,246,0.15)" : colors.card}
              borderWidth={1}
              borderColor={hasFilters ? "#3b82f6" : colors.borderSoft}
              alignItems="center"
              justifyContent="center"
              pressStyle={{ opacity: 0.7 }}
              onPress={openFilters}
            >
              <Filter size={16} color={hasFilters ? "#3b82f6" : "#64748b"} />
            </View>
          </XStack>

          {/* Tab toggle: Alertas / Insights */}
          <XStack backgroundColor={colors.cardAlt} borderRadius={10} padding={3} gap={3}>
            {(["alerts", "insights"] as ActiveView[]).map((v) => {
              const active = activeView === v;
              return (
                <View
                  key={v}
                  flex={1}
                  height={34}
                  borderRadius={8}
                  backgroundColor={active ? colors.card : "transparent"}
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="row"
                  gap={5}
                  pressStyle={{ opacity: 0.7 }}
                  onPress={() => setActiveView(v)}
                  borderWidth={active ? 1 : 0}
                  borderColor={active ? colors.borderSoft : "transparent"}
                >
                  {v === "alerts" ? (
                    <Bell size={13} color={active ? "#3b82f6" : colors.textLabel} />
                  ) : (
                    <Sparkles size={13} color={active ? "#a78bfa" : colors.textLabel} />
                  )}
                  <Text
                    fontSize={12}
                    fontWeight={active ? "700" : "500"}
                    color={active ? (v === "alerts" ? "#3b82f6" : "#a78bfa") : colors.textLabel}
                    fontFamily="$body"
                  >
                    {v === "alerts" ? `Alertas (${filtered.length})` : "Insights"}
                  </Text>
                </View>
              );
            })}
          </XStack>

          {/* Active filter pills */}
          {hasFilters && activeView === "alerts" && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <XStack gap={6}>
                {selectedModules.map((m) => {
                  const mod = MODULES.find((x) => x.id === m);
                  if (!mod) return null;
                  return (
                    <XStack
                      key={m}
                      paddingHorizontal={10}
                      paddingVertical={4}
                      borderRadius={100}
                      backgroundColor={mod.color + "22"}
                      borderWidth={1}
                      borderColor={mod.color + "55"}
                      alignItems="center"
                      gap={6}
                      pressStyle={{ opacity: 0.7 }}
                      onPress={() => toggleModule(m)}
                    >
                      <Text fontSize={11} color={mod.color} fontFamily="$body" fontWeight="600">
                        {mod.name}
                      </Text>
                      <X size={10} color={mod.color} />
                    </XStack>
                  );
                })}
                {selectedSeverities.map((s) => (
                  <XStack
                    key={s}
                    paddingHorizontal={10}
                    paddingVertical={4}
                    borderRadius={100}
                    backgroundColor={SEVERITY_COLORS[s] + "22"}
                    borderWidth={1}
                    borderColor={SEVERITY_COLORS[s] + "55"}
                    alignItems="center"
                    gap={6}
                    pressStyle={{ opacity: 0.7 }}
                    onPress={() => toggleSeverity(s)}
                  >
                    <Text
                      fontSize={11}
                      color={SEVERITY_COLORS[s]}
                      fontFamily="$body"
                      fontWeight="600"
                    >
                      {s}
                    </Text>
                    <X size={10} color={SEVERITY_COLORS[s]} />
                  </XStack>
                ))}
                {selectedDateRange && (
                  <XStack
                    paddingHorizontal={10}
                    paddingVertical={4}
                    borderRadius={100}
                    backgroundColor="rgba(167,139,250,0.15)"
                    borderWidth={1}
                    borderColor="rgba(167,139,250,0.3)"
                    alignItems="center"
                    gap={6}
                    pressStyle={{ opacity: 0.7 }}
                    onPress={() => setSelectedDateRange(null)}
                  >
                    <Text fontSize={11} color="#a78bfa" fontFamily="$body" fontWeight="600">
                      {selectedDateRange}
                    </Text>
                    <X size={10} color="#a78bfa" />
                  </XStack>
                )}
              </XStack>
            </ScrollView>
          )}
        </YStack>

        {/* Content list */}
        {activeView === "alerts" ? (
          filtered.length === 0 ? (
            <YStack flex={1} alignItems="center" justifyContent="center" gap={16} paddingVertical={40}>
              <OwlState variant="empty" size="large" floating={false} />
              <Text fontSize={15} color={colors.textLabel} fontFamily="$body" textAlign="center">
                Sin eventos para este filtro
              </Text>
            </YStack>
          ) : (
            <SectionList
              sections={grouped}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 100 }}
              renderSectionHeader={({ section: { label } }) => (
                <View
                  backgroundColor={colors.bg}
                  paddingHorizontal={20}
                  paddingVertical={8}
                >
                  <Text
                    fontSize={11}
                    fontWeight="700"
                    color={colors.textLabel}
                    fontFamily="$body"
                    letterSpacing={0.5}
                  >
                    {label.toUpperCase()}
                  </Text>
                </View>
              )}
              renderItem={({ item, index, section }) => (
                <View
                  backgroundColor={colors.card}
                  marginHorizontal={16}
                  borderTopLeftRadius={index === 0 ? 14 : 0}
                  borderTopRightRadius={index === 0 ? 14 : 0}
                  borderBottomLeftRadius={index === section.data.length - 1 ? 14 : 0}
                  borderBottomRightRadius={index === section.data.length - 1 ? 14 : 0}
                  borderWidth={1}
                  borderColor={colors.borderSoft}
                  borderTopWidth={index === 0 ? 1 : 0}
                  overflow="hidden"
                >
                  <EventItemCard
                    event={item}
                    onPress={() => router.push(`/${ind.id}/alerts/${item.id}` as any)}
                  />
                  {index < section.data.length - 1 && (
                    <View
                      height={1}
                      backgroundColor={colors.borderSoft}
                      marginHorizontal={12}
                    />
                  )}
                </View>
              )}
            />
          )
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16, paddingBottom: 100, gap: 12 }}
          >
            {industryInsights.map((ins) => (
              <InsightCard key={ins.id} insight={ins} />
            ))}
          </ScrollView>
        )}

        {/* Filter BottomSheet */}
        <BottomSheet ref={filterSheetRef} snapPoints={snapPoints} enablePanDownToClose>
          <BottomSheetScrollView contentContainerStyle={{ padding: 20 }}>
            <YStack gap={20}>
              <Text fontSize={17} fontWeight="700" color={colors.text} fontFamily="$body">
                Filtrar notificaciones
              </Text>

              {/* Severities */}
              <YStack gap={8}>
                <Text fontSize={12} fontWeight="600" color={colors.textLabel} fontFamily="$body">
                  SEVERIDAD
                </Text>
                <XStack gap={8}>
                  {SEVERITIES.map((s) => {
                    const sel = selectedSeverities.includes(s);
                    return (
                      <View
                        key={s}
                        paddingHorizontal={14}
                        paddingVertical={7}
                        borderRadius={20}
                        backgroundColor={sel ? SEVERITY_COLORS[s] + "22" : colors.card}
                        borderWidth={1}
                        borderColor={sel ? SEVERITY_COLORS[s] : colors.borderSoft}
                        pressStyle={{ opacity: 0.7 }}
                        onPress={() => toggleSeverity(s)}
                      >
                        <Text
                          fontSize={12}
                          fontWeight="600"
                          color={sel ? SEVERITY_COLORS[s] : colors.textLabel}
                          fontFamily="$body"
                        >
                          {s}
                        </Text>
                      </View>
                    );
                  })}
                </XStack>
              </YStack>

              {/* Module chips */}
              <YStack gap={8}>
                <Text fontSize={12} fontWeight="600" color={colors.textLabel} fontFamily="$body">
                  MÓDULOS
                </Text>
                <XStack flexWrap="wrap" gap={8}>
                  {MODULES.map((m) => (
                    <ModuleChip
                      key={m.id}
                      moduleId={m.id}
                      selected={selectedModules.includes(m.id)}
                      onPress={() => toggleModule(m.id)}
                    />
                  ))}
                </XStack>
              </YStack>

              {/* Clear filters */}
              <View
                height={44}
                borderRadius={12}
                borderWidth={1}
                borderColor={colors.borderSoft}
                alignItems="center"
                justifyContent="center"
                pressStyle={{ opacity: 0.7 }}
                onPress={() => {
                  setSelectedModules([]);
                  setSelectedSeverities([]);
                  setSelectedDateRange(null);
                  setSelectedDay(null);
                  filterSheetRef.current?.close();
                }}
              >
                <Text fontSize={13} fontWeight="600" color={colors.textTer} fontFamily="$body">
                  Limpiar filtros
                </Text>
              </View>
            </YStack>
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
    </PageContainer>
  );
}
