/**
 * ProductionThroughputChart — Gráfico interactivo 1:1 de ritmo de producción y horneo continuo por hora.
 * Integra curvas suaves Spline, detección de paradas, línea de meta y crosshair láser con tooltips.
 */
import { PRODUCTION_METRICS } from "@/src/data/mock";
import { useColors } from "@/src/hooks/use-colors";
import {
  Flame,
  TrendingUp,
} from "lucide-react-native";
import { useId, useState } from "react";
import { GestureResponderEvent, Platform, View as RNView } from "react-native";
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

const PAD_LEFT = 46;
const PAD_RIGHT = 24;
const PAD_TOP = 28;
const PAD_BOTTOM = 34;

type ChartMode = "produced" | "burned" | "both";

export function ProductionThroughputChart() {
  const colors = useColors();
  const rawId = useId();
  const gradId = `prod-grad-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const burnedGradId = `burned-grad-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;

  const [mode, setMode] = useState<ChartMode>("produced");
  const [layoutWidth, setLayoutWidth] = useState<number>(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const data = PRODUCTION_METRICS.hourlyProduction;
  const targetPerHour = 500;

  // Escala Y dinámica
  const maxProduced = Math.max(...data.map((d) => d.produced), targetPerHour);
  const maxBurned = Math.max(...data.map((d) => d.burned), 25);
  const yMax = mode === "burned" ? Math.ceil(maxBurned * 1.25) : Math.ceil(maxProduced * 1.15);

  const chartHeight = 220;
  const effectiveW = Math.max(layoutWidth, 320);
  const plotW = effectiveW - PAD_LEFT - PAD_RIGHT;
  const plotH = chartHeight - PAD_TOP - PAD_BOTTOM;

  // Coordenadas
  const getX = (i: number) => PAD_LEFT + (i / (data.length - 1)) * plotW;
  const getY = (val: number) => PAD_TOP + plotH - (val / yMax) * plotH;

  const ptsProduced: [number, number][] = data.map((d, i) => [getX(i), getY(d.produced)]);
  const ptsBurned: [number, number][] = data.map((d, i) => [getX(i), getY(d.burned)]);

  const pathProduced = buildMonotoneSplinePath(ptsProduced);
  const pathProducedArea = buildMonotoneAreaPath(ptsProduced, PAD_TOP + plotH);

  const pathBurned = buildMonotoneSplinePath(ptsBurned);
  const pathBurnedArea = buildMonotoneAreaPath(ptsBurned, PAD_TOP + plotH);

  const targetY = getY(targetPerHour);

  // Mouse / Pointer handler
  const handlePointer = (evt: GestureResponderEvent) => {
    const locX = evt.nativeEvent.locationX;
    const relX = locX - PAD_LEFT;
    if (relX < 0 || relX > plotW) return;
    const step = plotW / (data.length - 1);
    const idx = Math.min(Math.max(Math.round(relX / step), 0), data.length - 1);
    setSelectedIdx(idx);
  };

  const selectedPoint = selectedIdx !== null ? data[selectedIdx] : null;

  return (
    <YStack
      backgroundColor={colors.card}
      borderRadius={16}
      borderWidth={1}
      borderColor={colors.borderSoft}
      padding={18}
      gap={14}
    >
      {/* Cabecera & Selector de Modos */}
      <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={10}>
        <YStack gap={2}>
          <XStack alignItems="center" gap={7}>
            <View
              width={26}
              height={26}
              borderRadius={6}
              backgroundColor="rgba(5, 110, 250, 0.12)"
              alignItems="center"
              justifyContent="center"
            >
              <TrendingUp size={15} color={VIGIA_COLORS.blueVibrant} />
            </View>
            <Text fontSize={15} fontWeight="700" color={colors.text} fontFamily="$heading">
              Rendimiento y Ritmo de Horneo Continuo (Throughput)
            </Text>
          </XStack>
          <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
            Conteo de empanadas por cámara cenital (cam-003) en cinta transportadora vs. Meta horaria
          </Text>
        </YStack>

        {/* Modos */}
        <XStack
          backgroundColor={colors.bg}
          borderRadius={9}
          padding={3}
          borderWidth={1}
          borderColor={colors.borderSoft}
          gap={3}
        >
          <View
            paddingHorizontal={10}
            paddingVertical={5}
            borderRadius={7}
            backgroundColor={mode === "produced" ? VIGIA_COLORS.blueVibrant : "transparent"}
            pressStyle={{ opacity: 0.8 }}
            onPress={() => setMode("produced")}
          >
            <Text
              fontSize={10.5}
              fontWeight="700"
              color={mode === "produced" ? "#fff" : colors.textLabel}
              fontFamily="$body"
            >
              Piezas Producidas
            </Text>
          </View>

          <View
            paddingHorizontal={10}
            paddingVertical={5}
            borderRadius={7}
            backgroundColor={mode === "burned" ? VIGIA_COLORS.redDanger : "transparent"}
            pressStyle={{ opacity: 0.8 }}
            onPress={() => setMode("burned")}
          >
            <Text
              fontSize={10.5}
              fontWeight="700"
              color={mode === "burned" ? "#fff" : colors.textLabel}
              fontFamily="$body"
            >
              Quemadas (QC)
            </Text>
          </View>

          <View
            paddingHorizontal={10}
            paddingVertical={5}
            borderRadius={7}
            backgroundColor={mode === "both" ? colors.card : "transparent"}
            pressStyle={{ opacity: 0.8 }}
            onPress={() => setMode("both")}
          >
            <Text
              fontSize={10.5}
              fontWeight="700"
              color={mode === "both" ? colors.text : colors.textLabel}
              fontFamily="$body"
            >
              Vista Combinada
            </Text>
          </View>
        </XStack>
      </XStack>

      {/* Métricas rápidas de la línea */}
      <XStack gap={10} flexWrap="wrap">
        <YStack
          flex={1}
          minWidth={110}
          backgroundColor={colors.bg}
          padding={10}
          borderRadius={10}
          borderWidth={1}
          borderColor={colors.borderSoft}
        >
          <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
            Ritmo Promedio
          </Text>
          <Text fontSize={16} fontWeight="800" color={VIGIA_COLORS.blueVibrant} fontFamily="$mono">
            {PRODUCTION_METRICS.averagePph} pzas/h
          </Text>
        </YStack>

        <YStack
          flex={1}
          minWidth={110}
          backgroundColor={colors.bg}
          padding={10}
          borderRadius={10}
          borderWidth={1}
          borderColor={colors.borderSoft}
        >
          <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
            Pico Productivo
          </Text>
          <Text fontSize={16} fontWeight="800" color={VIGIA_COLORS.emeraldSuccess} fontFamily="$mono">
            630 pzas (11:00)
          </Text>
        </YStack>

        <YStack
          flex={1}
          minWidth={110}
          backgroundColor={colors.bg}
          padding={10}
          borderRadius={10}
          borderWidth={1}
          borderColor={colors.borderSoft}
        >
          <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
            Pico de Quemadas
          </Text>
          <Text fontSize={16} fontWeight="800" color={VIGIA_COLORS.redDanger} fontFamily="$mono">
            18 pzas (10:00)
          </Text>
        </YStack>

        <YStack
          flex={1}
          minWidth={110}
          backgroundColor={colors.bg}
          padding={10}
          borderRadius={10}
          borderWidth={1}
          borderColor={colors.borderSoft}
        >
          <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
            Meta del Turno
          </Text>
          <Text fontSize={16} fontWeight="800" color={colors.text} fontFamily="$mono">
            500 pzas/h
          </Text>
        </YStack>
      </XStack>

      {/* Contenedor del Gráfico SVG */}
      <RNView
        style={{ width: "100%", height: chartHeight }}
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          if (w > 0 && Math.abs(w - layoutWidth) > 2) {
            setLayoutWidth(w);
          }
        }}
        {...(Platform.OS === "web"
          ? {
              onPointerMove: (e: any) => handlePointer(e),
              onPointerLeave: () => setSelectedIdx(null),
            }
          : {})}
      >
        {layoutWidth > 0 && (
          <Svg width={layoutWidth} height={chartHeight}>
            <Defs>
              <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={VIGIA_COLORS.blueVibrant} stopOpacity="0.32" />
                <Stop offset="100%" stopColor={VIGIA_COLORS.blueVibrant} stopOpacity="0.0" />
              </LinearGradient>
              <LinearGradient id={burnedGradId} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={VIGIA_COLORS.redDanger} stopOpacity="0.4" />
                <Stop offset="100%" stopColor={VIGIA_COLORS.redDanger} stopOpacity="0.0" />
              </LinearGradient>
            </Defs>

            {/* Cuadrícula horizontal */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const y = PAD_TOP + plotH * (1 - pct);
              const val = Math.round(yMax * pct);
              return (
                <G key={i}>
                  <Line
                    x1={PAD_LEFT}
                    y1={y}
                    x2={PAD_LEFT + plotW}
                    y2={y}
                    stroke={VIGIA_COLORS.gridDark}
                    strokeWidth={1}
                    strokeDasharray={pct === 0 ? undefined : "3 3"}
                  />
                  <SvgText
                    x={PAD_LEFT - 8}
                    y={y + 3.5}
                    textAnchor="end"
                    fontSize={10}
                    fontFamily={CHART_FONTS.regular}
                    fill={VIGIA_COLORS.textLabelDark}
                  >
                    {val}
                  </SvgText>
                </G>
              );
            })}

            {/* Línea de Meta (solo si se muestra producción) */}
            {mode !== "burned" && targetY >= PAD_TOP && (
              <G>
                <Line
                  x1={PAD_LEFT}
                  y1={targetY}
                  x2={PAD_LEFT + plotW}
                  y2={targetY}
                  stroke={VIGIA_COLORS.emeraldSuccess}
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
                <SvgText
                  x={PAD_LEFT + plotW - 4}
                  y={targetY - 5}
                  textAnchor="end"
                  fontSize={9.5}
                  fontFamily={CHART_FONTS.bold}
                  fill={VIGIA_COLORS.emeraldSuccess}
                >
                  Meta: {targetPerHour} u/h
                </SvgText>
              </G>
            )}

            {/* Áreas de Parada de Línea (Downtime Shading) */}
            {data.map((d, i) => {
              if (d.downtimeMinutes <= 0) return null;
              const x = getX(i);
              const colW = plotW / (data.length - 1);
              return (
                <G key={`dt-band-${i}`}>
                  <Rect
                    x={x - colW * 0.4}
                    y={PAD_TOP}
                    width={colW * 0.8}
                    height={plotH}
                    fill="rgba(248, 113, 113, 0.08)"
                    rx={4}
                  />
                  <Line
                    x1={x}
                    y1={PAD_TOP}
                    x2={x}
                    y2={PAD_TOP + plotH}
                    stroke="rgba(248, 113, 113, 0.3)"
                    strokeWidth={1}
                    strokeDasharray="2 2"
                  />
                  <SvgText
                    x={x}
                    y={PAD_TOP + 12}
                    textAnchor="middle"
                    fontSize={8.5}
                    fontFamily={CHART_FONTS.bold}
                    fill={VIGIA_COLORS.redDanger}
                  >
                    Parada {d.downtimeMinutes}m
                  </SvgText>
                </G>
              );
            })}

            {/* Curvas de Producción */}
            {(mode === "produced" || mode === "both") && (
              <>
                <Path d={pathProducedArea} fill={`url(#${gradId})`} />
                <Path
                  d={pathProduced}
                  fill="none"
                  stroke={VIGIA_COLORS.blueVibrant}
                  strokeWidth={2.5}
                />
              </>
            )}

            {/* Curvas de Quemadas */}
            {(mode === "burned" || mode === "both") && (
              <>
                {mode === "burned" && <Path d={pathBurnedArea} fill={`url(#${burnedGradId})`} />}
                <Path
                  d={pathBurned}
                  fill="none"
                  stroke={VIGIA_COLORS.redDanger}
                  strokeWidth={2}
                  strokeDasharray={mode === "both" ? "4 3" : undefined}
                />
              </>
            )}

            {/* Puntos y Etiquetas del Eje X */}
            {data.map((d, i) => {
              const x = getX(i);
              const yP = getY(d.produced);
              const yB = getY(d.burned);
              const isSel = selectedIdx === i;

              return (
                <G key={i}>
                  {/* Etiqueta Eje X */}
                  <SvgText
                    x={x}
                    y={PAD_TOP + plotH + 18}
                    textAnchor="middle"
                    fontSize={isSel ? 10.5 : 9.5}
                    fontFamily={isSel ? CHART_FONTS.bold : CHART_FONTS.regular}
                    fill={isSel ? VIGIA_COLORS.blueVibrant : VIGIA_COLORS.textLabelDark}
                  >
                    {d.hour}
                  </SvgText>

                  {/* Punto Producido */}
                  {(mode === "produced" || mode === "both") && (
                    <>
                      {isSel && (
                        <Circle
                          cx={x}
                          cy={yP}
                          r={7}
                          fill="none"
                          stroke={VIGIA_COLORS.blueVibrant}
                          strokeWidth={2}
                          opacity={0.5}
                        />
                      )}
                      <Circle
                        cx={x}
                        cy={yP}
                        r={isSel ? 4.5 : 3}
                        fill={VIGIA_COLORS.blueVibrant}
                        stroke={colors.card}
                        strokeWidth={1.5}
                      />
                    </>
                  )}

                  {/* Punto Quemadas */}
                  {(mode === "burned" || mode === "both") && (
                    <>
                      {isSel && (
                        <Circle
                          cx={x}
                          cy={yB}
                          r={7}
                          fill="none"
                          stroke={VIGIA_COLORS.redDanger}
                          strokeWidth={2}
                          opacity={0.5}
                        />
                      )}
                      <Circle
                        cx={x}
                        cy={yB}
                        r={isSel ? 4.5 : 3}
                        fill={VIGIA_COLORS.redDanger}
                        stroke={colors.card}
                        strokeWidth={1.5}
                      />
                    </>
                  )}
                </G>
              );
            })}

            {/* Láser Vertical de Seguimiento (Crosshair) */}
            {selectedIdx !== null && (
              <Line
                x1={getX(selectedIdx)}
                y1={PAD_TOP}
                x2={getX(selectedIdx)}
                y2={PAD_TOP + plotH}
                stroke={VIGIA_COLORS.blueCyan}
                strokeWidth={1.5}
                strokeDasharray="3 3"
                opacity={0.8}
              />
            )}
          </Svg>
        )}
      </RNView>

      {/* Tooltip Detallado del Punto Seleccionado */}
      {selectedPoint && (
        <XStack
          backgroundColor={colors.bg}
          borderRadius={12}
          borderWidth={1}
          borderColor={VIGIA_COLORS.blueVibrant}
          padding={12}
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={10}
        >
          <XStack alignItems="center" gap={8}>
            <View
              backgroundColor="rgba(5, 110, 250, 0.15)"
              paddingHorizontal={8}
              paddingVertical={4}
              borderRadius={6}
            >
              <Text fontSize={12} fontWeight="800" color={VIGIA_COLORS.blueVibrant} fontFamily="$mono">
                {selectedPoint.hour}
              </Text>
            </View>
            <YStack>
              <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
                Hornos activos: {selectedPoint.activeOvens} industriales
              </Text>
              <Text fontSize={13} fontWeight="800" color={colors.text} fontFamily="$mono">
                {selectedPoint.produced} empanadas producidas
              </Text>
            </YStack>
          </XStack>

          <XStack gap={14} alignItems="center">
            <YStack alignItems="flex-end">
              <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
                Quemadas detectadas
              </Text>
              <Text fontSize={13} fontWeight="700" color={VIGIA_COLORS.redDanger} fontFamily="$mono">
                {selectedPoint.burned} pzas ({((selectedPoint.burned / selectedPoint.produced) * 100).toFixed(1)}%)
              </Text>
            </YStack>

            {selectedPoint.downtimeMinutes > 0 && (
              <YStack alignItems="flex-end">
                <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
                  Parada de cinta
                </Text>
                <Text fontSize={13} fontWeight="700" color={VIGIA_COLORS.amberWarning} fontFamily="$mono">
                  {selectedPoint.downtimeMinutes} min detenida
                </Text>
              </YStack>
            )}
          </XStack>
        </XStack>
      )}

      {/* Diagnóstico Predictivo de IA */}
      <XStack
        backgroundColor="rgba(5, 110, 250, 0.06)"
        borderRadius={10}
        padding={11}
        borderWidth={1}
        borderColor="rgba(5, 110, 250, 0.18)"
        gap={9}
        alignItems="center"
      >
        <Flame size={18} color={VIGIA_COLORS.redDanger} />
        <Text fontSize={11} color={colors.textSec} fontFamily="$body" flex={1} lineHeight={16}>
          <Text fontWeight="700" color={colors.text} fontFamily="$body">
            Alerta de Horneo (Horno 2):
          </Text>{" "}
          El incremento de empanadas quemadas (18 pzas a las 10:00 y 16 pzas a las 11:00) coincide con una
          desviación de +18°C en la termocupla de salida. Se aconseja calibrar antes del turno tarde.
        </Text>
      </XStack>
    </YStack>
  );
}
