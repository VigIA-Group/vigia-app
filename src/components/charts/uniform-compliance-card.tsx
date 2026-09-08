/**
 * UniformComplianceCard — Monitor de cumplimiento de uniforme y elementos de protección personal (EPP).
 */
import { OPERATIONS_METRICS } from "@/src/data/mock";
import { useColors } from "@/src/hooks/use-colors";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Shirt,
} from "lucide-react-native";
import { Text, View, XStack, YStack } from "tamagui";
import { VIGIA_COLORS } from "./chart-theme";

export function UniformComplianceCard() {
  const colors = useColors();
  const { uniformComplianceRate, uniformCategories, zoneCompliance } = OPERATIONS_METRICS;

  return (
    <YStack
      backgroundColor={colors.card}
      borderRadius={16}
      borderWidth={1}
      borderColor={colors.borderSoft}
      padding={18}
      gap={16}
    >
      {/* Header */}
      <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={8}>
        <XStack alignItems="center" gap={8}>
          <View
            width={30}
            height={30}
            borderRadius={8}
            backgroundColor="rgba(5, 110, 250, 0.12)"
            alignItems="center"
            justifyContent="center"
          >
            <Shirt size={16} color={VIGIA_COLORS.blueVibrant} />
          </View>
          <YStack>
            <Text fontSize={14} fontWeight="700" color={colors.text} fontFamily="$heading">
              Auditoría de Uniforme y Elementos EPP
            </Text>
            <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
              Detección por visión computacional de vestimenta reglamentaria y credencial
            </Text>
          </YStack>
        </XStack>

        {/* Global Badge */}
        <View
          backgroundColor={
            uniformComplianceRate >= 95
              ? "rgba(52, 211, 153, 0.15)"
              : "rgba(251, 191, 36, 0.15)"
          }
          paddingHorizontal={10}
          paddingVertical={5}
          borderRadius={8}
        >
          <Text
            fontSize={12}
            fontWeight="800"
            color={
              uniformComplianceRate >= 95
                ? VIGIA_COLORS.emeraldSuccess
                : VIGIA_COLORS.amberWarning
            }
            fontFamily="$mono"
          >
            {uniformComplianceRate}% Cumplimiento
          </Text>
        </View>
      </XStack>

      {/* Categories Progress Bars */}
      <YStack gap={10}>
        <Text fontSize={11} fontWeight="700" color={colors.textLabel} fontFamily="$heading">
          DESGLOSE POR REQUERIMIENTO NORMATIVO
        </Text>

        <YStack gap={8}>
          {uniformCategories.map((cat, idx) => {
            const isOptimal = cat.status === "optimal";
            const isCritical = cat.status === "critical";
            const color = isCritical
              ? VIGIA_COLORS.redDanger
              : isOptimal
                ? VIGIA_COLORS.emeraldSuccess
                : VIGIA_COLORS.blueVibrant;

            return (
              <YStack
                key={idx}
                backgroundColor={colors.cardAlt}
                borderRadius={10}
                padding={12}
                gap={6}
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <XStack alignItems="center" gap={6}>
                    <View width={6} height={6} borderRadius={3} backgroundColor={color} />
                    <Text fontSize={12} fontWeight="600" color={colors.text} fontFamily="$body">
                      {cat.label}
                    </Text>
                  </XStack>

                  <XStack alignItems="center" gap={8}>
                    <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
                      {cat.infractions === 0
                        ? "Sin infracciones"
                        : `${cat.infractions} falta${cat.infractions > 1 ? "s" : ""}`}
                    </Text>
                    <Text fontSize={12} fontWeight="800" color={color} fontFamily="$mono">
                      {cat.complianceRate}%
                    </Text>
                  </XStack>
                </XStack>

                {/* Progress bar */}
                <View
                  height={5}
                  borderRadius={3}
                  backgroundColor="rgba(255, 255, 255, 0.08)"
                  overflow="hidden"
                >
                  <View
                    height={5}
                    borderRadius={3}
                    backgroundColor={color}
                    width={`${cat.complianceRate}%` as `${number}%`}
                  />
                </View>
              </YStack>
            );
          })}
        </YStack>
      </YStack>

      {/* Zones compliance grid */}
      <YStack gap={10}>
        <Text fontSize={11} fontWeight="700" color={colors.textLabel} fontFamily="$heading">
          CUMPLIMIENTO POR ZONA OPERATIVA
        </Text>

        <XStack flexWrap="wrap" gap={10}>
          {zoneCompliance.map((zc, i) => {
            const isAlert = zc.complianceRate < 90;
            const statusColor = isAlert ? VIGIA_COLORS.amberWarning : VIGIA_COLORS.blueVibrant;

            return (
              <YStack
                key={i}
                flex={1}
                minWidth={220}
                backgroundColor={colors.cardAlt}
                borderRadius={12}
                padding={12}
                gap={6}
                borderWidth={1}
                borderColor={isAlert ? "rgba(251, 191, 36, 0.3)" : colors.borderSoft}
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize={12} fontWeight="700" color={colors.text} fontFamily="$body">
                    {zc.zone}
                  </Text>
                  <XStack
                    backgroundColor="rgba(255, 255, 255, 0.06)"
                    paddingHorizontal={6}
                    paddingVertical={2}
                    borderRadius={4}
                    alignItems="center"
                    gap={4}
                  >
                    <Camera size={10} color={colors.textLabel} />
                    <Text fontSize={9} color={colors.textLabel} fontFamily="$mono">
                      {zc.cameraId}
                    </Text>
                  </XStack>
                </XStack>

                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
                    {zc.staffCount} colaboradores en turno
                  </Text>
                  <Text fontSize={13} fontWeight="800" color={statusColor} fontFamily="$mono">
                    {zc.complianceRate}%
                  </Text>
                </XStack>

                {zc.criticalMissing && (
                  <XStack
                    backgroundColor="rgba(251, 191, 36, 0.12)"
                    paddingHorizontal={8}
                    paddingVertical={4}
                    borderRadius={6}
                    alignItems="center"
                    gap={5}
                  >
                    <AlertTriangle size={11} color={VIGIA_COLORS.amberWarning} />
                    <Text fontSize={9.5} color={VIGIA_COLORS.amberWarning} fontFamily="$body" fontWeight="600">
                      Alerta: {zc.criticalMissing}
                    </Text>
                  </XStack>
                )}
              </YStack>
            );
          })}
        </XStack>
      </YStack>

      {/* AI Observation */}
      <XStack
        backgroundColor="rgba(10, 76, 232, 0.08)"
        borderRadius={12}
        borderWidth={1}
        borderColor="rgba(10, 76, 232, 0.22)"
        padding={12}
        alignItems="flex-start"
        gap={10}
      >
        <CheckCircle2 size={16} color={VIGIA_COLORS.blueVibrant} style={{ marginTop: 2 }} />
        <YStack flex={1} gap={2}>
          <Text fontSize={11} fontWeight="700" color={colors.text} fontFamily="$heading">
            Atención prioritaria en Panadería & Charcutería (cam-005)
          </Text>
          <Text fontSize={10.5} color={colors.textSec} fontFamily="$body" lineHeight={15}>
            Se detectaron 4 manipulaciones de alimentos sin cofia protectora reglamentaria en horario matutino. La línea de cajas mantiene un 97.5% de cumplimiento óptimo.
          </Text>
        </YStack>
      </XStack>
    </YStack>
  );
}
