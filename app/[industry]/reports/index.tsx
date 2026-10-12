import { SvgBarChart } from "@/src/components/charts/svg-bar-chart";
import { SvgMultiLineChart } from "@/src/components/charts/svg-multi-line-chart";
import { getIndustryById } from "@/src/data/industries";
import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { useColors } from "@/src/hooks/use-colors";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import {
  Activity,
  ArrowDownUp,
  ArrowUpRight,
  BarChart2,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Factory,
  FileSpreadsheet,
  FileText,
  Filter,
  Flame,
  Layers,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react-native";
import React, { useState } from "react";
import { Alert, ScrollView, TouchableOpacity } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";

type ReportPeriod = "today" | "yesterday" | "7d" | "30d";
type MetricDimension = "production" | "people" | "dwell" | "security";

export default function IndustryReportsScreen() {
  const { industry } = useLocalSearchParams<{ industry: string }>();
  const colors = useColors();
  const { isDesktop } = useBreakpoint();

  const [period, setPeriod] = useState<ReportPeriod>("today");
  const [metricMode, setMetricMode] = useState<MetricDimension>("production");
  const [viewGranularity, setViewGranularity] = useState<"hourly" | "daily" | "shifts">("hourly");
  const [exporting, setExporting] = useState(false);

  const ind = industry ? getIndustryById(industry) : undefined;
  if (!ind) return null;

  const rep = ind.reports;
  const prod = ind.production;
  const ops = ind.operations;
  const people = ind.people;
  const sec = ind.security;

  const multiplier =
    period === "today" ? 1 : period === "yesterday" ? 0.94 : period === "7d" ? 6.8 : 28.5;

  // 1. Hourly comparison dataset (Hoy vs Ayer vs Meta)
  const hourlyProductionData = prod.hourlyProduction.map((h, i) => {
    const yesterday = Math.round(h.produced * (0.86 + (i % 4) * 0.05));
    const variance = h.produced - yesterday;
    const pctChange = yesterday > 0 ? Math.round((variance / yesterday) * 100) : 0;
    return {
      hour: h.hour,
      today: h.produced,
      yesterday,
      target: h.target,
      speed: h.speed || Math.round(h.produced / 0.8),
      variance,
      pctChange,
    };
  });

  const hourlyPeopleData = people.hourlyTraffic.map((h, i) => {
    const yesterday = Math.round(h.inCount * (0.88 + (i % 3) * 0.06));
    const variance = h.inCount - yesterday;
    const pctChange = yesterday > 0 ? Math.round((variance / yesterday) * 100) : 0;
    return {
      hour: h.hour,
      today: h.inCount,
      yesterday,
      out: h.outCount,
      target: Math.round(h.inCount * 1.15),
      speed: Math.round(h.inCount / 0.8),
      variance,
      pctChange,
    };
  });

  // 2. Daily comparison dataset (Lunes a Domingo / 7 días actuales vs 7 días previos)
  const dailyData = people.dayComparison.map((d) => {
    const prevWeek = Math.round(d.count * 0.91);
    const variance = d.count - prevWeek;
    const pctChange = prevWeek > 0 ? Math.round((variance / prevWeek) * 100) : 0;
    return {
      day: d.day,
      count: d.count,
      prevWeek,
      isPeak: d.isPeak,
      variance,
      pctChange,
    };
  });

  const weekdayAvg = Math.round(
    dailyData.filter((_, idx) => idx < 5).reduce((acc, d) => acc + d.count, 0) / 5
  );
  const weekendAvg = Math.round(
    dailyData.filter((_, idx) => idx >= 5).reduce((acc, d) => acc + d.count, 0) /
      Math.max(1, dailyData.length - 5)
  );
  const weekendDiffPct = Math.round(((weekendAvg - weekdayAvg) / weekdayAvg) * 100);

  // Peak and trough calculations
  const activeHourlyList = metricMode === "production" ? hourlyProductionData : hourlyPeopleData;
  const peakItem = [...activeHourlyList].sort((a, b) => b.today - a.today)[0] || {
    hour: "13:00",
    today: 0,
  };
  const troughItem = [...activeHourlyList].sort((a, b) => a.today - b.today)[0] || {
    hour: "16:00",
    today: 0,
  };
  const totalVolume = activeHourlyList.reduce((acc, item) => acc + item.today, 0);
  const avgPerHour = Math.round(totalVolume / Math.max(1, activeHourlyList.length));

  const handleExport = (format: "PDF" | "Excel") => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      Alert.alert(
        "Reporte Generado con Éxito",
        `Se ha exportado el informe consolidado de ${ind.name} en formato ${format} para el período seleccionado (${period.toUpperCase()}).`
      );
    }, 800);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        padding: isDesktop ? 28 : 14,
        paddingBottom: 90,
        gap: 22,
      }}
    >
      {/* ── HEADER & CONTEXT ────────────────────────────────────────── */}
      <YStack gap={10}>
        <XStack justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={12}>
          <YStack gap={4}>
            <XStack alignItems="center" gap={8}>
              <View
                width={36}
                height={36}
                borderRadius={10}
                backgroundColor={ind.accentColor + "20"}
                alignItems="center"
                justifyContent="center"
              >
                <BarChart3 size={20} color={ind.accentColor} />
              </View>
              <YStack>
                <Text
                  fontSize={isDesktop ? 22 : 18}
                  fontWeight="800"
                  color={colors.text}
                  fontFamily="$body"
                >
                  Auditoría Ejecutiva & Reportes: {ind.shortName}
                </Text>
                <Text fontSize={12} color={colors.textSec} fontFamily="$body">
                  {ind.assignedUser.organization} · {ind.assignedUser.role}: {ind.assignedUser.name}
                </Text>
              </YStack>
            </XStack>
          </YStack>

          {/* Export Actions */}
          <XStack alignItems="center" gap={8}>
            <TouchableOpacity
              onPress={() => handleExport("PDF")}
              disabled={exporting}
              style={{
                backgroundColor: "rgba(10, 76, 232, 0.15)",
                borderWidth: 1,
                borderColor: "rgba(33, 152, 244, 0.35)",
                paddingHorizontal: 12,
                paddingVertical: 7,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <FileText size={14} color="#38bdf8" />
              <Text fontSize={11.5} fontWeight="700" color="#38bdf8" fontFamily="$body">
                {exporting ? "Generando..." : "Descargar PDF"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleExport("Excel")}
              disabled={exporting}
              style={{
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                borderWidth: 1,
                borderColor: "rgba(16, 185, 129, 0.35)",
                paddingHorizontal: 12,
                paddingVertical: 7,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <FileSpreadsheet size={14} color="#34d399" />
              <Text fontSize={11.5} fontWeight="700" color="#34d399" fontFamily="$body">
                Excel
              </Text>
            </TouchableOpacity>
          </XStack>
        </XStack>

        {/* ── PERIOD SWITCHER PILLS ─────────────────────────────────── */}
        <XStack
          backgroundColor={colors.card}
          borderRadius={12}
          padding={4}
          borderWidth={1}
          borderColor={colors.borderSoft}
          flexWrap="wrap"
          gap={4}
        >
          {[
            { id: "today", label: "Hoy (Tiempo Real)" },
            { id: "yesterday", label: "Ayer (Consolidado)" },
            { id: "7d", label: "Últimos 7 días" },
            { id: "30d", label: "Últimos 30 días" },
          ].map((p) => {
            const isSel = period === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                onPress={() => setPeriod(p.id as ReportPeriod)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                  borderRadius: 8,
                  backgroundColor: isSel ? ind.accentColor : "transparent",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 110,
                }}
              >
                <Text
                  fontSize={11.5}
                  fontWeight={isSel ? "800" : "600"}
                  color={isSel ? "#ffffff" : colors.textLabel}
                  fontFamily="$body"
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </XStack>
      </YStack>

      {/* ── METRIC DIMENSION SELECTOR TABS ─────────────────────────── */}
      <YStack gap={8}>
        <Text fontSize={11} fontWeight="800" color={colors.textLabel} letterSpacing={1}>
          DIMENSIÓN DE ANÁLISIS
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack gap={8}>
            {[
              {
                id: "production",
                label: `1. Cantidad y Flujo (${prod.unitName})`,
                icon: TrendingUp,
                desc: "Throughput por hora y por día",
              },
              {
                id: "people",
                label: "2. Uso, Afluencia & Aforo",
                icon: Users,
                desc: "Personas, colas y ocupación",
              },
              {
                id: "dwell",
                label: "3. Tiempos de Permanencia & Estaciones",
                icon: Clock,
                desc: "Dwell time y cuellos de botella",
              },
              {
                id: "security",
                label: "4. Seguridad, EPP & Paradas",
                icon: ShieldCheck,
                desc: "Eventos, EPP y continuidad",
              },
            ].map((m) => {
              const isSel = metricMode === m.id;
              const Icon = m.icon;
              return (
                <TouchableOpacity
                  key={m.id}
                  onPress={() => setMetricMode(m.id as MetricDimension)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 10,
                    backgroundColor: isSel ? ind.accentColor + "22" : colors.card,
                    borderWidth: 1.5,
                    borderColor: isSel ? ind.accentColor : colors.borderSoft,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Icon size={16} color={isSel ? ind.accentColor : colors.textLabel} />
                  <YStack>
                    <Text
                      fontSize={12.5}
                      fontWeight={isSel ? "800" : "600"}
                      color={isSel ? ind.accentColor : colors.text}
                      fontFamily="$body"
                    >
                      {m.label}
                    </Text>
                    <Text fontSize={9.5} color={colors.textLabel} fontFamily="$body">
                      {m.desc}
                    </Text>
                  </YStack>
                </TouchableOpacity>
              );
            })}
          </XStack>
        </ScrollView>
      </YStack>

      {/* ── KPI EXECUTIVE SUMMARY CARDS ───────────────────────────── */}
      <XStack flexWrap="wrap" gap={12}>
        {rep.summaryMetrics.map((sm, idx) => {
          const rawVal = parseFloat(sm.value.replace(/[^0-9.]/g, "")) || 0;
          const displayVal =
            period === "today"
              ? sm.value
              : sm.value.includes("%")
                ? sm.value
                : Math.round(rawVal * multiplier).toLocaleString();

          return (
            <View
              key={idx}
              flex={1}
              minWidth={150}
              backgroundColor={colors.card}
              borderRadius={14}
              borderWidth={1}
              borderColor={colors.borderSoft}
              padding={16}
              gap={8}
            >
              <Text fontSize={11} color={colors.textLabel} fontWeight="700">
                {sm.label.toUpperCase()}
              </Text>
              <Text fontSize={24} fontWeight="900" color={colors.text} fontFamily="$mono">
                {displayVal}
              </Text>
              <XStack justifyContent="space-between" alignItems="center">
                <XStack alignItems="center" gap={4}>
                  {sm.positive ? (
                    <ArrowUpRight size={14} color="#34d399" />
                  ) : (
                    <TrendingDown size={14} color="#fbbf24" />
                  )}
                  <Text
                    fontSize={11}
                    fontWeight="800"
                    color={sm.positive ? "#34d399" : "#fbbf24"}
                    fontFamily="$mono"
                  >
                    {sm.change}
                  </Text>
                </XStack>
                <Text fontSize={9.5} color={colors.textLabel}>
                  {period === "today" ? sm.period : `Consolidado ${period}`}
                </Text>
              </XStack>
            </View>
          );
        })}
      </XStack>

      {/* ── GRANULARITY SWITCHER (Por Hora vs Por Día vs Por Turno) ── */}
      <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={10}>
        <XStack alignItems="center" gap={8}>
          <Layers size={16} color={ind.accentColor} />
          <Text fontSize={14} fontWeight="800" color={colors.text} fontFamily="$body">
            Comparativa Temporal & Diagnóstico
          </Text>
        </XStack>

        <XStack
          backgroundColor={colors.card}
          borderRadius={8}
          padding={3}
          borderWidth={1}
          borderColor={colors.borderSoft}
          gap={3}
        >
          {[
            { id: "hourly", label: "Por Hora (08h - 22h)" },
            { id: "daily", label: "Por Día (Semana Completa)" },
            { id: "shifts", label: "Por Turnos de Trabajo" },
          ].map((g) => {
            const isSel = viewGranularity === g.id;
            return (
              <TouchableOpacity
                key={g.id}
                onPress={() => setViewGranularity(g.id as any)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 5,
                  borderRadius: 6,
                  backgroundColor: isSel ? "rgba(56, 189, 248, 0.2)" : "transparent",
                }}
              >
                <Text
                  fontSize={11}
                  fontWeight={isSel ? "800" : "500"}
                  color={isSel ? "#38bdf8" : colors.textLabel}
                  fontFamily="$body"
                >
                  {g.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </XStack>
      </XStack>

      {/* ── SECTION 1: COMPARATIVA HORA POR HORA ────────────────────── */}
      {viewGranularity === "hourly" && (
        <YStack gap={16}>
          {/* Hourly Multi-Line Comparison Chart Card */}
          <View
            backgroundColor={colors.card}
            borderRadius={16}
            borderWidth={1}
            borderColor={colors.borderSoft}
            padding={18}
            gap={14}
          >
            <XStack justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={10}>
              <YStack gap={3}>
                <Text fontSize={15} fontWeight="800" color={colors.text} fontFamily="$body">
                  {metricMode === "production"
                    ? `Cantidad Producida / Despachada por Hora (${prod.unitName})`
                    : `Afluencia y Tránsito de Personas por Hora`}
                </Text>
                <Text fontSize={11} color={colors.textSec} fontFamily="$body">
                  Comparativa de rendimiento en tiempo real: Hoy vs Ayer vs Meta horaria
                </Text>
              </YStack>

              {/* Legend */}
              <XStack gap={14} alignItems="center" flexWrap="wrap">
                <XStack alignItems="center" gap={6}>
                  <View width={10} height={10} borderRadius={5} backgroundColor="#38bdf8" />
                  <Text fontSize={11} fontWeight="700" color={colors.text} fontFamily="$body">
                    Hoy / Actual
                  </Text>
                </XStack>
                <XStack alignItems="center" gap={6}>
                  <View width={10} height={10} borderRadius={5} backgroundColor="#f59e0b" />
                  <Text fontSize={11} fontWeight="700" color={colors.textSec} fontFamily="$body">
                    Ayer
                  </Text>
                </XStack>
                <XStack alignItems="center" gap={6}>
                  <View width={10} height={10} borderRadius={5} backgroundColor="#10b981" />
                  <Text fontSize={11} fontWeight="700" color={colors.textSec} fontFamily="$body">
                    Meta Objetivo
                  </Text>
                </XStack>
              </XStack>
            </XStack>

            {/* SvgMultiLineChart */}
            <SvgMultiLineChart
              data={activeHourlyList}
              xKey="hour"
              lines={[
                { yKey: "today", color: "#38bdf8", label: "Hoy" },
                { yKey: "yesterday", color: "#f59e0b", label: "Ayer" },
                { yKey: "target", color: "#10b981", label: "Meta" },
              ]}
              height={190}
              labelColor={colors.textLabel}
              gridColor={colors.borderSoft}
            />

            {/* Metric Summary Bar below Chart */}
            <XStack
              backgroundColor={colors.bg}
              borderRadius={10}
              padding={12}
              borderWidth={1}
              borderColor={colors.borderSoft}
              justifyContent="space-around"
              alignItems="center"
              flexWrap="wrap"
              gap={10}
            >
              <YStack alignItems="center" gap={2}>
                <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
                  HORA PICO (MÁXIMO)
                </Text>
                <Text fontSize={14} fontWeight="800" color="#38bdf8" fontFamily="$mono">
                  {peakItem.hour} ({peakItem.today} uds)
                </Text>
              </YStack>
              <View width={1} height={24} backgroundColor={colors.borderSoft} />
              <YStack alignItems="center" gap={2}>
                <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
                  PROMEDIO POR HORA
                </Text>
                <Text fontSize={14} fontWeight="800" color={colors.text} fontFamily="$mono">
                  {avgPerHour} uds / hora
                </Text>
              </YStack>
              <View width={1} height={24} backgroundColor={colors.borderSoft} />
              <YStack alignItems="center" gap={2}>
                <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
                  HORA VALLE (MÍNIMO)
                </Text>
                <Text fontSize={14} fontWeight="800" color="#fbbf24" fontFamily="$mono">
                  {troughItem.hour} ({troughItem.today} uds)
                </Text>
              </YStack>
              <View width={1} height={24} backgroundColor={colors.borderSoft} />
              <YStack alignItems="center" gap={2}>
                <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
                  VOLUMEN TOTAL ACUMULADO
                </Text>
                <Text fontSize={14} fontWeight="800" color="#34d399" fontFamily="$mono">
                  {totalVolume.toLocaleString()} unidades
                </Text>
              </YStack>
            </XStack>
          </View>

          {/* Detailed Hourly Audit Table */}
          <View
            backgroundColor={colors.card}
            borderRadius={16}
            borderWidth={1}
            borderColor={colors.borderSoft}
            padding={18}
            gap={12}
          >
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize={14} fontWeight="800" color={colors.text} fontFamily="$body">
                Tabla Comparativa Hora por Hora
              </Text>
              <Text fontSize={11} color={colors.textLabel} fontFamily="$mono">
                {activeHourlyList.length} intervalos registrados
              </Text>
            </XStack>

            <YStack gap={6}>
              {activeHourlyList.map((row) => {
                const targetVal = row.target || 1;
                const pctOfTarget = Math.round((row.today / targetVal) * 100);
                const isPositive = row.variance >= 0;

                return (
                  <View
                    key={row.hour}
                    backgroundColor={colors.bg}
                    borderRadius={8}
                    padding={10}
                    borderWidth={1}
                    borderColor={colors.borderSoft}
                  >
                    <XStack justifyContent="space-between" alignItems="center">
                      {/* Hour & Performance Badge */}
                      <XStack alignItems="center" gap={8} width={130}>
                        <Clock size={13} color={colors.textLabel} />
                        <Text fontSize={12} fontWeight="800" color={colors.text} fontFamily="$mono">
                          {row.hour}
                        </Text>
                        <View
                          backgroundColor={
                            pctOfTarget >= 100
                              ? "rgba(16, 185, 129, 0.15)"
                              : pctOfTarget >= 85
                                ? "rgba(56, 189, 248, 0.15)"
                                : "rgba(245, 158, 11, 0.15)"
                          }
                          paddingHorizontal={6}
                          paddingVertical={2}
                          borderRadius={4}
                        >
                          <Text
                            fontSize={9}
                            fontWeight="800"
                            color={
                              pctOfTarget >= 100
                                ? "#34d399"
                                : pctOfTarget >= 85
                                  ? "#38bdf8"
                                  : "#fbbf24"
                            }
                            fontFamily="$mono"
                          >
                            {pctOfTarget}% META
                          </Text>
                        </View>
                      </XStack>

                      {/* Today vs Yesterday */}
                      <XStack alignItems="center" gap={16}>
                        <YStack alignItems="flex-end">
                          <Text
                            fontSize={12}
                            fontWeight="800"
                            color={colors.text}
                            fontFamily="$mono"
                          >
                            {row.today} uds
                          </Text>
                          <Text fontSize={9.5} color={colors.textLabel}>
                            Ayer: {row.yesterday} uds
                          </Text>
                        </YStack>

                        {/* Delta */}
                        <View width={75} alignItems="flex-end">
                          <Text
                            fontSize={11.5}
                            fontWeight="800"
                            color={isPositive ? "#34d399" : "#fbbf24"}
                            fontFamily="$mono"
                          >
                            {isPositive ? `+${row.variance}` : row.variance} ({row.pctChange}%)
                          </Text>
                          <Text fontSize={9} color={colors.textLabel}>
                            vs anterior
                          </Text>
                        </View>
                      </XStack>
                    </XStack>
                  </View>
                );
              })}
            </YStack>
          </View>
        </YStack>
      )}

      {/* ── SECTION 2: COMPARATIVA DÍA POR DÍA ─────────────────────── */}
      {viewGranularity === "daily" && (
        <YStack gap={16}>
          {/* Daily Bar Chart Card */}
          <View
            backgroundColor={colors.card}
            borderRadius={16}
            borderWidth={1}
            borderColor={colors.borderSoft}
            padding={18}
            gap={14}
          >
            <XStack justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={10}>
              <YStack gap={3}>
                <Text fontSize={15} fontWeight="800" color={colors.text} fontFamily="$body">
                  Evolución y Cantidad Diaria (Lunes a Domingo)
                </Text>
                <Text fontSize={11} color={colors.textSec} fontFamily="$body">
                  Distribución acumulada por jornada de la semana vs misma jornada semana previa
                </Text>
              </YStack>
            </XStack>

            <SvgBarChart
              data={dailyData.map((d) => ({
                day: d.day,
                count: d.count,
              }))}
              xKey="day"
              yKey="count"
              color={ind.accentColor}
              height={180}
              labelColor={colors.textLabel}
              gridColor={colors.borderSoft}
            />

            {/* Weekday vs Weekend Comparison Highlight */}
            <View
              backgroundColor={colors.bg}
              borderRadius={12}
              borderWidth={1}
              borderColor={colors.borderSoft}
              padding={14}
              gap={10}
            >
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize={12} fontWeight="800" color={colors.text} fontFamily="$body">
                  Diagnóstico: Días de Semana vs Fin de Semana
                </Text>
                <View
                  backgroundColor={
                    weekendDiffPct >= 0 ? "rgba(16, 185, 129, 0.15)" : "rgba(56, 189, 248, 0.15)"
                  }
                  paddingHorizontal={8}
                  paddingVertical={3}
                  borderRadius={5}
                >
                  <Text
                    fontSize={10}
                    fontWeight="800"
                    color={weekendDiffPct >= 0 ? "#34d399" : "#38bdf8"}
                    fontFamily="$mono"
                  >
                    {weekendDiffPct >= 0
                      ? `+${weekendDiffPct}% en fin de semana`
                      : `${weekendDiffPct}% en fin de semana`}
                  </Text>
                </View>
              </XStack>

              <XStack justifyContent="space-around" alignItems="center" gap={10}>
                <YStack alignItems="center" gap={2}>
                  <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
                    PROMEDIO LUNES - VIERNES
                  </Text>
                  <Text fontSize={16} fontWeight="900" color={colors.text} fontFamily="$mono">
                    {weekdayAvg.toLocaleString()} uds / día
                  </Text>
                </YStack>
                <View width={1} height={28} backgroundColor={colors.borderSoft} />
                <YStack alignItems="center" gap={2}>
                  <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
                    PROMEDIO SÁBADO - DOMINGO
                  </Text>
                  <Text fontSize={16} fontWeight="900" color={ind.accentColor} fontFamily="$mono">
                    {weekendAvg.toLocaleString()} uds / día
                  </Text>
                </YStack>
              </XStack>
            </View>
          </View>

          {/* Daily Breakdown Table */}
          <View
            backgroundColor={colors.card}
            borderRadius={16}
            borderWidth={1}
            borderColor={colors.borderSoft}
            padding={18}
            gap={12}
          >
            <Text fontSize={14} fontWeight="800" color={colors.text} fontFamily="$body">
              Desglose Detallado por Jornada
            </Text>

            <YStack gap={6}>
              {dailyData.map((d) => (
                <XStack
                  key={d.day}
                  backgroundColor={colors.bg}
                  borderRadius={8}
                  padding={12}
                  borderWidth={1}
                  borderColor={colors.borderSoft}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <XStack alignItems="center" gap={8}>
                    <Text fontSize={13} fontWeight="800" color={colors.text} width={40}>
                      {d.day}
                    </Text>
                    {d.isPeak && (
                      <View
                        backgroundColor="rgba(245, 158, 11, 0.15)"
                        paddingHorizontal={6}
                        paddingVertical={2}
                        borderRadius={4}
                      >
                        <Text fontSize={9} fontWeight="800" color="#fbbf24">
                          JORNADA PICO
                        </Text>
                      </View>
                    )}
                  </XStack>

                  <XStack alignItems="center" gap={16}>
                    <YStack alignItems="flex-end">
                      <Text fontSize={13} fontWeight="800" color={colors.text} fontFamily="$mono">
                        {d.count.toLocaleString()} uds
                      </Text>
                      <Text fontSize={9.5} color={colors.textLabel}>
                        Semana previa: {d.prevWeek.toLocaleString()} uds
                      </Text>
                    </YStack>
                    <View width={65} alignItems="flex-end">
                      <Text
                        fontSize={11.5}
                        fontWeight="800"
                        color={d.variance >= 0 ? "#34d399" : "#fbbf24"}
                        fontFamily="$mono"
                      >
                        {d.variance >= 0 ? `+${d.pctChange}%` : `${d.pctChange}%`}
                      </Text>
                    </View>
                  </XStack>
                </XStack>
              ))}
            </YStack>
          </View>
        </YStack>
      )}

      {/* ── SECTION 3: COMPARATIVA POR TURNOS DE TRABAJO ────────────── */}
      {viewGranularity === "shifts" && (
        <YStack gap={16}>
          <View
            backgroundColor={colors.card}
            borderRadius={16}
            borderWidth={1}
            borderColor={colors.borderSoft}
            padding={18}
            gap={14}
          >
            <Text fontSize={15} fontWeight="800" color={colors.text} fontFamily="$body">
              Comparativa de Rendimiento por Turno de Operación
            </Text>

            <YStack gap={10}>
              {ops.shiftsComparison.map((sh) => (
                <View
                  key={sh.shift}
                  backgroundColor={colors.bg}
                  borderRadius={12}
                  padding={14}
                  borderWidth={1}
                  borderColor={colors.borderSoft}
                  gap={8}
                >
                  <XStack justifyContent="space-between" alignItems="center">
                    <XStack alignItems="center" gap={8}>
                      <Clock size={15} color={ind.accentColor} />
                      <Text fontSize={13} fontWeight="800" color={colors.text} fontFamily="$body">
                        {sh.shift}
                      </Text>
                    </XStack>
                    <View
                      backgroundColor="rgba(56, 189, 248, 0.15)"
                      paddingHorizontal={8}
                      paddingVertical={3}
                      borderRadius={5}
                    >
                      <Text fontSize={10} fontWeight="800" color="#38bdf8" fontFamily="$mono">
                        {sh.hours}
                      </Text>
                    </View>
                  </XStack>

                  <XStack justifyContent="space-between" alignItems="center">
                    <YStack gap={2}>
                      <Text fontSize={10} color={colors.textLabel}>
                        UNIDADES PROCESADAS
                      </Text>
                      <Text fontSize={15} fontWeight="800" color={colors.text} fontFamily="$mono">
                        {Math.round(sh.unitsProcessed * multiplier).toLocaleString()} uds
                      </Text>
                    </YStack>
                    <YStack gap={2} alignItems="center">
                      <Text fontSize={10} color={colors.textLabel}>
                        EFICIENCIA OBSERVADA
                      </Text>
                      <Text fontSize={15} fontWeight="800" color="#34d399" fontFamily="$mono">
                        {sh.efficiencyPercent}%
                      </Text>
                    </YStack>
                    <YStack gap={2} alignItems="flex-end">
                      <Text fontSize={10} color={colors.textLabel}>
                        TIEMPO DE INACTIVIDAD
                      </Text>
                      <Text fontSize={15} fontWeight="800" color="#fbbf24" fontFamily="$mono">
                        {sh.downtimeMinutes} min
                      </Text>
                    </YStack>
                  </XStack>
                </View>
              ))}
            </YStack>
          </View>
        </YStack>
      )}

      {/* ── SECTION 4: DESGLOSE POR CATEGORÍA O ESTACIÓN ────────────── */}
      <View
        backgroundColor={colors.card}
        borderRadius={16}
        borderWidth={1}
        borderColor={colors.borderSoft}
        padding={18}
        gap={14}
      >
        <Text fontSize={15} fontWeight="800" color={colors.text} fontFamily="$body">
          Distribución de Volumen por Categoría ({period.toUpperCase()})
        </Text>

        <YStack gap={10}>
          {prod.categoryBreakdown.map((cat) => {
            const scaledCount = Math.round(cat.count * multiplier);
            return (
              <View key={cat.name} gap={4}>
                <XStack justifyContent="space-between" alignItems="center">
                  <XStack alignItems="center" gap={6}>
                    <View width={8} height={8} borderRadius={4} backgroundColor={cat.color} />
                    <Text fontSize={12} fontWeight="700" color={colors.text} fontFamily="$body">
                      {cat.name}
                    </Text>
                  </XStack>
                  <Text fontSize={12} fontWeight="800" color={cat.color} fontFamily="$mono">
                    {scaledCount.toLocaleString()} {cat.unit} ({cat.percentage}%)
                  </Text>
                </XStack>
                {/* Progress bar */}
                <View
                  height={6}
                  backgroundColor={colors.bg}
                  borderRadius={3}
                  overflow="hidden"
                  borderWidth={1}
                  borderColor={colors.borderSoft}
                >
                  <View
                    height={6}
                    width={`${Math.min(cat.percentage, 100)}%` as any}
                    backgroundColor={cat.color}
                    borderRadius={3}
                  />
                </View>
              </View>
            );
          })}
        </YStack>
      </View>

      {/* ── SECTION 5: TABLA EJECUTIVA DE METAS Y SLAs ──────────────── */}
      <View
        backgroundColor={colors.card}
        borderRadius={16}
        borderWidth={1}
        borderColor={colors.borderSoft}
        padding={18}
        gap={12}
      >
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize={15} fontWeight="800" color={colors.text} fontFamily="$body">
            Tabla Ejecutiva de Cumplimiento de Metas & SLAs
          </Text>
          <View
            backgroundColor="rgba(16, 185, 129, 0.15)"
            paddingHorizontal={8}
            paddingVertical={3}
            borderRadius={5}
          >
            <Text fontSize={10} fontWeight="800" color="#34d399" fontFamily="$mono">
              CONTRATO SLA
            </Text>
          </View>
        </XStack>

        <YStack gap={8}>
          {rep.executiveTable.map((row, idx) => (
            <View
              key={idx}
              backgroundColor={colors.bg}
              borderRadius={10}
              padding={12}
              borderWidth={1}
              borderColor={colors.borderSoft}
              gap={6}
            >
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize={12.5} fontWeight="700" color={colors.text} flex={1}>
                  {row.indicator}
                </Text>
                <View
                  backgroundColor={
                    row.status === "Óptimo"
                      ? "rgba(16, 185, 129, 0.15)"
                      : "rgba(245, 158, 11, 0.15)"
                  }
                  paddingHorizontal={8}
                  paddingVertical={2}
                  borderRadius={4}
                >
                  <Text
                    fontSize={10}
                    fontWeight="800"
                    color={row.status === "Óptimo" ? "#34d399" : "#fbbf24"}
                  >
                    {row.status}
                  </Text>
                </View>
              </XStack>

              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize={11} color={colors.textSec} fontFamily="$body">
                  Observado:{" "}
                  <Text fontWeight="700" color={colors.text}>
                    {row.today}
                  </Text>{" "}
                  · Meta programada:{" "}
                  <Text fontWeight="700" color={colors.textSec}>
                    {row.target}
                  </Text>
                </Text>
                <Text fontSize={11.5} fontWeight="800" color="#38bdf8" fontFamily="$mono">
                  Varianza: {row.variance}
                </Text>
              </XStack>
            </View>
          ))}
        </YStack>
      </View>
    </ScrollView>
  );
}
