import { SvgBarChart } from "@/src/components/charts/svg-bar-chart";
import { SvgMultiLineChart } from "@/src/components/charts/svg-multi-line-chart";
import { getIndustryById } from "@/src/data/industries";
import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { useColors } from "@/src/hooks/use-colors";
import { useLocalSearchParams } from "expo-router";
import { Clock, Flame, Layers, TrendingUp, UserCheck, Users } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";

export default function IndustryPeopleScreen() {
  const { industry } = useLocalSearchParams<{ industry: string }>();
  const colors = useColors();
  const { isDesktop } = useBreakpoint();
  const [chartMode, setChartMode] = useState<"multiline" | "bar">("multiline");

  const ind = industry ? getIndustryById(industry) : undefined;
  if (!ind) return null;

  const ppl = ind.people;
  const occPct = Math.round(
    (ppl.trafficToday.currentOccupancy / ppl.trafficToday.maxCapacity) * 100
  );

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
          <Users size={20} color="#2198F4" />
          <Text fontSize={20} fontWeight="800" color={colors.text} fontFamily="$body">
            VERTICAL C: PERSONAS & EXPERIENCIA
          </Text>
        </XStack>
        <Text fontSize={12.5} color={colors.textSec} fontFamily="$body" lineHeight={18}>
          Conteo bidireccional, aforo de espacios y tiempos de permanencia en {ind.name}. La
          videoanalítica analiza flujos agregados y longitudes de fila garantizando la privacidad de
          los visitantes (sin requerir reconocimiento facial identificable).
        </Text>
      </YStack>

      {/* TRAFFIC SUMMARY CARDS */}
      <XStack flexWrap="wrap" gap={12}>
        <View
          flex={1}
          minWidth={150}
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
            Entradas Registradas
          </Text>
          <Text fontSize={24} fontWeight="800" color={colors.text} fontFamily="$mono">
            {ppl.trafficToday.totalIn.toLocaleString()}
          </Text>
          <Text fontSize={10.5} color={colors.textSec}>
            Salidas: {ppl.trafficToday.totalOut.toLocaleString()}
          </Text>
        </View>

        <View
          flex={1}
          minWidth={150}
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
            Aforo Actual
          </Text>
          <Text fontSize={24} fontWeight="800" color="#34d399" fontFamily="$mono">
            {ppl.trafficToday.currentOccupancy} / {ppl.trafficToday.maxCapacity}
          </Text>
          <Text fontSize={10.5} color={colors.textSec}>
            {occPct}% de capacidad máxima
          </Text>
        </View>

        <View
          flex={1}
          minWidth={150}
          backgroundColor={colors.card}
          borderRadius={12}
          borderWidth={1}
          borderColor={colors.borderSoft}
          borderTopWidth={3}
          borderTopColor="#f59e0b"
          padding={14}
          gap={6}
        >
          <Text fontSize={11} color={colors.textLabel} fontWeight="600">
            Pico de Afluencia
          </Text>
          <Text fontSize={24} fontWeight="800" color="#fbbf24" fontFamily="$mono">
            {ppl.trafficToday.peakHour}
          </Text>
          <Text fontSize={10.5} color={colors.textSec}>
            Mayor densidad del día
          </Text>
        </View>
      </XStack>

      {/* HOURLY TRAFFIC COMPARISON CHART */}
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
              Distribución Horaria: Entradas vs Salidas por Intervalo
            </Text>
            <Text fontSize={11} color={colors.textSec}>
              Medición bidireccional continua en accesos principales y aforo neto
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
              onPress={() => setChartMode("multiline")}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 6,
                backgroundColor:
                  chartMode === "multiline" ? "rgba(56, 189, 248, 0.2)" : "transparent",
              }}
            >
              <Text
                fontSize={10.5}
                fontWeight="800"
                color={chartMode === "multiline" ? "#38bdf8" : colors.textLabel}
                fontFamily="$body"
              >
                Entradas vs Salidas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setChartMode("bar")}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 6,
                backgroundColor: chartMode === "bar" ? "rgba(56, 189, 248, 0.2)" : "transparent",
              }}
            >
              <Text
                fontSize={10.5}
                fontWeight="800"
                color={chartMode === "bar" ? "#38bdf8" : colors.textLabel}
                fontFamily="$body"
              >
                Barras de Ingreso
              </Text>
            </TouchableOpacity>
          </XStack>
        </XStack>

        {chartMode === "multiline" ? (
          <YStack gap={10}>
            {/* Legend */}
            <XStack gap={14} alignItems="center">
              <XStack alignItems="center" gap={6}>
                <View width={10} height={10} borderRadius={5} backgroundColor="#38bdf8" />
                <Text fontSize={11} fontWeight="700" color={colors.text} fontFamily="$body">
                  Ingresos / Entradas
                </Text>
              </XStack>
              <XStack alignItems="center" gap={6}>
                <View width={10} height={10} borderRadius={5} backgroundColor="#f59e0b" />
                <Text fontSize={11} fontWeight="700" color={colors.textSec} fontFamily="$body">
                  Salidas / Retiro
                </Text>
              </XStack>
            </XStack>

            <SvgMultiLineChart
              data={ppl.hourlyTraffic}
              xKey="hour"
              lines={[
                { yKey: "inCount", color: "#38bdf8", label: "Ingresos" },
                { yKey: "outCount", color: "#f59e0b", label: "Salidas" },
              ]}
              height={180}
              labelColor={colors.textLabel}
              gridColor={colors.borderSoft}
            />
          </YStack>
        ) : (
          <SvgBarChart
            data={ppl.hourlyTraffic.map((h) => ({
              hour: h.hour,
              produced: h.inCount,
            }))}
            xKey="hour"
            yKey="produced"
            color="#2198F4"
            height={180}
            labelColor={colors.textLabel}
            gridColor={colors.borderSoft}
          />
        )}
      </View>

      {/* HEAT ZONES & QUEUES ANALYSIS */}
      <XStack gap={16} flexDirection={isDesktop ? "row" : "column"} alignItems="stretch">
        {/* Heatmap Zones */}
        <View
          flex={1}
          backgroundColor={colors.card}
          borderRadius={14}
          borderWidth={1}
          borderColor={colors.borderSoft}
          padding={16}
          gap={12}
        >
          <XStack alignItems="center" gap={8}>
            <Flame size={16} color="#f59e0b" />
            <Text fontSize={13} fontWeight="800" color={colors.text} fontFamily="$body">
              Zonas de Mayor Circulación & Permanencia
            </Text>
          </XStack>

          <YStack gap={8}>
            {ppl.heatZones.map((hz) => (
              <View
                key={hz.zone}
                backgroundColor={colors.bg}
                borderRadius={8}
                padding={12}
                borderWidth={1}
                borderColor={colors.borderSoft}
                gap={6}
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize={12} fontWeight="700" color={colors.text}>
                    {hz.zone}
                  </Text>
                  <Text fontSize={11} fontWeight="800" color="#38bdf8" fontFamily="$mono">
                    {hz.trafficSharePercent}% del tráfico
                  </Text>
                </XStack>

                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize={10.5} color={colors.textSec}>
                    Permanencia media: {hz.avgStayMinutes} min
                  </Text>
                  <View
                    backgroundColor="rgba(245, 158, 11, 0.12)"
                    paddingHorizontal={6}
                    paddingVertical={2}
                    borderRadius={4}
                  >
                    <Text fontSize={9.5} fontWeight="700" color="#fbbf24">
                      {hz.status}
                    </Text>
                  </View>
                </XStack>
              </View>
            ))}
          </YStack>
        </View>

        {/* Queues & Waiting Times */}
        <View
          flex={1}
          backgroundColor={colors.card}
          borderRadius={14}
          borderWidth={1}
          borderColor={colors.borderSoft}
          padding={16}
          gap={12}
        >
          <XStack alignItems="center" gap={8}>
            <Clock size={16} color="#10b981" />
            <Text fontSize={13} fontWeight="800" color={colors.text} fontFamily="$body">
              Filas & Tiempos de Espera en Puntos de Servicio
            </Text>
          </XStack>

          <YStack gap={8}>
            {ppl.queues.map((q) => (
              <View
                key={q.location}
                backgroundColor={colors.bg}
                borderRadius={8}
                padding={12}
                borderWidth={1}
                borderColor={colors.borderSoft}
                gap={6}
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize={12} fontWeight="700" color={colors.text}>
                    {q.location}
                  </Text>
                  <Text fontSize={11} fontWeight="800" color="#34d399" fontFamily="$mono">
                    {q.avgWaitMinutes} min espera
                  </Text>
                </XStack>

                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize={10.5} color={colors.textSec}>
                    Fila actual: {q.lengthCount} personas (umbral: {q.thresholdAlert})
                  </Text>
                  <View
                    backgroundColor={
                      q.status === "Fluido"
                        ? "rgba(16, 185, 129, 0.12)"
                        : "rgba(245, 158, 11, 0.12)"
                    }
                    paddingHorizontal={6}
                    paddingVertical={2}
                    borderRadius={4}
                  >
                    <Text
                      fontSize={9.5}
                      fontWeight="700"
                      color={q.status === "Fluido" ? "#34d399" : "#fbbf24"}
                    >
                      {q.status}
                    </Text>
                  </View>
                </XStack>
              </View>
            ))}
          </YStack>
        </View>
      </XStack>
    </ScrollView>
  );
}
