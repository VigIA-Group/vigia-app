import { HeatmapCell, MATRIX_DAYS, MATRIX_HOURS, WEEKLY_HOURLY_MATRIX } from "@/src/data/mock";
import { useColors } from "@/src/hooks/use-colors";
import { Flame, UserCheck } from "lucide-react-native";
import { useState } from "react";
import { Platform, ScrollView } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";
import { VIGIA_COLORS } from "./chart-theme";

export function TrafficHeatmapMatrix() {
  const colors = useColors();
  const [layoutWidth, setLayoutWidth] = useState<number>(0);
  const [matrixMode, setMatrixMode] = useState<"traffic" | "staffing">("traffic");
  const [selectedCell, setSelectedCell] = useState<HeatmapCell | null>(
    WEEKLY_HOURLY_MATRIX.find((c) => c.day === "Sáb" && c.hour === "18") ?? null
  );

  const maxTraffic = Math.max(...WEEKLY_HOURLY_MATRIX.map((c) => c.count));

  // Mapa rápido de acceso [day_hour]
  const cellMap = new Map<string, HeatmapCell>();
  WEEKLY_HOURLY_MATRIX.forEach((c) => cellMap.set(`${c.day}_${c.hour}`, c));

  // Cálculo de dotación de cajeros requerida según volumen
  const getRequiredCashiers = (count: number) => {
    if (count >= 180) return 4;
    if (count >= 130) return 3;
    if (count >= 70) return 2;
    return 1;
  };

  const getCellColor = (count: number, level: HeatmapCell["level"]) => {
    if (matrixMode === "staffing") {
      const cashiers = getRequiredCashiers(count);
      if (cashiers === 4) return VIGIA_COLORS.redDanger;
      if (cashiers === 3) return VIGIA_COLORS.amberWarning;
      if (cashiers === 2) return VIGIA_COLORS.blueVibrant;
      return "rgba(52, 211, 153, 0.25)";
    }

    switch (level) {
      case "peak":
        return VIGIA_COLORS.amberWarning; // #fbbf24
      case "high":
        return VIGIA_COLORS.blueVibrant; // #056EFA
      case "medium":
        return "rgba(5, 110, 250, 0.45)";
      case "low":
      default:
        return "rgba(10, 76, 232, 0.16)";
    }
  };

  const getCellTextColor = (count: number, level: HeatmapCell["level"]) => {
    if (matrixMode === "staffing") {
      const cashiers = getRequiredCashiers(count);
      return cashiers >= 3 ? "#050E1D" : "#ffffff";
    }

    switch (level) {
      case "peak":
        return "#050E1D";
      case "high":
        return "#ffffff";
      case "medium":
        return "#e2e8f0";
      case "low":
      default:
        return "rgba(255, 255, 255, 0.65)";
    }
  };

  // En desktop ancho (>750px), calcular ancho de celda dinámico para ocupar todo el espacio
  const isWide = layoutWidth >= 700;
  const availableGridWidth = Math.max(layoutWidth - 60, 560);
  const cellWidth = isWide ? Math.floor(availableGridWidth / MATRIX_HOURS.length) - 4 : 35;

  return (
    <YStack
      backgroundColor={colors.card}
      borderRadius={16}
      borderWidth={1}
      borderColor={colors.borderSoft}
      padding={18}
      gap={14}
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width - 36;
        if (w > 0 && Math.abs(w - layoutWidth) > 2) {
          setLayoutWidth(w);
        }
      }}
    >
      {/* Header with Mode Switcher */}
      <XStack justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={8}>
        <XStack alignItems="center" gap={8}>
          <View
            width={30}
            height={30}
            borderRadius={8}
            backgroundColor={
              matrixMode === "staffing"
                ? "rgba(52, 211, 153, 0.15)"
                : "rgba(251, 191, 36, 0.15)"
            }
            alignItems="center"
            justifyContent="center"
          >
            {matrixMode === "staffing" ? (
              <UserCheck size={16} color={VIGIA_COLORS.emeraldSuccess} />
            ) : (
              <Flame size={16} color={VIGIA_COLORS.amberWarning} />
            )}
          </View>
          <YStack>
            <Text fontSize={14} fontWeight="700" color={colors.text} fontFamily="$heading">
              {matrixMode === "staffing"
                ? "Matriz de Asignación de Cajas (Staffing)"
                : "Matriz Semanal de Calor: Día vs. Hora"}
            </Text>
            <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
              {matrixMode === "staffing"
                ? "Dotación óptima de cajeros por hora para evitar colas y abandono"
                : "Afluencia horaria en 14 franjas (08:00 a 21:00 h) en toda la tienda"}
            </Text>
          </YStack>
        </XStack>

        {/* Mode toggle */}
        <XStack
          backgroundColor={colors.cardAlt}
          borderRadius={8}
          padding={3}
          borderWidth={1}
          borderColor={colors.borderSoft}
          gap={2}
        >
          <View
            paddingHorizontal={10}
            paddingVertical={4}
            borderRadius={6}
            backgroundColor={matrixMode === "traffic" ? VIGIA_COLORS.bluePrimary : "transparent"}
            pressStyle={{ opacity: 0.8 }}
            onPress={() => setMatrixMode("traffic")}
          >
            <Text
              fontSize={10.5}
              fontWeight={matrixMode === "traffic" ? "700" : "500"}
              color={matrixMode === "traffic" ? "#ffffff" : colors.textLabel}
              fontFamily="$body"
            >
              Afluencia (Pers.)
            </Text>
          </View>
          <View
            paddingHorizontal={10}
            paddingVertical={4}
            borderRadius={6}
            backgroundColor={matrixMode === "staffing" ? VIGIA_COLORS.bluePrimary : "transparent"}
            pressStyle={{ opacity: 0.8 }}
            onPress={() => setMatrixMode("staffing")}
          >
            <Text
              fontSize={10.5}
              fontWeight={matrixMode === "staffing" ? "700" : "500"}
              color={matrixMode === "staffing" ? "#ffffff" : colors.textLabel}
              fontFamily="$body"
            >
              Dotación Cajas
            </Text>
          </View>
        </XStack>
      </XStack>

      {/* Legend */}
      <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={8}>
        {matrixMode === "traffic" ? (
          <XStack gap={10} alignItems="center" flexWrap="wrap">
            <XStack alignItems="center" gap={4}>
              <View width={10} height={10} borderRadius={2} backgroundColor="rgba(10, 76, 232, 0.2)" />
              <Text fontSize={10} color={colors.textLabel} fontFamily="$body">Bajo (&lt;70)</Text>
            </XStack>
            <XStack alignItems="center" gap={4}>
              <View width={10} height={10} borderRadius={2} backgroundColor="rgba(5, 110, 250, 0.5)" />
              <Text fontSize={10} color={colors.textLabel} fontFamily="$body">Medio (70-130)</Text>
            </XStack>
            <XStack alignItems="center" gap={4}>
              <View width={10} height={10} borderRadius={2} backgroundColor={VIGIA_COLORS.blueVibrant} />
              <Text fontSize={10} color={colors.textLabel} fontFamily="$body">Alto (130-180)</Text>
            </XStack>
            <XStack alignItems="center" gap={4}>
              <View width={10} height={10} borderRadius={2} backgroundColor={VIGIA_COLORS.amberWarning} />
              <Text fontSize={10} color={VIGIA_COLORS.amberWarning} fontFamily="$body" fontWeight="700">
                Pico (&gt;180)
              </Text>
            </XStack>
          </XStack>
        ) : (
          <XStack gap={10} alignItems="center" flexWrap="wrap">
            <XStack alignItems="center" gap={4}>
              <View width={10} height={10} borderRadius={2} backgroundColor="rgba(52, 211, 153, 0.25)" />
              <Text fontSize={10} color={colors.textLabel} fontFamily="$body">1 Caja</Text>
            </XStack>
            <XStack alignItems="center" gap={4}>
              <View width={10} height={10} borderRadius={2} backgroundColor={VIGIA_COLORS.blueVibrant} />
              <Text fontSize={10} color={colors.textLabel} fontFamily="$body">2 Cajas</Text>
            </XStack>
            <XStack alignItems="center" gap={4}>
              <View width={10} height={10} borderRadius={2} backgroundColor={VIGIA_COLORS.amberWarning} />
              <Text fontSize={10} color={colors.textLabel} fontFamily="$body">3 Cajas</Text>
            </XStack>
            <XStack alignItems="center" gap={4}>
              <View width={10} height={10} borderRadius={2} backgroundColor={VIGIA_COLORS.redDanger} />
              <Text fontSize={10} color={VIGIA_COLORS.redDanger} fontFamily="$body" fontWeight="700">
                4 Cajas (Refuerzo)
              </Text>
            </XStack>
          </XStack>
        )}
      </XStack>

      {/* Heatmap Grid (Scrollable on mobile, full width responsive on desktop) */}
      <ScrollView horizontal={!isWide} showsHorizontalScrollIndicator={false}>
        <YStack gap={4} width={isWide ? "100%" : undefined} minWidth={isWide ? undefined : 560}>
          {/* Header row with hours */}
          <XStack gap={4} paddingLeft={46}>
            {MATRIX_HOURS.map((hour) => (
              <View key={hour} width={cellWidth} alignItems="center">
                <Text fontSize={10} color={colors.textLabel} fontFamily="$mono">
                  {hour}h
                </Text>
              </View>
            ))}
          </XStack>

          {/* Day rows */}
          {MATRIX_DAYS.map((dayObj) => (
            <XStack key={dayObj.key} alignItems="center" gap={4}>
              {/* Day label */}
              <View width={42}>
                <Text
                  fontSize={11}
                  fontWeight={dayObj.key === "Sáb" || dayObj.key === "Dom" ? "700" : "500"}
                  color={
                    dayObj.key === "Sáb" || dayObj.key === "Dom"
                      ? VIGIA_COLORS.blueVibrant
                      : colors.text
                  }
                  fontFamily="$body"
                >
                  {dayObj.key}
                </Text>
              </View>

              {/* Hour cells */}
              {MATRIX_HOURS.map((hour) => {
                const cell = cellMap.get(`${dayObj.key}_${hour}`);
                if (!cell) return null;
                const isSelected =
                  selectedCell?.day === cell.day && selectedCell?.hour === cell.hour;
                const cashiers = getRequiredCashiers(cell.count);

                return (
                  <View
                    key={hour}
                    width={cellWidth}
                    height={28}
                    borderRadius={5}
                    backgroundColor={getCellColor(cell.count, cell.level)}
                    borderWidth={isSelected ? 2 : 0}
                    borderColor="#ffffff"
                    alignItems="center"
                    justifyContent="center"
                    pressStyle={{ opacity: 0.8 }}
                    onPress={() => setSelectedCell(cell)}
                    {...(Platform.OS === "web"
                      ? {
                          onPointerEnter: () => setSelectedCell(cell),
                        }
                      : {})}
                  >
                    <Text
                      fontSize={matrixMode === "staffing" ? 10 : 9.5}
                      fontWeight="700"
                      color={getCellTextColor(cell.count, cell.level)}
                      fontFamily="$mono"
                    >
                      {matrixMode === "staffing" ? `${cashiers}c` : cell.count}
                    </Text>
                  </View>
                );
              })}
            </XStack>
          ))}
        </YStack>
      </ScrollView>

      {/* Selected Cell Executive Feedback Pill */}
      {selectedCell && (
        <XStack
          backgroundColor={colors.cardAlt}
          borderRadius={12}
          paddingHorizontal={14}
          paddingVertical={12}
          alignItems="center"
          justifyContent="space-between"
          borderLeftWidth={4}
          borderLeftColor={getCellColor(selectedCell.count, selectedCell.level)}
          flexWrap="wrap"
          gap={10}
        >
          <XStack alignItems="center" gap={10}>
            <View
              width={28}
              height={28}
              borderRadius={7}
              backgroundColor="rgba(255, 255, 255, 0.06)"
              alignItems="center"
              justifyContent="center"
            >
              {matrixMode === "staffing" ? (
                <UserCheck size={14} color={VIGIA_COLORS.emeraldSuccess} />
              ) : (
                <Flame size={14} color={VIGIA_COLORS.amberWarning} />
              )}
            </View>
            <YStack gap={2}>
              <Text fontSize={12} color={colors.text} fontFamily="$body">
                <Text fontWeight="700">
                  {selectedCell.dayLabel} a las {selectedCell.hour}:00 h
                </Text>
                :{" "}
                <Text fontWeight="800" fontFamily="$mono" color={VIGIA_COLORS.blueVibrant}>
                  {selectedCell.count} personas
                </Text>{" "}
                (
                {selectedCell.level === "peak"
                  ? "Pico crítico de afluencia"
                  : selectedCell.level === "high"
                    ? "Afluencia alta"
                    : selectedCell.level === "medium"
                      ? "Densidad moderada"
                      : "Tránsito normal"}
                )
              </Text>
              <Text fontSize={11} color={colors.textSec} fontFamily="$body">
                Recomendación de Cajas:{" "}
                <Text fontWeight="700" color={VIGIA_COLORS.emeraldSuccess} fontFamily="$mono">
                  {getRequiredCashiers(selectedCell.count)} cajeros activos requeridos
                </Text>
              </Text>
            </YStack>
          </XStack>

          <View
            backgroundColor="rgba(255, 255, 255, 0.06)"
            paddingHorizontal={10}
            paddingVertical={5}
            borderRadius={6}
          >
            <Text fontSize={11} color={colors.textLabel} fontFamily="$mono">
              {Math.round((selectedCell.count / maxTraffic) * 100)}% capacidad max
            </Text>
          </View>
        </XStack>
      )}
    </YStack>
  );
}
