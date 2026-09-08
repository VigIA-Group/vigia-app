/**
 * ConversionChart — Gráfico de conversión para Analítica de Personas en VigIA.
 * Muestra la relación clave entre afluencia (visitantes) vs transacciones reales y tasa % de conversión.
 * Destaca el insight crítico del retail: mayor afluencia de fin de semana no implica ventas proporcionales.
 */
import { useColors } from "@/src/hooks/use-colors";
import {
  CONVERSION_7D,
  getAverageConversionRate,
} from "@/src/data/mock";
import {
  Platform,
} from "react-native";
import {
  Coins,
  ShoppingCart,
  TrendingDown,
  Users,
} from "lucide-react-native";
import { useId, useState } from "react";
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
  formatCurrency,
} from "./chart-theme";

const PAD_LEFT = 44;
const PAD_RIGHT = 22;
const PAD_TOP = 26;
const PAD_BOTTOM = 34;
const TARGET_RATE = 85.0; // Benchmark de retail óptimo
const AVG_TICKET_USD = 25; // Ticket promedio en USD

export function ConversionChart() {
  const colors = useColors();
  const rawId = useId();
  const gradId = `conv-grad-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const lossGradId = `loss-grad-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const [layoutWidth, setLayoutWidth] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"rate" | "comparison" | "financial">("rate");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(3); // Default a Sábado

  const avgRate = getAverageConversionRate();
  const height = 230;

  const viewBoxW = layoutWidth > 0 ? layoutWidth : 500;
  const chartW = Math.max(viewBoxW - PAD_LEFT - PAD_RIGHT, 100);
  const chartH = height - PAD_TOP - PAD_BOTTOM;
  const baselineY = PAD_TOP + chartH;

  // Enriquecer datos con impacto financiero
  const enrichedData = CONVERSION_7D.map((d) => {
    const targetTransactions = Math.round(d.visitors * (TARGET_RATE / 100));
    const lostTransactions = Math.max(0, targetTransactions - d.transactions);
    const lostRevenueUsd = lostTransactions * AVG_TICKET_USD;
    return {
      ...d,
      targetTransactions,
      lostTransactions,
      lostRevenueUsd,
    };
  });

  const selectedPoint = enrichedData[selectedIdx ?? 3];
  const totalLostRevenue = enrichedData.reduce((s, d) => s + d.lostRevenueUsd, 0);

  // Escala para Tasa % (70% - 90%)
  const minRate = 70;
  const maxRate = 90;
  const rateRange = maxRate - minRate;

  const ratePts: [number, number][] = enrichedData.map((d, i) => {
    const x = PAD_LEFT + (i * chartW) / (enrichedData.length - 1);
    const clampedRate = Math.min(Math.max(d.conversionRate, minRate), maxRate);
    const y = PAD_TOP + chartH - ((clampedRate - minRate) / rateRange) * chartH;
    return [x, y];
  });

  const avgY = PAD_TOP + chartH - ((avgRate - minRate) / rateRange) * chartH;
  const targetY = PAD_TOP + chartH - ((TARGET_RATE - minRate) / rateRange) * chartH;
  const ratePathD = buildMonotoneSplinePath(ratePts);
  const rateAreaD = buildMonotoneAreaPath(ratePts, baselineY);

  // Escala para Comparación (Visitantes vs Ventas)
  const maxVolume = Math.max(...enrichedData.map((d) => d.visitors));
  const groupW = chartW / enrichedData.length;
  const barW = Math.min(Math.max(groupW * 0.32, 12), 28);

  // Escala para Impacto Financiero ($)
  const maxLoss = Math.max(...enrichedData.map((d) => d.lostRevenueUsd), 100);
  const lossPts: [number, number][] = enrichedData.map((d, i) => {
    const x = PAD_LEFT + (i * chartW) / (enrichedData.length - 1);
    const y = PAD_TOP + chartH - (d.lostRevenueUsd / maxLoss) * chartH;
    return [x, y];
  });
  const lossPathD = buildMonotoneSplinePath(lossPts);
  const lossAreaD = buildMonotoneAreaPath(lossPts, baselineY);

  // Pointer tracking
  const handlePointer = (clientX: number) => {
    if (!enrichedData.length) return;
    let closestIdx = 0;
    let minDiff = Infinity;
    for (let i = 0; i < enrichedData.length; i++) {
      const px = PAD_LEFT + (i * chartW) / (enrichedData.length - 1);
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
        const w = e.nativeEvent.layout.width - 36; // descontar padding horizontal
        if (w > 0 && Math.abs(w - layoutWidth) > 2) {
          setLayoutWidth(w);
        }
      }}
    >
      {/* Header with Title & 3-Mode Switcher */}
      <XStack justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={8}>
        <YStack gap={2}>
          <XStack alignItems="center" gap={8}>
            <View
              width={28}
              height={28}
              borderRadius={8}
              backgroundColor="rgba(5, 110, 250, 0.12)"
              alignItems="center"
              justifyContent="center"
            >
              <ShoppingCart size={15} color={VIGIA_COLORS.blueVibrant} />
            </View>
            <Text fontSize={14} fontWeight="700" color={colors.text} fontFamily="$heading">
              Analítica de Conversión e Impacto Comercial
            </Text>
          </XStack>
          <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
            Personas detectadas vs. transacciones en caja y ventas no capturadas
          </Text>
        </YStack>

        {/* View mode toggle (3 Modos) */}
        <XStack
          backgroundColor={colors.cardAlt}
          borderRadius={8}
          padding={3}
          borderWidth={1}
          borderColor={colors.borderSoft}
          gap={2}
        >
          {(
            [
              { key: "rate", label: "Tasa %" },
              { key: "comparison", label: "Tráfico vs. Ventas" },
              { key: "financial", label: "Pérdida Estimada ($)" },
            ] as const
          ).map((m) => {
            const active = viewMode === m.key;
            return (
              <View
                key={m.key}
                paddingHorizontal={11}
                paddingVertical={5}
                borderRadius={6}
                backgroundColor={
                  active
                    ? m.key === "financial"
                      ? "rgba(248, 113, 113, 0.22)"
                      : VIGIA_COLORS.bluePrimary
                    : "transparent"
                }
                pressStyle={{ opacity: 0.8 }}
                onPress={() => setViewMode(m.key)}
              >
                <Text
                  fontSize={11}
                  fontWeight={active ? "700" : "500"}
                  color={
                    active
                      ? m.key === "financial"
                        ? VIGIA_COLORS.redDanger
                        : "#ffffff"
                      : colors.textLabel
                  }
                  fontFamily="$body"
                >
                  {m.label}
                </Text>
              </View>
            );
          })}
        </XStack>
      </XStack>

      {/* KPI Stats Strip */}
      <XStack gap={10} flexWrap="wrap">
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
            Conversión Promedio
          </Text>
          <Text fontSize={16} fontWeight="800" color={colors.text} fontFamily="$mono">
            {avgRate}%
          </Text>
        </View>

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
            Pico de Eficiencia
          </Text>
          <Text fontSize={16} fontWeight="800" color={VIGIA_COLORS.blueVibrant} fontFamily="$mono">
            86.4% <Text fontSize={10} color={colors.textLabel}>Lun</Text>
          </Text>
        </View>

        <View
          flex={1}
          minWidth={110}
          backgroundColor={colors.cardAlt}
          borderRadius={10}
          padding={10}
          borderLeftWidth={3}
          borderLeftColor={VIGIA_COLORS.redDanger}
        >
          <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
            Ventas No Capturadas (7D)
          </Text>
          <Text fontSize={16} fontWeight="800" color={VIGIA_COLORS.redDanger} fontFamily="$mono">
            -{formatCurrency(totalLostRevenue)}
          </Text>
        </View>
      </XStack>

      {/* Main Chart Graphic with Web Pointer Hover Tracking */}
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
            {/* Blue Gradient for Rate */}
            <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={VIGIA_COLORS.blueVibrant} stopOpacity={0.32} />
              <Stop offset="70%" stopColor={VIGIA_COLORS.blueVibrant} stopOpacity={0.06} />
              <Stop offset="100%" stopColor={VIGIA_COLORS.blueVibrant} stopOpacity={0} />
            </LinearGradient>

            {/* Red Gradient for Financial Loss */}
            <LinearGradient id={lossGradId} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={VIGIA_COLORS.redDanger} stopOpacity={0.35} />
              <Stop offset="70%" stopColor={VIGIA_COLORS.redDanger} stopOpacity={0.06} />
              <Stop offset="100%" stopColor={VIGIA_COLORS.redDanger} stopOpacity={0} />
            </LinearGradient>
          </Defs>

          {/* ════ MODO 1: Tasa % ════ */}
          {viewMode === "rate" && (
            <>
              {/* Grilla Y */}
              {[70, 75, 80, 85, 90].map((rate) => {
                const y = PAD_TOP + chartH - ((rate - minRate) / rateRange) * chartH;
                const isTarget = rate === TARGET_RATE;
                return (
                  <G key={rate}>
                    <Line
                      x1={PAD_LEFT}
                      y1={y}
                      x2={viewBoxW - PAD_RIGHT}
                      y2={y}
                      stroke={isTarget ? "rgba(52, 211, 153, 0.3)" : VIGIA_COLORS.gridDark}
                      strokeWidth={isTarget ? 1 : 0.75}
                      strokeDasharray={isTarget ? "4 3" : "3 4"}
                    />
                    <SvgText
                      x={PAD_LEFT - 8}
                      y={y + 3.5}
                      textAnchor="end"
                      fontSize={10}
                      fontFamily={isTarget ? CHART_FONTS.bold : CHART_FONTS.regular}
                      fill={isTarget ? VIGIA_COLORS.emeraldSuccess : VIGIA_COLORS.textLabelDark}
                    >
                      {rate}%
                    </SvgText>
                  </G>
                );
              })}

              {/* Average reference line */}
              <Line
                x1={PAD_LEFT}
                y1={avgY}
                x2={viewBoxW - PAD_RIGHT}
                y2={avgY}
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth={1}
                strokeDasharray="4 3"
              />
              <SvgText
                x={PAD_LEFT + 4}
                y={avgY - 4}
                fontSize={9}
                fontFamily={CHART_FONTS.medium}
                fill={VIGIA_COLORS.textLabelDark}
              >
                Promedio: {avgRate}%
              </SvgText>

              {/* Target benchmark label */}
              <SvgText
                x={viewBoxW - PAD_RIGHT}
                y={targetY - 5}
                textAnchor="end"
                fontSize={9}
                fontFamily={CHART_FONTS.bold}
                fill={VIGIA_COLORS.emeraldSuccess}
              >
                Meta Retail: {TARGET_RATE}%
              </SvgText>

              {/* Área y línea con monotone smoothing */}
              <Path d={rateAreaD} fill={`url(#${gradId})`} />
              <Path
                d={ratePathD}
                stroke={VIGIA_COLORS.blueVibrant}
                strokeWidth={2.6}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Puntos y etiquetas X */}
              {enrichedData.map((d, i) => {
                const [cx, cy] = ratePts[i];
                const isSelected = selectedIdx === i;
                const isWeekend = d.day === "Sáb" || d.day === "Dom";
                const pointColor = isWeekend ? VIGIA_COLORS.amberWarning : VIGIA_COLORS.blueVibrant;

                return (
                  <G key={d.day}>
                    <Rect
                      x={cx - 16}
                      y={PAD_TOP}
                      width={32}
                      height={chartH + 20}
                      fill="transparent"
                      onPress={() => setSelectedIdx(i)}
                    />

                    {/* Point dot */}
                    {!isSelected && (
                      <Circle
                        cx={cx}
                        cy={cy}
                        r={3.5}
                        fill={pointColor}
                        stroke={VIGIA_COLORS.navy}
                        strokeWidth={1}
                      />
                    )}

                    <SvgText
                      x={cx}
                      y={height - PAD_BOTTOM + 16}
                      textAnchor="middle"
                      fontSize={10}
                      fontFamily={isSelected ? CHART_FONTS.bold : CHART_FONTS.regular}
                      fill={isSelected ? pointColor : VIGIA_COLORS.textLabelDark}
                    >
                      {d.day}
                    </SvgText>
                  </G>
                );
              })}
            </>
          )}

          {/* ════ MODO 2: Tráfico vs. Ventas (Barras Agrupadas) ════ */}
          {viewMode === "comparison" && (
            <>
              {/* Grilla Y */}
              {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => {
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
                      {Math.round(maxVolume * frac)}
                    </SvgText>
                  </G>
                );
              })}

              {/* Legend Strip */}
              <G>
                <Rect x={viewBoxW - 190} y={PAD_TOP - 18} width={8} height={8} rx={2} fill={VIGIA_COLORS.blueVibrant} />
                <SvgText x={viewBoxW - 176} y={PAD_TOP - 11} fontSize={9.5} fontFamily={CHART_FONTS.regular} fill={VIGIA_COLORS.textLabelDark}>
                  Visitantes
                </SvgText>
                <Rect x={viewBoxW - 110} y={PAD_TOP - 18} width={8} height={8} rx={2} fill={VIGIA_COLORS.emeraldSuccess} />
                <SvgText x={viewBoxW - 96} y={PAD_TOP - 11} fontSize={9.5} fontFamily={CHART_FONTS.regular} fill={VIGIA_COLORS.textLabelDark}>
                  Tickets
                </SvgText>
              </G>

              {/* Barras agrupadas */}
              {enrichedData.map((d, i) => {
                const groupX = PAD_LEFT + i * groupW;
                const visitorH = (d.visitors / maxVolume) * chartH;
                const txH = (d.transactions / maxVolume) * chartH;
                const isSelected = selectedIdx === i;

                const vX = groupX + groupW / 2 - barW - 2;
                const tX = groupX + groupW / 2 + 2;

                return (
                  <G key={d.day}>
                    <Rect
                      x={groupX}
                      y={PAD_TOP}
                      width={groupW}
                      height={chartH + 20}
                      fill="transparent"
                      onPress={() => setSelectedIdx(i)}
                    />

                    {/* Barra Visitantes */}
                    <Rect
                      x={vX}
                      y={baselineY - visitorH}
                      width={barW}
                      height={visitorH}
                      fill={VIGIA_COLORS.blueVibrant}
                      fillOpacity={isSelected ? 1 : 0.85}
                      rx={4}
                    />

                    {/* Barra Tickets */}
                    <Rect
                      x={tX}
                      y={baselineY - txH}
                      width={barW}
                      height={txH}
                      fill={VIGIA_COLORS.emeraldSuccess}
                      fillOpacity={isSelected ? 1 : 0.85}
                      rx={4}
                    />

                    <SvgText
                      x={groupX + groupW / 2}
                      y={height - PAD_BOTTOM + 16}
                      textAnchor="middle"
                      fontSize={10}
                      fontFamily={isSelected ? CHART_FONTS.bold : CHART_FONTS.regular}
                      fill={isSelected ? "#ffffff" : VIGIA_COLORS.textLabelDark}
                    >
                      {d.day}
                    </SvgText>
                  </G>
                );
              })}
            </>
          )}

          {/* ════ MODO 3: Impacto Financiero ($) ════ */}
          {viewMode === "financial" && (
            <>
              {/* Grilla Y */}
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
                      fill={VIGIA_COLORS.redDanger}
                    >
                      -${Math.round(maxLoss * frac)}
                    </SvgText>
                  </G>
                );
              })}

              <SvgText
                x={viewBoxW - PAD_RIGHT}
                y={PAD_TOP - 8}
                textAnchor="end"
                fontSize={9.5}
                fontFamily={CHART_FONTS.bold}
                fill={VIGIA_COLORS.redDanger}
              >
                Pérdida Diaria por Abandono (Ticket ~$25)
              </SvgText>

              {/* Área y línea de pérdida */}
              <Path d={lossAreaD} fill={`url(#${lossGradId})`} />
              <Path
                d={lossPathD}
                stroke={VIGIA_COLORS.redDanger}
                strokeWidth={2.6}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Barras de fondo con altura de pérdida */}
              {enrichedData.map((d, i) => {
                const x = PAD_LEFT + (i * chartW) / (enrichedData.length - 1);
                const isSelected = selectedIdx === i;
                const cy = lossPts[i][1];

                return (
                  <G key={d.day}>
                    <Rect
                      x={x - 16}
                      y={PAD_TOP}
                      width={32}
                      height={chartH + 20}
                      fill="transparent"
                      onPress={() => setSelectedIdx(i)}
                    />

                    {!isSelected && (
                      <Circle
                        cx={x}
                        cy={cy}
                        r={3.5}
                        fill={VIGIA_COLORS.redDanger}
                        stroke={VIGIA_COLORS.navy}
                        strokeWidth={1}
                      />
                    )}

                    <SvgText
                      x={x}
                      y={height - PAD_BOTTOM + 16}
                      textAnchor="middle"
                      fontSize={10}
                      fontFamily={isSelected ? CHART_FONTS.bold : CHART_FONTS.regular}
                      fill={isSelected ? VIGIA_COLORS.redDanger : VIGIA_COLORS.textLabelDark}
                    >
                      {d.day}
                    </SvgText>
                  </G>
                );
              })}
            </>
          )}

          {/* ════ Active Hover Crosshair Overlay (Todos los Modos) ════ */}
          {selectedIdx !== null && (
            <G>
              {(() => {
                const activeX =
                  viewMode === "comparison"
                    ? PAD_LEFT + selectedIdx * groupW + groupW / 2
                    : viewMode === "financial"
                      ? lossPts[selectedIdx][0]
                      : ratePts[selectedIdx][0];

                const activeY =
                  viewMode === "comparison"
                    ? baselineY - (enrichedData[selectedIdx].visitors / maxVolume) * chartH
                    : viewMode === "financial"
                      ? lossPts[selectedIdx][1]
                      : ratePts[selectedIdx][1];

                const crossColor =
                  viewMode === "financial" ? VIGIA_COLORS.redDanger : VIGIA_COLORS.blueVibrant;

                return (
                  <>
                    {/* Laser Crosshair Line */}
                    <Line
                      x1={activeX}
                      y1={PAD_TOP}
                      x2={activeX}
                      y2={baselineY}
                      stroke={crossColor}
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                      opacity={0.85}
                    />

                    {/* Glowing Point */}
                    <Circle cx={activeX} cy={activeY} r={8} fill={crossColor} fillOpacity={0.25} />
                    <Circle cx={activeX} cy={activeY} r={4.5} fill={crossColor} stroke="#ffffff" strokeWidth={1.5} />
                  </>
                );
              })()}
            </G>
          )}
        </Svg>
      </View>

      {/* Selected Day Executive Retail Card */}
      {selectedPoint && (
        <XStack
          backgroundColor={colors.cardAlt}
          borderRadius={12}
          padding={14}
          alignItems="center"
          justifyContent="space-between"
          borderWidth={1}
          borderColor={colors.borderSoft}
          flexWrap="wrap"
          gap={10}
        >
          <YStack gap={2}>
            <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
              Desglose Operativo: <Text fontWeight="700" color={colors.text}>{selectedPoint.day} {selectedPoint.date}</Text>
            </Text>
            <XStack gap={14} marginTop={4} flexWrap="wrap">
              <XStack alignItems="center" gap={4}>
                <Users size={13} color={VIGIA_COLORS.blueVibrant} />
                <Text fontSize={13} fontWeight="700" color={colors.text} fontFamily="$mono">
                  {selectedPoint.visitors.toLocaleString("es-BO")}
                </Text>
                <Text fontSize={10} color={colors.textLabel}>visitas</Text>
              </XStack>
              <XStack alignItems="center" gap={4}>
                <ShoppingCart size={13} color={VIGIA_COLORS.emeraldSuccess} />
                <Text fontSize={13} fontWeight="700" color={colors.text} fontFamily="$mono">
                  {selectedPoint.transactions.toLocaleString("es-BO")}
                </Text>
                <Text fontSize={10} color={colors.textLabel}>ventas</Text>
              </XStack>
              <XStack alignItems="center" gap={4}>
                <Coins size={13} color={VIGIA_COLORS.redDanger} />
                <Text fontSize={13} fontWeight="700" color={VIGIA_COLORS.redDanger} fontFamily="$mono">
                  -{formatCurrency(selectedPoint.lostRevenueUsd)}
                </Text>
                <Text fontSize={10} color={colors.textLabel}>pérdida est.</Text>
              </XStack>
            </XStack>
          </YStack>

          <XStack gap={8} alignItems="center">
            <View
              backgroundColor={
                selectedPoint.conversionRate >= TARGET_RATE
                  ? "rgba(52, 211, 153, 0.15)"
                  : "rgba(251, 191, 36, 0.15)"
              }
              paddingHorizontal={12}
              paddingVertical={6}
              borderRadius={8}
              alignItems="center"
            >
              <Text
                fontSize={15}
                fontWeight="800"
                color={
                  selectedPoint.conversionRate >= TARGET_RATE
                    ? VIGIA_COLORS.emeraldSuccess
                    : VIGIA_COLORS.amberWarning
                }
                fontFamily="$mono"
              >
                {selectedPoint.conversionRate}%
              </Text>
              <Text fontSize={9} color={colors.textLabel} fontFamily="$body">
                Conversión Real
              </Text>
            </View>
          </XStack>
        </XStack>
      )}

      {/* Actionable AI Retail Recommendation Box */}
      <XStack
        backgroundColor={
          viewMode === "financial"
            ? "rgba(248, 113, 113, 0.08)"
            : "rgba(10, 76, 232, 0.08)"
        }
        borderRadius={12}
        borderWidth={1}
        borderColor={
          viewMode === "financial"
            ? "rgba(248, 113, 113, 0.25)"
            : "rgba(10, 76, 232, 0.25)"
        }
        padding={14}
        alignItems="flex-start"
        gap={12}
      >
        <TrendingDown
          size={18}
          color={viewMode === "financial" ? VIGIA_COLORS.redDanger : VIGIA_COLORS.amberWarning}
          style={{ marginTop: 2 }}
        />
        <YStack flex={1} gap={3}>
          <Text fontSize={12} fontWeight="700" color={colors.text} fontFamily="$heading">
            {viewMode === "financial"
              ? "Impacto Financiero: ~$6,875 USD perdidos en ventas no capturadas el fin de semana"
              : "Mayor afluencia de fin de semana no equivale a más ventas proporcionales"}
          </Text>
          <Text fontSize={11} color={colors.textSec} fontFamily="$body" lineHeight={16}>
            {viewMode === "financial"
              ? "La caída de conversión a 77.5% el sábado y 76.2% el domingo genera ~275 carritos abandonados. Habilitar 2 cajeros express entre 16:00 y 20:00 permite recuperar hasta un 65% de estas ventas ($4,400 USD)."
              : "El sábado concentró 1,820 personas pero con una conversión de solo 77.5%, frente al 86.4% del lunes. Reforzar el personal de cajas y asistencia en pasillos es la palanca de mayor ROI inmediato para el comercio."}
          </Text>
        </YStack>
      </XStack>
    </YStack>
  );
}
