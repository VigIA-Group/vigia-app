/**
 * DailyTrafficTable — Desglose diario de afluencia: "¿Cuántas personas fueron qué día?".
 * Incluye ordenación por métrica, comparativa vs promedio semanal, hora pico del día,
 * tiempo de permanencia y tasa de conversión.
 */
import { useColors } from "@/src/hooks/use-colors";
import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { getDailyTrafficBreakdown } from "@/src/data/mock";
import {
  ArrowDownUp,
  Calendar,
  Clock,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react-native";
import { useState } from "react";
import { Text, View, XStack, YStack } from "tamagui";
import { VIGIA_COLORS } from "./chart-theme";

type SortOption = "date" | "traffic" | "conversion";
type FilterOption = "all" | "weekdays" | "weekends";

export function DailyTrafficTable() {
  const colors = useColors();
  const { isWide } = useBreakpoint();
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");

  const rawData = getDailyTrafficBreakdown();

  // Filtro
  const filteredData = rawData.filter((item) => {
    if (filterBy === "weekdays") return !item.isWeekend;
    if (filterBy === "weekends") return item.isWeekend;
    return true;
  });

  // Ordenación
  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case "traffic":
        return b.visitors - a.visitors;
      case "conversion":
        return b.conversionRate - a.conversionRate;
      case "date":
      default:
        return 0;
    }
  });

  const maxDailyVisitors = Math.max(...rawData.map((d) => d.visitors));

  return (
    <YStack
      backgroundColor={colors.card}
      borderRadius={16}
      borderWidth={1}
      borderColor={colors.borderSoft}
      padding={18}
      gap={14}
    >
      {/* Header with Title */}
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
            <Calendar size={16} color={VIGIA_COLORS.blueVibrant} />
          </View>
          <YStack>
            <Text fontSize={14} fontWeight="700" color={colors.text} fontFamily="$heading">
              Desglose Diario Detallado de Afluencia
            </Text>
            <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
              Conteo exacto día a día, correlación con ventas y análisis de saturación
            </Text>
          </YStack>
        </XStack>
      </XStack>

      {/* Filter and Sort Controls */}
      <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={8}>
        {/* Filter pills */}
        <XStack backgroundColor={colors.cardAlt} borderRadius={8} padding={3} gap={2}>
          {(
            [
              { key: "all", label: "Todos (7D)" },
              { key: "weekdays", label: "Entre semana" },
              { key: "weekends", label: "Fin de semana" },
            ] as const
          ).map((f) => (
            <View
              key={f.key}
              paddingHorizontal={11}
              paddingVertical={5}
              borderRadius={6}
              backgroundColor={filterBy === f.key ? VIGIA_COLORS.bluePrimary : "transparent"}
              pressStyle={{ opacity: 0.8 }}
              onPress={() => setFilterBy(f.key)}
            >
              <Text
                fontSize={10.5}
                fontWeight={filterBy === f.key ? "700" : "500"}
                color={filterBy === f.key ? "#ffffff" : colors.textLabel}
                fontFamily="$body"
              >
                {f.label}
              </Text>
            </View>
          ))}
        </XStack>

        {/* Sort pills */}
        <XStack alignItems="center" gap={6}>
          <ArrowDownUp size={13} color={colors.textLabel} />
          <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
            Ordenar:
          </Text>
          {(
            [
              { key: "date", label: "Fecha" },
              { key: "traffic", label: "Tráfico" },
              { key: "conversion", label: "Conversión" },
            ] as const
          ).map((s) => (
            <View
              key={s.key}
              paddingHorizontal={9}
              paddingVertical={4}
              borderRadius={6}
              backgroundColor={sortBy === s.key ? colors.cardAlt : "transparent"}
              borderWidth={1}
              borderColor={sortBy === s.key ? VIGIA_COLORS.blueVibrant : colors.borderSoft}
              pressStyle={{ opacity: 0.8 }}
              onPress={() => setSortBy(s.key)}
            >
              <Text
                fontSize={10.5}
                fontWeight={sortBy === s.key ? "700" : "400"}
                color={sortBy === s.key ? VIGIA_COLORS.blueVibrant : colors.textLabel}
                fontFamily="$body"
              >
                {s.label}
              </Text>
            </View>
          ))}
        </XStack>
      </XStack>

      {/* ════ DESKTOP TABLE VIEW (Width >= 768px) ════ */}
      {isWide ? (
        <YStack borderWidth={1} borderColor={colors.borderSoft} borderRadius={12} overflow="hidden">
          {/* Table Header */}
          <XStack
            backgroundColor={colors.cardAlt}
            paddingVertical={10}
            paddingHorizontal={14}
            alignItems="center"
            borderBottomWidth={1}
            borderBottomColor={colors.borderSoft}
          >
            <Text flex={2} fontSize={11} fontWeight="700" color={colors.textLabel} fontFamily="$heading">
              DÍA / FECHA
            </Text>
            <Text flex={2} fontSize={11} fontWeight="700" color={colors.textLabel} fontFamily="$heading">
              VISITANTES (AFORO)
            </Text>
            <Text flex={1.8} fontSize={11} fontWeight="700" color={colors.textLabel} fontFamily="$heading">
              HORA PICO
            </Text>
            <Text flex={1.5} fontSize={11} fontWeight="700" color={colors.textLabel} fontFamily="$heading">
              PERMANENCIA
            </Text>
            <Text flex={2.2} fontSize={11} fontWeight="700" color={colors.textLabel} fontFamily="$heading">
              CONVERSIÓN (VENTAS)
            </Text>
            <Text flex={1.8} fontSize={11} fontWeight="700" color={colors.textLabel} fontFamily="$heading" textAlign="right">
              ESTADO RETAIL
            </Text>
          </XStack>

          {/* Table Rows */}
          {sortedData.map((row, idx) => {
            const isPositiveDiff = row.vsAvgPercent >= 0;
            const isWeekend = row.isWeekend;
            const isOptimal = row.conversionRate >= 84;
            const isCritical = row.conversionRate < 78;

            return (
              <XStack
                key={row.day}
                paddingVertical={12}
                paddingHorizontal={14}
                alignItems="center"
                backgroundColor={idx % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.02)"}
                borderBottomWidth={idx === sortedData.length - 1 ? 0 : 1}
                borderBottomColor={colors.borderSoft}
                hoverStyle={{ backgroundColor: "rgba(5, 110, 250, 0.07)" }}
              >
                {/* Día / Fecha */}
                <XStack flex={2} alignItems="center" gap={8}>
                  <View
                    width={34}
                    height={34}
                    borderRadius={8}
                    backgroundColor={isWeekend ? "rgba(251, 191, 36, 0.15)" : "rgba(5, 110, 250, 0.12)"}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text
                      fontSize={11}
                      fontWeight="800"
                      color={isWeekend ? VIGIA_COLORS.amberWarning : VIGIA_COLORS.blueVibrant}
                      fontFamily="$heading"
                    >
                      {row.day}
                    </Text>
                  </View>
                  <YStack>
                    <Text fontSize={12} fontWeight="700" color={colors.text} fontFamily="$body">
                      {row.day === "Lun"
                        ? "Lunes"
                        : row.day === "Mar"
                          ? "Martes"
                          : row.day === "Mié"
                            ? "Miércoles"
                            : row.day === "Jue"
                              ? "Jueves"
                              : row.day === "Vie"
                                ? "Viernes"
                                : row.day === "Sáb"
                                  ? "Sábado"
                                  : "Domingo"}
                    </Text>
                    <Text fontSize={10} color={colors.textLabel} fontFamily="$mono">
                      {row.date}
                    </Text>
                  </YStack>
                </XStack>

                {/* Visitantes & Mini Bar */}
                <YStack flex={2} gap={3}>
                  <XStack alignItems="center" gap={6}>
                    <Text fontSize={13} fontWeight="800" color={colors.text} fontFamily="$mono">
                      {row.visitors.toLocaleString("es-BO")}
                    </Text>
                    <Text
                      fontSize={10}
                      fontWeight="700"
                      color={isPositiveDiff ? VIGIA_COLORS.emeraldSuccess : VIGIA_COLORS.redDanger}
                      fontFamily="$mono"
                    >
                      {isPositiveDiff ? "+" : ""}{row.vsAvgPercent}%
                    </Text>
                  </XStack>
                  <View width={90} height={4} borderRadius={2} backgroundColor="rgba(255, 255, 255, 0.08)">
                    <View
                      height={4}
                      borderRadius={2}
                      backgroundColor={VIGIA_COLORS.blueVibrant}
                      width={`${Math.round((row.visitors / maxDailyVisitors) * 100)}%` as `${number}%`}
                    />
                  </View>
                </YStack>

                {/* Hora Pico */}
                <XStack flex={1.8} alignItems="center" gap={4}>
                  <TrendingUp size={12} color={VIGIA_COLORS.amberWarning} />
                  <YStack>
                    <Text fontSize={12} fontWeight="700" color={colors.text} fontFamily="$mono">
                      {row.peakHour}
                    </Text>
                    <Text fontSize={9.5} color={colors.textLabel} fontFamily="$mono">
                      {row.peakCount} pers.
                    </Text>
                  </YStack>
                </XStack>

                {/* Permanencia */}
                <XStack flex={1.5} alignItems="center" gap={4}>
                  <Clock size={12} color={VIGIA_COLORS.purpleMetric} />
                  <Text fontSize={12} fontWeight="700" color={colors.text} fontFamily="$mono">
                    {row.avgDwellMin} min
                  </Text>
                </XStack>

                {/* Conversión & Tickets */}
                <YStack flex={2.2} gap={3}>
                  <XStack alignItems="center" gap={6}>
                    <ShoppingCart size={12} color={isCritical ? VIGIA_COLORS.amberWarning : VIGIA_COLORS.emeraldSuccess} />
                    <Text
                      fontSize={13}
                      fontWeight="800"
                      color={isCritical ? VIGIA_COLORS.amberWarning : VIGIA_COLORS.emeraldSuccess}
                      fontFamily="$mono"
                    >
                      {row.conversionRate}%
                    </Text>
                    <Text fontSize={10} color={colors.textLabel} fontFamily="$mono">
                      ({row.transactions.toLocaleString("es-BO")} tickets)
                    </Text>
                  </XStack>
                  <View width={100} height={4} borderRadius={2} backgroundColor="rgba(255, 255, 255, 0.08)">
                    <View
                      height={4}
                      borderRadius={2}
                      backgroundColor={isCritical ? VIGIA_COLORS.amberWarning : VIGIA_COLORS.emeraldSuccess}
                      width={`${row.conversionRate}%` as `${number}%`}
                    />
                  </View>
                </YStack>

                {/* Estado Retail */}
                <View flex={1.8} alignItems="flex-end">
                  <View
                    backgroundColor={
                      isOptimal
                        ? "rgba(52, 211, 153, 0.15)"
                        : isCritical
                          ? "rgba(248, 113, 113, 0.15)"
                          : "rgba(5, 110, 250, 0.12)"
                    }
                    paddingHorizontal={8}
                    paddingVertical={4}
                    borderRadius={6}
                  >
                    <Text
                      fontSize={10}
                      fontWeight="700"
                      color={
                        isOptimal
                          ? VIGIA_COLORS.emeraldSuccess
                          : isCritical
                            ? VIGIA_COLORS.redDanger
                            : VIGIA_COLORS.blueVibrant
                      }
                      fontFamily="$body"
                    >
                      {isOptimal ? "Óptimo" : isCritical ? "Fuga de Ventas" : "Estable"}
                    </Text>
                  </View>
                </View>
              </XStack>
            );
          })}
        </YStack>
      ) : (
        /* ════ MOBILE CARD LIST VIEW ════ */
        <YStack gap={8}>
          {sortedData.map((row) => {
            const isPositiveDiff = row.vsAvgPercent >= 0;
            return (
              <XStack
                key={row.day}
                backgroundColor={colors.cardAlt}
                borderRadius={12}
                borderWidth={1}
                borderColor={colors.borderSoft}
                padding={12}
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                gap={8}
              >
                {/* Day & Date badge */}
                <XStack alignItems="center" gap={10} minWidth={110}>
                  <View
                    width={40}
                    height={40}
                    borderRadius={10}
                    backgroundColor={row.isWeekend ? "rgba(251, 191, 36, 0.15)" : "rgba(5, 110, 250, 0.12)"}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text
                      fontSize={12}
                      fontWeight="800"
                      color={row.isWeekend ? VIGIA_COLORS.amberWarning : VIGIA_COLORS.blueVibrant}
                      fontFamily="$heading"
                    >
                      {row.day}
                    </Text>
                    <Text fontSize={9} color={colors.textLabel} fontFamily="$mono">
                      {row.date}
                    </Text>
                  </View>

                  {/* Visitors count and vs-average badge */}
                  <YStack>
                    <XStack alignItems="center" gap={4}>
                      <Users size={12} color={VIGIA_COLORS.blueVibrant} />
                      <Text fontSize={15} fontWeight="800" color={colors.text} fontFamily="$mono">
                        {row.visitors.toLocaleString("es-BO")}
                      </Text>
                    </XStack>
                    <Text
                      fontSize={9.5}
                      fontWeight="700"
                      color={isPositiveDiff ? VIGIA_COLORS.emeraldSuccess : VIGIA_COLORS.redDanger}
                      fontFamily="$mono"
                    >
                      {isPositiveDiff ? "+" : ""}
                      {row.vsAvgPercent}% vs. prom.
                    </Text>
                  </YStack>
                </XStack>

                {/* Peak hour info */}
                <YStack minWidth={90}>
                  <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
                    Hora pico
                  </Text>
                  <XStack alignItems="center" gap={4}>
                    <TrendingUp size={11} color={VIGIA_COLORS.amberWarning} />
                    <Text fontSize={12} fontWeight="700" color={colors.text} fontFamily="$mono">
                      {row.peakHour}
                    </Text>
                  </XStack>
                </YStack>

                {/* Transactions and Conversion */}
                <YStack minWidth={90} alignItems="flex-end">
                  <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
                    Conversión
                  </Text>
                  <XStack alignItems="center" gap={4}>
                    <ShoppingCart size={11} color={VIGIA_COLORS.emeraldSuccess} />
                    <Text
                      fontSize={13}
                      fontWeight="800"
                      color={
                        row.conversionRate >= 80 ? VIGIA_COLORS.emeraldSuccess : VIGIA_COLORS.amberWarning
                      }
                      fontFamily="$mono"
                    >
                      {row.conversionRate}%
                    </Text>
                  </XStack>
                  <Text fontSize={9} color={colors.textLabel} fontFamily="$mono">
                    {row.transactions.toLocaleString("es-BO")} tickets
                  </Text>
                </YStack>
              </XStack>
            );
          })}
        </YStack>
      )}
    </YStack>
  );
}
