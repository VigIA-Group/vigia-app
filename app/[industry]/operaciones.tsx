import { getIndustryById } from "@/src/data/industries";
import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { useColors } from "@/src/hooks/use-colors";
import { useLocalSearchParams } from "expo-router";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  UserCheck,
} from "lucide-react-native";
import React from "react";
import { ScrollView } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";

export default function IndustryOperationsScreen() {
  const { industry } = useLocalSearchParams<{ industry: string }>();
  const colors = useColors();
  const { isDesktop } = useBreakpoint();

  const ind = industry ? getIndustryById(industry) : undefined;
  if (!ind) return null;

  const ops = ind.operations;

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
          <Clock size={20} color="#f59e0b" />
          <Text fontSize={20} fontWeight="800" color={colors.text} fontFamily="$body">
            VERTICAL B: OPERACIONES & PROCESOS
          </Text>
        </XStack>
        <Text fontSize={12.5} color={colors.textSec} fontFamily="$body" lineHeight={18}>
          Análisis visual del flujo de trabajo, tiempos de permanencia en zonas críticas, detección
          de cuellos de botella e inactividad observable en {ind.name}. VigIA reporta las anomalías
          configuradas según los estándares de cada estación.
        </Text>
      </YStack>

      {/* DWELL TIMES & BOTTLENECK CARDS */}
      <XStack gap={16} flexDirection={isDesktop ? "row" : "column"} alignItems="stretch">
        {/* Zone Dwell Times */}
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
            Tiempos Medios de Permanencia por Zona
          </Text>

          <YStack gap={10}>
            {ops.dwellTimes.map((dw) => {
              const isOver = dw.avgMinutes > dw.benchmarkMinutes;
              return (
                <View
                  key={dw.zone}
                  backgroundColor={colors.bg}
                  borderRadius={8}
                  padding={12}
                  borderWidth={1}
                  borderColor={colors.borderSoft}
                  gap={6}
                >
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize={12} fontWeight="700" color={colors.text}>
                      {dw.zone}
                    </Text>
                    <Text
                      fontSize={11}
                      fontWeight="800"
                      color={isOver ? "#f59e0b" : "#34d399"}
                      fontFamily="$mono"
                    >
                      {dw.avgMinutes} min{" "}
                      <Text fontSize={9.5} color={colors.textLabel}>
                        (meta: {dw.benchmarkMinutes}m)
                      </Text>
                    </Text>
                  </XStack>

                  {/* Visual Bar */}
                  <View
                    height={4}
                    backgroundColor={colors.borderSoft}
                    borderRadius={2}
                    overflow="hidden"
                  >
                    <View
                      height="100%"
                      width={`${Math.min(100, (dw.avgMinutes / dw.benchmarkMinutes) * 80)}%`}
                      backgroundColor={isOver ? "#f59e0b" : "#10b981"}
                    />
                  </View>
                </View>
              );
            })}
          </YStack>
        </View>

        {/* Identified Bottlenecks */}
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
            Cuellos de Botella Detectados & Recomendaciones
          </Text>

          <YStack gap={10}>
            {ops.bottlenecks.map((bn) => (
              <View
                key={bn.station}
                backgroundColor={colors.bg}
                borderRadius={8}
                padding={12}
                borderLeftWidth={3}
                borderLeftColor={bn.severity === "ALTA" ? "#f87171" : "#f59e0b"}
                borderWidth={1}
                borderColor={colors.borderSoft}
                gap={4}
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize={12} fontWeight="700" color={colors.text}>
                    {bn.station}
                  </Text>
                  <Text fontSize={11} fontWeight="800" color="#f59e0b" fontFamily="$mono">
                    Demora: {bn.avgDelay}
                  </Text>
                </XStack>
                <Text fontSize={11} color={colors.textSec} lineHeight={15}>
                  {bn.recommendation}
                </Text>
              </View>
            ))}
          </YStack>
        </View>
      </XStack>

      {/* EPP & UNIFORM COMPLIANCE (IF PRESENT) */}
      {ops.eppOrUniformCompliance && ops.eppOrUniformCompliance.length > 0 && (
        <View
          backgroundColor={colors.card}
          borderRadius={14}
          borderWidth={1}
          borderColor={colors.borderSoft}
          padding={16}
          gap={12}
        >
          <XStack justifyContent="space-between" alignItems="center">
            <XStack alignItems="center" gap={8}>
              <ShieldCheck size={16} color="#10b981" />
              <Text fontSize={13} fontWeight="800" color={colors.text} fontFamily="$body">
                Auditoría Visual de EPP, Uniforme & Buenas Prácticas
              </Text>
            </XStack>
            <Text fontSize={11} color="#34d399" fontWeight="700">
              Verificación Continua IA
            </Text>
          </XStack>

          <XStack flexWrap="wrap" gap={12}>
            {ops.eppOrUniformCompliance.map((epp) => (
              <View
                key={epp.item}
                flex={1}
                minWidth={isDesktop ? 220 : "47%"}
                backgroundColor={colors.bg}
                borderRadius={10}
                padding={12}
                borderWidth={1}
                borderColor={colors.borderSoft}
                gap={6}
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize={12} fontWeight="700" color={colors.text}>
                    {epp.item}
                  </Text>
                  <Text
                    fontSize={14}
                    fontWeight="800"
                    color={epp.complianceRate >= 98 ? "#34d399" : "#fbbf24"}
                    fontFamily="$mono"
                  >
                    {epp.complianceRate}%
                  </Text>
                </XStack>
                <Text fontSize={10.5} color={colors.textSec}>
                  {epp.inspectedCount} inspecciones visuales · {epp.infractions} avisos correctivos
                </Text>
              </View>
            ))}
          </XStack>
        </View>
      )}

      {/* SHIFTS COMPARISON & DOWNTIME EVENTS */}
      <XStack gap={16} flexDirection={isDesktop ? "row" : "column"} alignItems="stretch">
        {/* Shifts Comparison */}
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
            Comparativa de Rendimiento entre Turnos
          </Text>

          <YStack gap={8}>
            {ops.shiftsComparison.map((sh) => (
              <View
                key={sh.shift}
                backgroundColor={colors.bg}
                borderRadius={8}
                padding={10}
                borderWidth={1}
                borderColor={colors.borderSoft}
                gap={4}
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize={12} fontWeight="700" color={colors.text}>
                    {sh.shift}
                  </Text>
                  <Text fontSize={11} fontWeight="800" color="#38bdf8" fontFamily="$mono">
                    {sh.efficiencyPercent}% Eficiencia
                  </Text>
                </XStack>
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize={10.5} color={colors.textSec}>
                    Procesado: {sh.unitsProcessed} unidades
                  </Text>
                  <Text fontSize={10.5} color={colors.textLabel}>
                    Paradas: {sh.downtimeMinutes} min
                  </Text>
                </XStack>
              </View>
            ))}
          </YStack>
        </View>

        {/* Downtime Events Log */}
        {ops.downtimeEvents.length > 0 && (
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
              Bitácora de Paradas e Interrupciones Observadas
            </Text>

            <YStack gap={8}>
              {ops.downtimeEvents.map((dt, idx) => (
                <View
                  key={idx}
                  backgroundColor={colors.bg}
                  borderRadius={8}
                  borderLeftWidth={3}
                  borderLeftColor={dt.color}
                  padding={10}
                  gap={3}
                >
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize={11.5} fontWeight="700" color={colors.text}>
                      {dt.area}
                    </Text>
                    <Text fontSize={11} fontWeight="800" color={dt.color} fontFamily="$mono">
                      {dt.duration} ({dt.time})
                    </Text>
                  </XStack>
                  <Text fontSize={10.5} color={colors.textSec} lineHeight={14}>
                    {dt.reason}
                  </Text>
                </View>
              ))}
            </YStack>
          </View>
        )}
      </XStack>
    </ScrollView>
  );
}
