import BottomSheet, { BottomSheetScrollView } from "@/src/components/bottom-sheet";
import { EventItemCard } from "@/src/components/event-item-card";
import { InsightCard } from "@/src/components/insight-card";
import { ModuleChip } from "@/src/components/module-chip";
import { OwlState } from "@/src/components/owl-state";
import { PageContainer } from "@/src/components/page-container";
import type { EventItem, HourRange, ModuleId, Severity } from "@/src/data/mock";
import { EVENTS, HOUR_RANGES, INSIGHTS, MODULES, groupEventsByDate } from "@/src/data/mock";
import { useColors } from "@/src/hooks/use-colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { Bell, Filter, Sparkles, X } from "lucide-react-native";
import { useCallback, useRef, useState } from "react";
import { Platform, ScrollView, SectionList, Switch } from "react-native";
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

export default function AlertsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const filterSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["70%", "92%"];

  const [activeView, setActiveView] = useState<ActiveView>("alerts");
  const [selectedModules, setSelectedModules] = useState<ModuleId[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<Severity[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | null>(null);
  const [selectedHourRange, setSelectedHourRange] = useState<HourRange | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [compareRange, setCompareRange] = useState(false);
  const [compareStart, setCompareStart] = useState<Date | null>(null);
  const [compareEnd, setCompareEnd] = useState<Date | null>(null);
  const [showDatePickerFor, setShowDatePickerFor] = useState<
    "single" | "start" | "end" | "compareStart" | "compareEnd" | null
  >(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showTimePickerFor, setShowTimePickerFor] = useState<"start" | "end" | null>(null);

  const filtered = filterEvents(
    EVENTS,
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
        {/* Header */}
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
            <Text fontSize={22} fontWeight="700" color={colors.text} fontFamily="$body">
              Notificaciones
            </Text>
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
                  const mod = MODULES.find((x) => x.id === m)!;
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
                {selectedHourRange && selectedHourRange !== "all" && (
                  <XStack
                    paddingHorizontal={10}
                    paddingVertical={4}
                    borderRadius={100}
                    backgroundColor="rgba(59,130,246,0.15)"
                    borderWidth={1}
                    borderColor="rgba(59,130,246,0.3)"
                    alignItems="center"
                    gap={6}
                    pressStyle={{ opacity: 0.7 }}
                    onPress={() => setSelectedHourRange(null)}
                  >
                    <Text fontSize={11} color="#3b82f6" fontFamily="$body" fontWeight="600">
                      {HOUR_RANGES[selectedHourRange].label}
                    </Text>
                    <X size={10} color="#3b82f6" />
                  </XStack>
                )}
                {startTime && endTime && (
                  <XStack
                    paddingHorizontal={10}
                    paddingVertical={4}
                    borderRadius={100}
                    backgroundColor="rgba(59,130,246,0.15)"
                    borderWidth={1}
                    borderColor="rgba(59,130,246,0.3)"
                    alignItems="center"
                    gap={6}
                    pressStyle={{ opacity: 0.7 }}
                    onPress={() => {
                      setStartTime(null);
                      setEndTime(null);
                    }}
                  >
                    <Text fontSize={11} color="#3b82f6" fontFamily="$body" fontWeight="600">
                      {startTime.toLocaleTimeString("es-BO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {endTime.toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" })}
                    </Text>
                    <X size={10} color="#3b82f6" />
                  </XStack>
                )}
              </XStack>
            </ScrollView>
          )}
        </YStack>

        {/* ── INSIGHTS VIEW ── */}
        {activeView === "insights" && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16, paddingBottom: 100, gap: 10 }}
          >
            <YStack gap={8} marginBottom={4}>
              <Text
                fontSize={11}
                fontWeight="700"
                color={colors.textLabel}
                fontFamily="$body"
                letterSpacing={1.2}
              >
                INSIGHTS OPERATIVOS
              </Text>
              <Text fontSize={12} color={colors.textTer} fontFamily="$body">
                Análisis automático basado en la actividad reciente
              </Text>
            </YStack>
            {INSIGHTS.map((ins) => (
              <InsightCard key={ins.id} insight={ins} />
            ))}

            <View
              backgroundColor="rgba(167,139,250,0.08)"
              borderRadius={12}
              borderWidth={1}
              borderColor="rgba(167,139,250,0.2)"
              padding={14}
              marginTop={4}
              pressStyle={{ opacity: 0.8 }}
              onPress={() => setActiveView("alerts")}
            >
              <XStack alignItems="center" gap={10}>
                <Bell size={16} color="#a78bfa" />
                <YStack flex={1}>
                  <Text fontSize={13} fontWeight="600" color={colors.text} fontFamily="$body">
                    Ver todas las alertas
                  </Text>
                  <Text fontSize={11} color={colors.textTer} fontFamily="$body">
                    {EVENTS.length} eventos registrados en total
                  </Text>
                </YStack>
                <Text fontSize={18} color={colors.textLabel}>
                  ›
                </Text>
              </XStack>
            </View>
          </ScrollView>
        )}

        {/* ── ALERTS VIEW ── */}
        {activeView === "alerts" && filtered.length === 0 ? (
          <YStack flex={1} alignItems="center" justifyContent="center" gap={16}>
            <OwlState variant="empty" size="large" floating={false} />
            <Text fontSize={15} color={colors.textLabel} fontFamily="$body" textAlign="center">
              Sin eventos para este filtro
            </Text>
          </YStack>
        ) : (
          activeView === "alerts" && (
            <SectionList
              sections={grouped.map((g) => ({ title: g.label, data: g.data }))}
              keyExtractor={(item) => item.id}
              renderSectionHeader={({ section }) => (
                <XStack paddingHorizontal={20} paddingVertical={8} backgroundColor={colors.bg}>
                  <Text
                    fontSize={12}
                    fontWeight="700"
                    color={colors.textLabel}
                    fontFamily="$body"
                    letterSpacing={0.5}
                  >
                    {section.title.toUpperCase()}
                  </Text>
                </XStack>
              )}
              renderItem={({ item, index, section }) => (
                <View paddingHorizontal={16}>
                  <View
                    backgroundColor={colors.card}
                    borderRadius={index === 0 ? 12 : 0}
                    borderTopLeftRadius={index === 0 ? 12 : 0}
                    borderTopRightRadius={index === 0 ? 12 : 0}
                    borderBottomLeftRadius={index === section.data.length - 1 ? 12 : 0}
                    borderBottomRightRadius={index === section.data.length - 1 ? 12 : 0}
                    overflow="hidden"
                    borderWidth={0}
                  >
                    {index > 0 && (
                      <View height={1} backgroundColor={colors.borderSoft} marginHorizontal={12} />
                    )}
                    <EventItemCard
                      event={item}
                      onPress={() => router.push(`/(tabs)/alerts/${item.id}`)}
                    />
                  </View>
                </View>
              )}
              stickySectionHeadersEnabled
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          )
        )}

        {/* Filter Bottom Sheet */}
        <BottomSheet
          ref={filterSheetRef}
          snapPoints={snapPoints}
          index={-1}
          enablePanDownToClose
          backgroundStyle={{ backgroundColor: colors.card }}
          handleIndicatorStyle={{ backgroundColor: colors.border }}
        >
          <BottomSheetScrollView
            contentContainerStyle={{ paddingBottom: 40 }}
            style={{ backgroundColor: colors.card }}
          >
            <YStack padding={20} gap={24}>
              <Text fontSize={16} fontWeight="700" color={colors.text} fontFamily="$body">
                Filtros
              </Text>

              {/* Module filter */}
              <YStack gap={12}>
                <Text
                  fontSize={11}
                  fontWeight="700"
                  color={colors.textLabel}
                  fontFamily="$body"
                  letterSpacing={1.2}
                >
                  MÓDULO
                </Text>
                <XStack flexWrap="wrap" gap={8}>
                  {MODULES.map((mod) => (
                    <ModuleChip
                      key={mod.id}
                      moduleId={mod.id as ModuleId}
                      selected={selectedModules.includes(mod.id as ModuleId)}
                      onPress={() => toggleModule(mod.id as ModuleId)}
                    />
                  ))}
                </XStack>
              </YStack>

              {/* Severity filter */}
              <YStack gap={12}>
                <Text
                  fontSize={11}
                  fontWeight="700"
                  color={colors.textLabel}
                  fontFamily="$body"
                  letterSpacing={1.2}
                >
                  SEVERIDAD
                </Text>
                <XStack gap={8}>
                  {SEVERITIES.map((s) => {
                    const isSelected = selectedSeverities.includes(s);
                    const color = SEVERITY_COLORS[s];
                    return (
                      <View
                        key={s}
                        paddingHorizontal={14}
                        paddingVertical={7}
                        borderRadius={100}
                        backgroundColor={isSelected ? color + "22" : colors.cardAlt}
                        borderWidth={1}
                        borderColor={isSelected ? color + "66" : colors.border}
                        pressStyle={{ opacity: 0.7 }}
                        onPress={() => toggleSeverity(s)}
                      >
                        <Text
                          fontSize={12}
                          fontWeight="700"
                          fontFamily="$body"
                          color={isSelected ? color : colors.textLabel}
                        >
                          {s}
                        </Text>
                      </View>
                    );
                  })}
                </XStack>
              </YStack>

              {/* Time range filter */}
              <YStack gap={12}>
                <Text
                  fontSize={11}
                  fontWeight="700"
                  color={colors.textLabel}
                  fontFamily="$body"
                  letterSpacing={1.2}
                >
                  RANGO DE HORA
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
                    onPress={() => setShowTimePickerFor("start")}
                  >
                    <Text fontSize={11} color={colors.text} fontFamily="$body">
                      Hora inicio
                    </Text>
                    <Text fontSize={12} fontWeight="700" color="#3b82f6" fontFamily="$mono">
                      {startTime
                        ? startTime.toLocaleTimeString("es-BO", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Seleccionar"}
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
                    onPress={() => setShowTimePickerFor("end")}
                  >
                    <Text fontSize={11} color={colors.text} fontFamily="$body">
                      Hora fin
                    </Text>
                    <Text fontSize={12} fontWeight="700" color="#3b82f6" fontFamily="$mono">
                      {endTime
                        ? endTime.toLocaleTimeString("es-BO", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Seleccionar"}
                    </Text>
                  </View>
                </XStack>
              </YStack>

              {/* Custom date/range filter */}
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
                <YStack gap={8}>
                  {DATE_RANGES.map((range) => {
                    const isSelected = selectedDateRange === range;
                    return (
                      <XStack
                        key={range}
                        backgroundColor={isSelected ? "rgba(59,130,246,0.1)" : colors.cardAlt}
                        borderRadius={10}
                        borderWidth={1}
                        borderColor={isSelected ? "#3b82f6" : colors.border}
                        padding={12}
                        alignItems="center"
                        justifyContent="space-between"
                        pressStyle={{ opacity: 0.7 }}
                        onPress={() => {
                          setSelectedDateRange(isSelected ? null : range);
                          setSelectedDay(null);
                          setRangeStart(null);
                          setRangeEnd(null);
                        }}
                      >
                        <Text
                          fontSize={13}
                          fontFamily="$body"
                          color={isSelected ? "#3b82f6" : colors.textTer}
                          fontWeight={isSelected ? "600" : "400"}
                        >
                          {range}
                        </Text>
                        {isSelected && (
                          <View width={16} height={16} borderRadius={8} backgroundColor="#3b82f6" />
                        )}
                      </XStack>
                    );
                  })}

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
                        setShowDatePickerFor("single");
                        setSelectedDateRange(null);
                      }}
                    >
                      <Text fontSize={11} color={colors.text} fontFamily="$body">
                        Día específico
                      </Text>
                      <Text fontSize={12} fontWeight="700" color="#3b82f6" fontFamily="$mono">
                        {selectedDay ? selectedDay.toLocaleDateString("es-BO") : "Seleccionar"}
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
                        setSelectedDateRange(null);
                      }}
                    >
                      <Text fontSize={11} color={colors.text} fontFamily="$body">
                        Rango inicio
                      </Text>
                      <Text fontSize={12} fontWeight="700" color="#3b82f6" fontFamily="$mono">
                        {rangeStart ? rangeStart.toLocaleDateString("es-BO") : "Inicio"}
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
                        setSelectedDateRange(null);
                      }}
                    >
                      <Text fontSize={11} color={colors.text} fontFamily="$body">
                        Rango fin
                      </Text>
                      <Text fontSize={12} fontWeight="700" color="#3b82f6" fontFamily="$mono">
                        {rangeEnd ? rangeEnd.toLocaleDateString("es-BO") : "Fin"}
                      </Text>
                    </View>
                  </XStack>

                  <XStack alignItems="center" gap={8}>
                    <Text fontSize={12} color={colors.textLabel} fontFamily="$body">
                      Comparar con segundo rango
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
                    <XStack gap={8}>
                      <View
                        paddingHorizontal={12}
                        paddingVertical={8}
                        borderRadius={12}
                        borderWidth={1}
                        borderColor={colors.borderSoft}
                        backgroundColor={colors.cardAlt}
                        pressStyle={{ opacity: 0.7 }}
                        onPress={() => setShowDatePickerFor("compareStart")}
                      >
                        <Text fontSize={11} color={colors.text} fontFamily="$body">
                          Comparar inicio
                        </Text>
                        <Text fontSize={12} fontWeight="700" color="#3b82f6" fontFamily="$mono">
                          {compareStart ? compareStart.toLocaleDateString("es-BO") : "Inicio"}
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
                        onPress={() => setShowDatePickerFor("compareEnd")}
                      >
                        <Text fontSize={11} color={colors.text} fontFamily="$body">
                          Comparar fin
                        </Text>
                        <Text fontSize={12} fontWeight="700" color="#3b82f6" fontFamily="$mono">
                          {compareEnd ? compareEnd.toLocaleDateString("es-BO") : "Fin"}
                        </Text>
                      </View>
                    </XStack>
                  )}
                </YStack>
              </YStack>

              {showDatePickerFor && Platform.OS === "web" ? (
                <View paddingHorizontal={20} marginBottom={12}>
                  <input
                    type="date"
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 10,
                      border: "1px solid #ccc",
                    }}
                    onChange={(e) => {
                      const value = new Date(e.target.value);
                      if (showDatePickerFor === "single") setSelectedDay(value);
                      if (showDatePickerFor === "start") setRangeStart(value);
                      if (showDatePickerFor === "end") setRangeEnd(value);
                      if (showDatePickerFor === "compareStart") setCompareStart(value);
                      if (showDatePickerFor === "compareEnd") setCompareEnd(value);
                      setShowDatePickerFor(null);
                    }}
                  />
                </View>
              ) : showDatePickerFor ? (
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
                    if (value) {
                      if (showDatePickerFor === "single") setSelectedDay(value);
                      if (showDatePickerFor === "start") setRangeStart(value);
                      if (showDatePickerFor === "end") setRangeEnd(value);
                      if (showDatePickerFor === "compareStart") setCompareStart(value);
                      if (showDatePickerFor === "compareEnd") setCompareEnd(value);
                    }
                    setShowDatePickerFor(null);
                  }}
                />
              ) : null}

              {/* Time Picker */}
              {showTimePickerFor ? (
                <DateTimePicker
                  value={
                    showTimePickerFor === "start"
                      ? (startTime ?? new Date())
                      : showTimePickerFor === "end"
                        ? (endTime ?? new Date())
                        : new Date()
                  }
                  mode="time"
                  display="default"
                  onChange={(event, value) => {
                    if (value) {
                      if (showTimePickerFor === "start") setStartTime(value);
                      if (showTimePickerFor === "end") setEndTime(value);
                    }
                    setShowTimePickerFor(null);
                  }}
                />
              ) : null}

              {/* Clear button */}
              {hasFilters && (
                <View
                  height={44}
                  borderRadius={12}
                  borderWidth={1}
                  borderColor={colors.border}
                  alignItems="center"
                  justifyContent="center"
                  pressStyle={{ opacity: 0.7 }}
                  onPress={() => {
                    setSelectedModules([]);
                    setSelectedSeverities([]);
                    setSelectedDateRange(null);
                    setSelectedHourRange(null);
                    filterSheetRef.current?.close();
                  }}
                >
                  <Text fontSize={13} fontWeight="600" color={colors.textTer} fontFamily="$body">
                    Limpiar filtros
                  </Text>
                </View>
              )}
            </YStack>
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
    </PageContainer>
  );
}
