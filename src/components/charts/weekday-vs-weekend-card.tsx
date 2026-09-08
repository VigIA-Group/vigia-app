/**
 * WeekdayVsWeekendCard — Comparativa de comportamiento entre semana vs. fin de semana.
 * Analiza el cambio en volumen de clientes, tiempo de permanencia y tasa de conversión.
 */
import { getWeekdayVsWeekendStats } from "@/src/data/mock";
import { useColors } from "@/src/hooks/use-colors";
import {
    CalendarRange,
    Clock,
    Lightbulb,
    ShoppingCart,
    TrendingDown,
    TrendingUp,
    Users,
} from "lucide-react-native";
import { Text, View, XStack, YStack } from "tamagui";
import { VIGIA_COLORS } from "./chart-theme";

export function WeekdayVsWeekendCard() {
  const colors = useColors();
  const stats = getWeekdayVsWeekendStats();

  return (
    <YStack
      backgroundColor={colors.card}
      borderRadius={16}
      borderWidth={1}
      borderColor={colors.borderSoft}
      padding={18}
      gap={14}
    >
      {/* Header */}
      <XStack alignItems="center" gap={8}>
        <View
          width={28}
          height={28}
          borderRadius={8}
          backgroundColor="rgba(33, 152, 244, 0.15)"
          alignItems="center"
          justifyContent="center"
        >
          <CalendarRange size={16} color={VIGIA_COLORS.blueCyan} />
        </View>
        <YStack>
          <Text fontSize={14} fontWeight="700" color={colors.text} fontFamily="$heading">
            Días Laborales vs. Fin de Semana
          </Text>
          <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
            Contraste de volumen de clientes, permanencia y conversión
          </Text>
        </YStack>
      </XStack>

      {/* Side-by-Side Cards */}
      <XStack gap={12} flexWrap="wrap">
        {/* Weekday Card */}
        <YStack
          flex={1}
          minWidth={160}
          backgroundColor={colors.cardAlt}
          borderRadius={14}
          padding={14}
          borderLeftWidth={3}
          borderLeftColor={VIGIA_COLORS.blueVibrant}
          gap={10}
        >
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={12} fontWeight="700" color={colors.text} fontFamily="$heading">
              Entre Semana (Lun–Vie)
            </Text>
            <View
              backgroundColor="rgba(5, 110, 250, 0.12)"
              paddingHorizontal={6}
              paddingVertical={2}
              borderRadius={4}
            >
              <Text
                fontSize={9}
                fontWeight="600"
                color={VIGIA_COLORS.blueVibrant}
                fontFamily="$body"
              >
                5 días
              </Text>
            </View>
          </XStack>

          {/* Metric: Traffic */}
          <YStack gap={2}>
            <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
              Tráfico promedio diario
            </Text>
            <XStack alignItems="center" gap={4}>
              <Users size={13} color={VIGIA_COLORS.blueVibrant} />
              <Text fontSize={18} fontWeight="800" color={colors.text} fontFamily="$mono">
                {stats.weekdayAvgVisitors.toLocaleString("es-BO")}
              </Text>
              <Text fontSize={11} color={colors.textLabel}>
                pers/día
              </Text>
            </XStack>
          </YStack>

          {/* Metric: Conversion */}
          <YStack gap={2}>
            <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
              Tasa de conversión
            </Text>
            <XStack alignItems="center" gap={4}>
              <ShoppingCart size={13} color={VIGIA_COLORS.emeraldSuccess} />
              <Text
                fontSize={16}
                fontWeight="800"
                color={VIGIA_COLORS.emeraldSuccess}
                fontFamily="$mono"
              >
                {stats.weekdayAvgConversion}%
              </Text>
              <Text fontSize={10} color={colors.textLabel}>
                (Alta eficiencia)
              </Text>
            </XStack>
          </YStack>

          {/* Metric: Dwell Time */}
          <YStack gap={2}>
            <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
              Permanencia promedio
            </Text>
            <XStack alignItems="center" gap={4}>
              <Clock size={13} color={VIGIA_COLORS.purpleMetric} />
              <Text fontSize={14} fontWeight="700" color={colors.text} fontFamily="$mono">
                {stats.weekdayAvgDwellMin} min
              </Text>
            </XStack>
          </YStack>
        </YStack>

        {/* Weekend Card */}
        <YStack
          flex={1}
          minWidth={160}
          backgroundColor={colors.cardAlt}
          borderRadius={14}
          padding={14}
          borderLeftWidth={3}
          borderLeftColor={VIGIA_COLORS.amberWarning}
          gap={10}
        >
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={12} fontWeight="700" color={colors.text} fontFamily="$heading">
              Fin de Semana (Sáb–Dom)
            </Text>
            <View
              backgroundColor="rgba(251, 191, 36, 0.15)"
              paddingHorizontal={6}
              paddingVertical={2}
              borderRadius={4}
            >
              <Text
                fontSize={9}
                fontWeight="600"
                color={VIGIA_COLORS.amberWarning}
                fontFamily="$body"
              >
                2 días
              </Text>
            </View>
          </XStack>

          {/* Metric: Traffic */}
          <YStack gap={2}>
            <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
              Tráfico promedio diario
            </Text>
            <XStack alignItems="center" gap={4}>
              <Users size={13} color={VIGIA_COLORS.amberWarning} />
              <Text fontSize={18} fontWeight="800" color={colors.text} fontFamily="$mono">
                {stats.weekendAvgVisitors.toLocaleString("es-BO")}
              </Text>
              <Text fontSize={11} color={colors.textLabel}>
                pers/día
              </Text>
            </XStack>
            <XStack alignItems="center" gap={3}>
              <TrendingUp size={11} color={VIGIA_COLORS.emeraldSuccess} />
              <Text
                fontSize={10}
                fontWeight="700"
                color={VIGIA_COLORS.emeraldSuccess}
                fontFamily="$mono"
              >
                +{stats.trafficIncreasePercent}% más tráfico
              </Text>
            </XStack>
          </YStack>

          {/* Metric: Conversion */}
          <YStack gap={2}>
            <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
              Tasa de conversión
            </Text>
            <XStack alignItems="center" gap={4}>
              <ShoppingCart size={13} color={VIGIA_COLORS.amberWarning} />
              <Text
                fontSize={16}
                fontWeight="800"
                color={VIGIA_COLORS.amberWarning}
                fontFamily="$mono"
              >
                {stats.weekendAvgConversion}%
              </Text>
              <Text fontSize={10} color={colors.textLabel}>
                (Caída)
              </Text>
            </XStack>
            <XStack alignItems="center" gap={3}>
              <TrendingDown size={11} color={VIGIA_COLORS.redDanger} />
              <Text
                fontSize={10}
                fontWeight="700"
                color={VIGIA_COLORS.redDanger}
                fontFamily="$mono"
              >
                {stats.conversionDiffPts} pts vs. entre semana
              </Text>
            </XStack>
          </YStack>

          {/* Metric: Dwell Time */}
          <YStack gap={2}>
            <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
              Permanencia promedio
            </Text>
            <XStack alignItems="center" gap={4}>
              <Clock size={13} color={VIGIA_COLORS.purpleMetric} />
              <Text fontSize={14} fontWeight="700" color={colors.text} fontFamily="$mono">
                {stats.weekendAvgDwellMin} min
              </Text>
              <Text fontSize={10} color={colors.textLabel}>
                (+28%)
              </Text>
            </XStack>
          </YStack>
        </YStack>
      </XStack>

      {/* Actionable Staffing Recommendation Callout */}
      <XStack
        backgroundColor="rgba(10, 76, 232, 0.08)"
        borderRadius={12}
        borderWidth={1}
        borderColor="rgba(10, 76, 232, 0.25)"
        padding={12}
        alignItems="flex-start"
        gap={10}
      >
        <Lightbulb size={16} color={VIGIA_COLORS.amberWarning} style={{ marginTop: 2 }} />
        <YStack flex={1} gap={2}>
          <Text fontSize={12} fontWeight="700" color={colors.text} fontFamily="$heading">
            Oportunidad Operativa Identificada
          </Text>
          <Text fontSize={11} color={colors.textSec} fontFamily="$body" lineHeight={16}>
            Los fines de semana los clientes permanecen casi 6 minutos más recorriendo pasillos,
            pero la congestión en cajas hace perder ventas potenciales. Habilitar 2 cajas
            adicionales entre 14:00 y 18:00 recuperaría aproximadamente un +4% de conversión.
          </Text>
        </YStack>
      </XStack>
    </YStack>
  );
}
