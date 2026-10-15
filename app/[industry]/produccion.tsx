import { SvgBarChart } from "@/src/components/charts/svg-bar-chart";
import { SvgMultiLineChart } from "@/src/components/charts/svg-multi-line-chart";
import { getIndustryById } from "@/src/data/industries";
import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { useColors } from "@/src/hooks/use-colors";
import { useLocalSearchParams } from "expo-router";
import {
    TrendingUp
} from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";

export default function IndustryProductionScreen() {
  const { industry } = useLocalSearchParams<{ industry: string }>();
  const colors = useColors();
  const { isDesktop } = useBreakpoint();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [prodChartMode, setProdChartMode] = useState<"multiline" | "bar">("multiline");

  const ind = industry ? getIndustryById(industry) : undefined;
  if (!ind) return null;

  const prod = ind.production;
  const totalProduced = prod.totalProduced;
  const target = prod.productionTarget;
  const pct = Math.round((totalProduced / target) * 100);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        padding: isDesktop ? 28 : 14,
        paddingBottom: 90,
        gap: 20,
      }}
    >
      {/* HEADER EXPLANATION */}
      <YStack gap={6}>
        <XStack alignItems="center" gap={8}>
          <TrendingUp size={20} color={ind.accentColor} />
          <Text fontSize={20} fontWeight="800" color={colors.text} fontFamily="$body">
            VERTICAL A: PRODUCCIÓN & FLUJO DE UNIDADES
          </Text>
        </XStack>
        <Text fontSize={12.5} color={colors.textSec} fontFamily="$body" lineHeight={18}>
          Supervisión visual en zonas observables adaptada a {ind.name}. Monitorea el volumen de{" "}
          {prod.unitName.toLowerCase()}, ritmo por intervalo y posibles acumulaciones sin requerir
          balanzas ni integración manual de datos.
        </Text>
      </YStack>

      {/* TOP KPI SUMMARY */}
      <XStack flexWrap="wrap" gap={12}>
        <View
          flex={1}
          minWidth={160}
          backgroundColor={colors.card}
          borderRadius={12}
          borderWidth={1}
          borderColor={colors.borderSoft}
          borderTopWidth={3}
          borderTopColor={ind.accentColor}
          padding={14}
          gap={6}
        >
          <Text fontSize={11} color={colors.textLabel} fontWeight="600">
            {prod.metricSummary.title}
          </Text>
          <Text fontSize={24} fontWeight="800" color={colors.text} fontFamily="$mono">
            {prod.metricSummary.value}
          </Text>
          <Text fontSize={11} color="#34d399" fontWeight="700">
            {prod.metricSummary.badge}
          </Text>
        </View>

        <View
          flex={1}
          minWidth={160}
          backgroundColor={colors.card}
          borderRadius={12}
          borderWidth={1}
          borderColor={colors.borderSoft}
          borderTopWidth={3}
          borderTopColor="#10b981"
          padding={14}
          gap={6}
        >
          <Text fontSize={11} color={colors.textLabel} fontWeight="600">
            Meta del Periodo
          </Text>
          <Text fontSize={24} fontWeight="800" color={colors.text} fontFamily="$mono">
            {target}{" "}
            <Text fontSize={12} color={colors.textLabel}>
              {prod.targetUnit}
            </Text>
          </Text>
          <Text fontSize={11} color={pct >= 100 ? "#34d399" : "#fbbf24"} fontWeight="700">
            Cumplimiento: {pct}%
          </Text>
        </View>

        <View
          flex={1}
          minWidth={160}
          backgroundColor={colors.card}
          borderRadius={12}
          borderWidth={1}
          borderColor={colors.borderSoft}
          borderTopWidth={3}
          borderTopColor="#2198F4"
          padding={14}
          gap={6}
        >
          <Text fontSize={11} color={colors.textLabel} fontWeight="600">
            Estaciones Observadas
          </Text>
          <Text fontSize={24} fontWeight="800" color={colors.text} fontFamily="$mono">
            {prod.stations.length}
          </Text>
          <Text fontSize={11} color={colors.textSec}>
            {prod.stations.filter((s) => s.status === "Óptimo").length} en ritmo óptimo
          </Text>
        </View>
      </XStack>

      {/* HOURLY THROUGHPUT COMPARISON CHART */}
      <View
        backgroundColor={colors.card}
        borderRadius={16}
        borderWidth={1}
        borderColor={colors.borderSoft}
        padding={18}
        gap={14}
      >
        <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={10}>
          <YStack gap={2}>
            <Text fontSize={15} fontWeight="800" color={colors.text} fontFamily="$body">
              Ritmo de Producción por Intervalo Horario
            </Text>
            <Text fontSize={11} color={colors.textSec}>
              Unidades detectadas cruzando la zona de medición visual vs objetivo programado
            </Text>
          </YStack>

          {/* Toggle between Multi-Line and Bar */}
          <XStack
            backgroundColor={colors.bg}
            borderRadius={8}
            padding={3}
            borderWidth={1}
            borderColor={colors.borderSoft}
            gap={3}
          >
            <TouchableOpacity
              onPress={() => setProdChartMode("multiline")}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 6,
                backgroundColor:
                  prodChartMode === "multiline" ? "rgba(56, 189, 248, 0.2)" : "transparent",
              }}
            >
              <Text
                fontSize={10.5}
                fontWeight="800"
                color={prodChartMode === "multiline" ? "#38bdf8" : colors.textLabel}
                fontFamily="$body"
              >
                Real vs Meta
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setProdChartMode("bar")}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 6,
                backgroundColor:
                  prodChartMode === "bar" ? "rgba(56, 189, 248, 0.2)" : "transparent",
              }}
            >
              <Text
                fontSize={10.5}
                fontWeight="800"
                color={prodChartMode === "bar" ? "#38bdf8" : colors.textLabel}
                fontFamily="$body"
              >
                Barras de Ritmo
              </Text>
            </TouchableOpacity>
          </XStack>
        </XStack>

        {prodChartMode === "multiline" ? (
          <YStack gap={10}>
            {/* Legend */}
            <XStack gap={14} alignItems="center">
              <XStack alignItems="center" gap={6}>
                <View width={10} height={10} borderRadius={5} backgroundColor={ind.accentColor} />
                <Text fontSize={11} fontWeight="700" color={colors.text} fontFamily="$body">
                  Ritmo Real Observado
                </Text>
              </XStack>
              <XStack alignItems="center" gap={6}>
                <View width={10} height={10} borderRadius={5} backgroundColor="#10b981" />
                <Text fontSize={11} fontWeight="700" color={colors.textSec} fontFamily="$body">
                  Meta Programada
                </Text>
              </XStack>
            </XStack>

            <SvgMultiLineChart
              data={prod.hourlyProduction}
              xKey="hour"
              lines={[
                { yKey: "produced", color: ind.accentColor, label: "Real" },
                { yKey: "target", color: "#10b981", label: "Meta" },
              ]}
              height={180}
              labelColor={colors.textLabel}
              gridColor={colors.borderSoft}
            />
          </YStack>
        ) : (
          <SvgBarChart
            data={prod.hourlyProduction.map((h) => ({
              hour: h.hour,
              produced: h.produced,
            }))}
            xKey="hour"
            yKey="produced"
            color={ind.accentColor}
            height={180}
            labelColor={colors.textLabel}
            gridColor={colors.borderSoft}
          />
        )}
      </View>

      {/* CATEGORY BREAKDOWN CARDS */}
      <YStack gap={10}>
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize={14} fontWeight="800" color={colors.text} fontFamily="$body">
            DESGLOSE POR CATEGORÍA OBSERVADA
          </Text>
          <Text fontSize={11} color={colors.textLabel}>
            {prod.categoryBreakdown.length} categorías
          </Text>
        </XStack>

        <XStack flexWrap="wrap" gap={12}>
          {prod.categoryBreakdown.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <TouchableOpacity
                key={cat.name}
                onPress={() => setSelectedCategory(isSelected ? null : cat.name)}
                style={{
                  flex: 1,
                  minWidth: isDesktop ? 220 : "47%",
                  backgroundColor: isSelected ? "rgba(10, 76, 232, 0.15)" : colors.card,
                  borderWidth: isSelected ? 2 : 1,
                  borderColor: isSelected ? cat.color : colors.borderSoft,
                  borderRadius: 12,
                  padding: 14,
                  gap: 6,
                }}
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <View width={10} height={10} borderRadius={5} backgroundColor={cat.color} />
                  <Text fontSize={10} fontWeight="700" color={colors.textLabel} fontFamily="$mono">
                    {cat.percentage}%
                  </Text>
                </XStack>

                <Text fontSize={12.5} fontWeight="700" color={colors.text} numberOfLines={1}>
                  {cat.name}
                </Text>

                <Text fontSize={20} fontWeight="900" color={cat.color} fontFamily="$mono">
                  {cat.count}{" "}
                  <Text fontSize={11} color={colors.textLabel}>
                    {cat.unit}
                  </Text>
                </Text>

                {/* Progress Bar */}
                <View
                  height={4}
                  backgroundColor={colors.borderSoft}
                  borderRadius={2}
                  marginTop={4}
                  overflow="hidden"
                >
                  <View
                    height="100%"
                    width={`${Math.min(100, cat.percentage)}%`}
                    backgroundColor={cat.color}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </XStack>
      </YStack>

      {/* STATIONS THROUGHPUT & ACCUMULATIONS */}
      <XStack gap={16} flexDirection={isDesktop ? "row" : "column"} alignItems="stretch">
        {/* Stations Table */}
        <View
          flex={1}
          backgroundColor={colors.card}
          borderRadius={14}
          borderWidth={1}
          borderColor={colors.borderSoft}
          padding={16}
          gap={12}
        >
          <Text fontSize={13} fontWeight="800" color={colors.text} fontFamily="$body">
            Rendimiento por Estación de Trabajo
          </Text>

          <YStack gap={8}>
            {prod.stations.map((st) => (
              <View
                key={st.name}
                backgroundColor={colors.bg}
                borderRadius={8}
                padding={10}
                borderWidth={1}
                borderColor={colors.borderSoft}
                gap={4}
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize={12} fontWeight="700" color={colors.text}>
                    {st.name}
                  </Text>
                  <View
                    backgroundColor={
                      st.status === "Óptimo"
                        ? "rgba(16, 185, 129, 0.15)"
                        : "rgba(245, 158, 11, 0.15)"
                    }
                    paddingHorizontal={6}
                    paddingVertical={2}
                    borderRadius={4}
                  >
                    <Text
                      fontSize={9.5}
                      fontWeight="700"
                      color={st.status === "Óptimo" ? "#34d399" : "#fbbf24"}
                    >
                      {st.status}
                    </Text>
                  </View>
                </XStack>
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize={11} color={colors.textSec}>
                    Ritmo: {st.currentThroughput}
                  </Text>
                  <Text fontSize={11} fontWeight="700" color="#38bdf8" fontFamily="$mono">
                    Eficiencia: {st.efficiencyPercent}%
                  </Text>
                </XStack>
              </View>
            ))}
          </YStack>
        </View>

        {/* Accumulations & WIP Alerts */}
        <View
          flex={1}
          backgroundColor={colors.card}
          borderRadius={14}
          borderWidth={1}
          borderColor={colors.borderSoft}
          padding={16}
          gap={12}
        >
          <Text fontSize={13} fontWeight="800" color={colors.text} fontFamily="$body">
            Acumulaciones & Congestión Observable
          </Text>

          <YStack gap={8}>
            {prod.accumulations.map((acc) => (
              <View
                key={acc.area}
                backgroundColor={colors.bg}
                borderRadius={8}
                padding={10}
                borderWidth={1}
                borderColor={acc.alertActive ? "rgba(248, 113, 113, 0.4)" : colors.borderSoft}
                gap={4}
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize={12} fontWeight="700" color={colors.text}>
                    {acc.area}
                  </Text>
                  <Text
                    fontSize={11}
                    fontWeight="800"
                    color={acc.alertActive ? "#f87171" : "#10b981"}
                    fontFamily="$mono"
                  >
                    {acc.count} / {acc.maxCapacity} unidades
                  </Text>
                </XStack>
                <Text fontSize={10.5} color={colors.textSec}>
                  Tiempo de permanencia en zona: {acc.durationMinutes} minutos.{" "}
                  {acc.alertActive
                    ? "Alerta de estancamiento activa."
                    : "Flujo dentro de parámetros."}
                </Text>
              </View>
            ))}

            {/* Quality control section if present */}
            {prod.qualityOrDefects && (
              <View
                backgroundColor="rgba(33, 152, 244, 0.08)"
                borderRadius={8}
                borderWidth={1}
                borderColor="rgba(33, 152, 244, 0.25)"
                padding={10}
                gap={4}
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize={11.5} fontWeight="700" color="#38bdf8">
                    Inspección Visual de Calidad
                  </Text>
                  <Text fontSize={11} fontWeight="800" color="#34d399" fontFamily="$mono">
                    {prod.qualityOrDefects.rate} Aprobados
                  </Text>
                </XStack>
                <Text fontSize={10.5} color={colors.textSec}>
                  {prod.qualityOrDefects.criteria} ({prod.qualityOrDefects.approved} conformes /{" "}
                  {prod.qualityOrDefects.flagged} señalados).
                </Text>
              </View>
            )}
          </YStack>
        </View>
      </XStack>
    </ScrollView>
  );
}
