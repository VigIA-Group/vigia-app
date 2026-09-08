/**
 * BidirectionalTrafficChart — Conteo bidireccional de flujo: Entradas vs. Salidas por hora.
 * Muestra el balance entre clientes ingresando y saliendo, y calcula la ocupación neta en tienda.
 */
import { useColors } from "@/src/hooks/use-colors";
import { BIDIRECTIONAL_HOURLY_TODAY } from "@/src/data/mock";
import {
  ArrowDownLeft,
  ArrowUpRight,
  GitFork,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react-native";
import { useId, useState } from "react";
import { Platform } from "react-native";
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import { Text, View, XStack, YStack } from "tamagui";
import {
  CHART_FONTS,
  VIGIA_COLORS,
  buildMonotoneAreaPath,
  buildMonotoneSplinePath,
} from "./chart-theme";

const PAD_LEFT = 42;
const PAD_RIGHT = 20;
const PAD_TOP = 26;
const PAD_BOTTOM = 34;

export function BidirectionalTrafficChart() {
  const colors = useColors();
  const rawId = useId();
  const gradId = `bidi-grad-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const [layoutWidth, setLayoutWidth] = useState<number>(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(4); // Default 10:00

  const data = BIDIRECTIONAL_HOURLY_TODAY;
  const height = 215;

  const viewBoxW = layoutWidth > 0 ? layoutWidth : 500;
  const chartW = Math.max(viewBoxW - PAD_LEFT - PAD_RIGHT, 100);
  const chartH = height - PAD_TOP - PAD_BOTTOM;
  const baselineY = PAD_TOP + chartH;

  const totalEntries = data.reduce((s, d) => s + d.entries, 0);
  const totalExits = data.reduce((s, d) => s + d.exits, 0);
  const currentNet = data[data.length - 1]?.netOccupancy ?? 0;

  const allVals = data.flatMap((d) => [d.entries, d.exits, d.netOccupancy]);
  const maxVal = Math.max(...allVals, 1);
  const xStep = data.length > 1 ? chartW / (data.length - 1) : chartW;

  const entryPts: [number, number][] = data.map((d, i) => [
    PAD_LEFT + i * xStep,
    PAD_TOP + chartH - (d.entries / maxVal) * chartH,
  ]);

  const exitPts: [number, number][] = data.map((d, i) => [
    PAD_LEFT + i * xStep,
    PAD_TOP + chartH - (d.exits / maxVal) * chartH,
  ]);

  const netPts: [number, number][] = data.map((d, i) => [
    PAD_LEFT + i * xStep,
    PAD_TOP + chartH - (d.netOccupancy / maxVal) * chartH,
  ]);

  const entryPathD = buildMonotoneSplinePath(entryPts);
  const exitPathD = buildMonotoneSplinePath(exitPts);
  const netAreaD = buildMonotoneAreaPath(netPts, baselineY);

  const selectedPoint = data[selectedIdx ?? 4];
  const deltaSelected = selectedPoint
    ? selectedPoint.entries - selectedPoint.exits
    : 0;

  // Pointer tracking
  const handlePointer = (clientX: number) => {
    if (!data.length) return;
    let closestIdx = 0;
    let minDiff = Infinity;
    for (let i = 0; i < data.length; i++) {
      const px = PAD_LEFT + i * xStep;
      const diff = Math.abs(px - clientX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    }
    setSelectedIdx(closestIdx);
  };

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
            <GitFork size={16} color={VIGIA_COLORS.blueVibrant} />
          </View>
          <YStack>
            <Text fontSize={14} fontWeight="700" color={colors.text} fontFamily="$heading">
              Flujo Bidireccional de Accesos (cam-001)
            </Text>
            <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
              Entradas vs. Salidas continuas y balance acumulado en sala
            </Text>
          </YStack>
        </XStack>

        {/* Legend */}
        <XStack gap={12} alignItems="center">
          <XStack alignItems="center" gap={4}>
            <View width={12} height={3} borderRadius={2} backgroundColor={VIGIA_COLORS.blueVibrant} />
            <Text fontSize={10} color={colors.textLabel} fontFamily="$body">Entradas</Text>
          </XStack>
          <XStack alignItems="center" gap={4}>
            <View width={12} height={3} borderRadius={2} backgroundColor={VIGIA_COLORS.emeraldSuccess} />
            <Text fontSize={10} color={colors.textLabel} fontFamily="$body">Salidas</Text>
          </XStack>
          <XStack alignItems="center" gap={4}>
            <View width={12} height={3} borderRadius={2} backgroundColor={VIGIA_COLORS.blueCyan} />
            <Text fontSize={10} color={colors.textLabel} fontFamily="$body">En Tienda</Text>
          </XStack>
        </XStack>
      </XStack>

      {/* Mini summary strip */}
      <XStack gap={8} flexWrap="wrap">
        <View
          flex={1}
          minWidth={110}
          backgroundColor={colors.cardAlt}
          borderRadius={10}
          padding={10}
          borderLeftWidth={3}
          borderLeftColor={VIGIA_COLORS.blueVibrant}
        >
          <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
            Entradas Hoy
          </Text>
          <XStack alignItems="center" gap={4} marginTop={2}>
            <ArrowDownLeft size={13} color={VIGIA_COLORS.blueVibrant} />
            <Text fontSize={16} fontWeight="800" color={colors.text} fontFamily="$mono">
              {totalEntries.toLocaleString("es-BO")}
            </Text>
          </XStack>
        </View>

        <View
          flex={1}
          minWidth={110}
          backgroundColor={colors.cardAlt}
          borderRadius={10}
          padding={10}
          borderLeftWidth={3}
          borderLeftColor={VIGIA_COLORS.emeraldSuccess}
        >
          <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
            Salidas Hoy
          </Text>
          <XStack alignItems="center" gap={4} marginTop={2}>
            <ArrowUpRight size={13} color={VIGIA_COLORS.emeraldSuccess} />
            <Text fontSize={16} fontWeight="800" color={colors.text} fontFamily="$mono">
              {totalExits.toLocaleString("es-BO")}
            </Text>
          </XStack>
        </View>

        <View
          flex={1}
          minWidth={110}
          backgroundColor={colors.cardAlt}
          borderRadius={10}
          padding={10}
          borderLeftWidth={3}
          borderLeftColor={VIGIA_COLORS.blueCyan}
        >
          <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
            En Tienda (15:45)
          </Text>
          <XStack alignItems="center" gap={4} marginTop={2}>
            <Users size={13} color={VIGIA_COLORS.blueCyan} />
            <Text fontSize={16} fontWeight="800" color={VIGIA_COLORS.blueCyan} fontFamily="$mono">
              {currentNet}
            </Text>
          </XStack>
        </View>
      </XStack>

      {/* Main Chart Graphic with Web Hover Tracking */}
      <View
        style={{ width: "100%", height }}
        {...(Platform.OS === "web"
          ? {
              onPointerMove: (e: any) => {
                const rect = e.currentTarget?.getBoundingClientRect?.();
                const x = rect ? e.clientX - rect.left : e.nativeEvent?.offsetX ?? 0;
                handlePointer(x);
              },
            }
          : {
              onTouchMove: (e: any) => {
                handlePointer(e.nativeEvent.locationX);
              },
            })}
      >
        <Svg
          viewBox={`0 0 ${viewBoxW} ${height}`}
          width="100%"
          height={height}
        >
          <Defs>
            <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={VIGIA_COLORS.blueCyan} stopOpacity={0.25} />
              <Stop offset="75%" stopColor={VIGIA_COLORS.blueCyan} stopOpacity={0.04} />
              <Stop offset="100%" stopColor={VIGIA_COLORS.blueCyan} stopOpacity={0} />
            </LinearGradient>
          </Defs>

          {/* Grid lines */}
          {[0, 0.33, 0.66, 1].map((frac, i) => {
            const y = PAD_TOP + chartH * (1 - frac);
            return (
              <G key={i}>
                <Line
                  x1={PAD_LEFT}
                  y1={y}
                  x2={viewBoxW - PAD_RIGHT}
                  y2={y}
                  stroke={VIGIA_COLORS.gridDark}
                  strokeWidth={0.75}
                  strokeDasharray="3 4"
                />
                <SvgText
                  x={PAD_LEFT - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize={10}
                  fontFamily={CHART_FONTS.regular}
                  fill={VIGIA_COLORS.textLabelDark}
                >
                  {Math.round(maxVal * frac)}
                </SvgText>
              </G>
            );
          })}

          {/* Net occupancy shaded area */}
          <Path d={netAreaD} fill={`url(#${gradId})`} />

          {/* Lines */}
          <Path
            d={entryPathD}
            stroke={VIGIA_COLORS.blueVibrant}
            strokeWidth={2.4}
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d={exitPathD}
            stroke={VIGIA_COLORS.emeraldSuccess}
            strokeWidth={2.2}
            fill="none"
            strokeLinecap="round"
          />

          {/* Interactive touch targets & X labels */}
          {data.map((d, i) => {
            const cx = PAD_LEFT + i * xStep;
            const isSelected = selectedIdx === i;
            const showLabel = i % 2 === 0;

            return (
              <G key={d.hour}>
                <Rect
                  x={cx - xStep / 2}
                  y={PAD_TOP}
                  width={xStep}
                  height={chartH + 20}
                  fill="transparent"
                  onPress={() => setSelectedIdx(i)}
                />

                {!isSelected && (
                  <Circle cx={cx} cy={entryPts[i][1]} r={2.5} fill={VIGIA_COLORS.blueVibrant} />
                )}

                {showLabel && (
                  <SvgText
                    x={cx}
                    y={height - PAD_BOTTOM + 16}
                    textAnchor="middle"
                    fontSize={10}
                    fontFamily={isSelected ? CHART_FONTS.bold : CHART_FONTS.regular}
                    fill={isSelected ? "#ffffff" : VIGIA_COLORS.textLabelDark}
                  >
                    {d.hour}h
                  </SvgText>
                )}
              </G>
            );
          })}

          {/* Active Hover Crosshair Overlay */}
          {selectedIdx !== null && (
            <G>
              {/* Laser Crosshair */}
              <Line
                x1={PAD_LEFT + selectedIdx * xStep}
                y1={PAD_TOP}
                x2={PAD_LEFT + selectedIdx * xStep}
                y2={baselineY}
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth={1.2}
                strokeDasharray="3 3"
              />

              {/* Glowing Indicator Dots */}
              <Circle
                cx={PAD_LEFT + selectedIdx * xStep}
                cy={entryPts[selectedIdx][1]}
                r={5.5}
                fill={VIGIA_COLORS.blueVibrant}
                stroke="#ffffff"
                strokeWidth={1.5}
              />
              <Circle
                cx={PAD_LEFT + selectedIdx * xStep}
                cy={exitPts[selectedIdx][1]}
                r={5.5}
                fill={VIGIA_COLORS.emeraldSuccess}
                stroke="#ffffff"
                strokeWidth={1.5}
              />
              <Circle
                cx={PAD_LEFT + selectedIdx * xStep}
                cy={netPts[selectedIdx][1]}
                r={4}
                fill={VIGIA_COLORS.blueCyan}
              />
            </G>
          )}
        </Svg>
      </View>

      {/* Selected Hour Details */}
      {selectedPoint && (
        <XStack
          backgroundColor={colors.cardAlt}
          borderRadius={12}
          padding={12}
          justifyContent="space-between"
          alignItems="center"
          borderWidth={1}
          borderColor={colors.borderSoft}
          flexWrap="wrap"
          gap={10}
        >
          <XStack alignItems="center" gap={8}>
            <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
              Franja de las <Text fontWeight="700" color={colors.text}>{selectedPoint.hour}:00 h</Text>
            </Text>

            <View
              backgroundColor={
                deltaSelected >= 0
                  ? "rgba(5, 110, 250, 0.12)"
                  : "rgba(52, 211, 153, 0.12)"
              }
              paddingHorizontal={8}
              paddingVertical={3}
              borderRadius={6}
            >
              <XStack alignItems="center" gap={4}>
                {deltaSelected >= 0 ? (
                  <TrendingUp size={11} color={VIGIA_COLORS.blueVibrant} />
                ) : (
                  <TrendingDown size={11} color={VIGIA_COLORS.emeraldSuccess} />
                )}
                <Text
                  fontSize={10}
                  fontWeight="700"
                  color={deltaSelected >= 0 ? VIGIA_COLORS.blueVibrant : VIGIA_COLORS.emeraldSuccess}
                  fontFamily="$mono"
                >
                  {deltaSelected >= 0 ? `+${deltaSelected}` : deltaSelected} pers (neto)
                </Text>
              </XStack>
            </View>
          </XStack>

          <XStack gap={16}>
            <XStack alignItems="center" gap={4}>
              <View width={7} height={7} borderRadius={3.5} backgroundColor={VIGIA_COLORS.blueVibrant} />
              <Text fontSize={12} color={colors.text} fontFamily="$mono">
                +{selectedPoint.entries} ent.
              </Text>
            </XStack>
            <XStack alignItems="center" gap={4}>
              <View width={7} height={7} borderRadius={3.5} backgroundColor={VIGIA_COLORS.emeraldSuccess} />
              <Text fontSize={12} color={colors.text} fontFamily="$mono">
                -{selectedPoint.exits} sal.
              </Text>
            </XStack>
            <XStack alignItems="center" gap={4}>
              <View width={7} height={7} borderRadius={3.5} backgroundColor={VIGIA_COLORS.blueCyan} />
              <Text fontSize={12} fontWeight="700" color={VIGIA_COLORS.blueCyan} fontFamily="$mono">
                {selectedPoint.netOccupancy} en sala
              </Text>
            </XStack>
          </XStack>
        </XStack>
      )}
    </YStack>
  );
}
