/**
 * OperationsKpiSummary — Tarjetas KPI principales de operaciones y cumplimiento de personal.
 */
import { OPERATIONS_METRICS } from "@/src/data/mock";
import { useColors } from "@/src/hooks/use-colors";
import {
  Clock,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react-native";
import { Text, View, XStack, YStack } from "tamagui";
import { VIGIA_COLORS } from "./chart-theme";

export function OperationsKpiSummary() {
  const colors = useColors();
  const m = OPERATIONS_METRICS;

  const kpis = [
    {
      label: "Score Operativo",
      value: `${m.overallScore}/100`,
      sub: "Índice de cumplimiento global",
      color: VIGIA_COLORS.emeraldSuccess,
      Icon: ShieldCheck,
      badge: "Excelente",
      badgeBg: "rgba(52, 211, 153, 0.15)",
    },
    {
      label: "Apertura Sucursal",
      value: "08:42 h",
      sub: `+${m.todayOpeningDelayMin}m sobre hora límite (08:30)`,
      color: VIGIA_COLORS.amberWarning,
      Icon: Clock,
      badge: "Retraso 12m",
      badgeBg: "rgba(251, 191, 36, 0.15)",
    },
    {
      label: "Uniforme & EPP",
      value: `${m.uniformComplianceRate}%`,
      sub: "Cajas 98% · Alimentos 86%",
      color: VIGIA_COLORS.blueVibrant,
      Icon: Users,
      badge: "4 faltas EPP",
      badgeBg: "rgba(5, 110, 250, 0.12)",
    },
    {
      label: "Uso Indebido Celular",
      value: `${m.phoneDistractionEvents} ev.`,
      sub: `${m.phoneDistractionDurationMin} min acumulados en piso`,
      color: VIGIA_COLORS.purpleMetric,
      Icon: Smartphone,
      badge: "Cajas & Sala",
      badgeBg: "rgba(167, 139, 250, 0.15)",
    },
  ];

  return (
    <XStack flexWrap="wrap" gap={12}>
      {kpis.map((k, i) => {
        const Icon = k.Icon;
        return (
          <YStack
            key={i}
            flex={1}
            minWidth={150}
            backgroundColor={colors.card}
            borderRadius={14}
            borderWidth={1}
            borderColor={colors.borderSoft}
            padding={14}
            justifyContent="space-between"
            gap={8}
          >
            <XStack justifyContent="space-between" alignItems="center">
              <View
                width={30}
                height={30}
                borderRadius={8}
                backgroundColor={k.badgeBg}
                alignItems="center"
                justifyContent="center"
              >
                <Icon size={16} color={k.color} />
              </View>
              <View
                backgroundColor={k.badgeBg}
                paddingHorizontal={7}
                paddingVertical={3}
                borderRadius={6}
              >
                <Text fontSize={9.5} fontWeight="700" color={k.color} fontFamily="$body">
                  {k.badge}
                </Text>
              </View>
            </XStack>

            <YStack gap={2}>
              <Text fontSize={10.5} color={colors.textLabel} fontFamily="$body">
                {k.label}
              </Text>
              <Text fontSize={19} fontWeight="800" color={colors.text} fontFamily="$mono">
                {k.value}
              </Text>
              <Text fontSize={10} color={colors.textSec} fontFamily="$body">
                {k.sub}
              </Text>
            </YStack>
          </YStack>
        );
      })}
    </XStack>
  );
}
