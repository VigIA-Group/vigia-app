/**
 * ProductionKpiSummary — Tarjetas KPI ejecutivas de la vertical de producción y manufactura de alimentos.
 */
import { PRODUCTION_METRICS } from "@/src/data/mock";
import { useColors } from "@/src/hooks/use-colors";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Clock,
} from "lucide-react-native";
import { Text, View, XStack, YStack } from "tamagui";
import { VIGIA_COLORS } from "./chart-theme";

export function ProductionKpiSummary() {
  const colors = useColors();
  const m = PRODUCTION_METRICS;

  const kpis = [
    {
      label: "Volumen Producido Hoy",
      value: `${m.totalProduced.toLocaleString("es-BO")} pzas`,
      sub: `Meta del turno: ${m.targetTotal.toLocaleString("es-BO")} pzas`,
      color: VIGIA_COLORS.blueVibrant,
      Icon: Boxes,
      badge: "+12.4% vs Meta",
      badgeBg: "rgba(5, 110, 250, 0.12)",
    },
    {
      label: "Conformidad de Calidad",
      value: `${m.qualityConformityRate}%`,
      sub: "Estándar aceptable: ≥ 95.0%",
      color: VIGIA_COLORS.emeraldSuccess,
      Icon: CheckCircle2,
      badge: "Línea Óptima",
      badgeBg: "rgba(52, 211, 153, 0.15)",
    },
    {
      label: "Mermas & Piezas Descartadas",
      value: `${m.defectiveTotal} pzas`,
      sub: `${m.burnedTotal} quemadas · -${m.scrapCostEstimatedBs} Bs ($${m.scrapCostEstimatedUsd})`,
      color: VIGIA_COLORS.redDanger,
      Icon: AlertTriangle,
      badge: "53.8% Quemadas",
      badgeBg: "rgba(248, 113, 113, 0.15)",
    },
    {
      label: "Disponibilidad de Cinta (OEE)",
      value: `${m.uptimeRate}%`,
      sub: `${m.downtimeMinutesTotal} min paradas en 2 eventos`,
      color: VIGIA_COLORS.purpleMetric,
      Icon: Clock,
      badge: "2 Paradas",
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
            minWidth={160}
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
                width={32}
                height={32}
                borderRadius={8}
                backgroundColor={k.badgeBg}
                alignItems="center"
                justifyContent="center"
              >
                <Icon size={17} color={k.color} />
              </View>
              <View
                backgroundColor={k.badgeBg}
                paddingHorizontal={8}
                paddingVertical={3.5}
                borderRadius={6}
              >
                <Text fontSize={10} fontWeight="700" color={k.color} fontFamily="$body">
                  {k.badge}
                </Text>
              </View>
            </XStack>

            <YStack gap={2}>
              <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
                {k.label}
              </Text>
              <Text fontSize={20} fontWeight="800" color={colors.text} fontFamily="$mono">
                {k.value}
              </Text>
              <Text fontSize={10.5} color={colors.textSec} fontFamily="$body">
                {k.sub}
              </Text>
            </YStack>
          </YStack>
        );
      })}
    </XStack>
  );
}
