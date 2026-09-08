/**
 * SvgLineChart — Gráfico de línea optimizado para VigIA.
 * Implementa curvas suaves Monotone Cubic Spline, degradado de área sutil,
 * tooltips estilizados con paleta VigIA Navy y tipografía Plus Jakarta Sans.
 */
import { useId, useState } from "react";
import { GestureResponderEvent, Platform, View } from "react-native";
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
import {
  CHART_FONTS,
  VIGIA_COLORS,
  buildMonotoneAreaPath,
  buildMonotoneSplinePath,
} from "./chart-theme";

const PAD_LEFT = 42;
const PAD_RIGHT = 20;
const PAD_TOP = 24;
const PAD_BOTTOM = 32;

function formatLabel(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return String(Math.round(v));
}

export interface SvgLineChartProps<T extends Record<string, unknown>> {
  data: T[];
  xKey: keyof T;
  yKey: keyof T;
  color?: string;
  compareData?: T[];
  compareColor?: string;
  height?: number;
  labelColor?: string;
  gridColor?: string;
  showArea?: boolean;
  showAverage?: boolean;
  /** How many x-axis labels to show (default: show all) */
  xLabelStep?: number;
  xLabelSuffix?: string;
  onPointPress?: (label: string, value: number, index: number) => void;
}

export function SvgLineChart<T extends Record<string, unknown>>({
  data,
  xKey,
  yKey,
  color = VIGIA_COLORS.blueVibrant,
  compareData,
  compareColor = "#475569",
  height = 200,
  labelColor = VIGIA_COLORS.textLabelDark,
  gridColor = VIGIA_COLORS.gridDark,
  showArea = true,
  showAverage = false,
  xLabelStep = 1,
  xLabelSuffix = "",
  onPointPress,
}: SvgLineChartProps<T>) {
  const [layoutWidth, setLayoutWidth] = useState<number>(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const rawId = useId();
  const gradId = `line-area-grad-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;

  // Utilizar el ancho real medido del contenedor para rendering 1:1
  const viewBoxW = layoutWidth > 0 ? layoutWidth : 500;
  const chartW = Math.max(viewBoxW - PAD_LEFT - PAD_RIGHT, 100);
  const chartH = height - PAD_TOP - PAD_BOTTOM;
  const baselineY = PAD_TOP + chartH;

  const values = data.map((d) => Number(d[yKey]));
  const compareValues = compareData ? compareData.map((d) => Number(d[yKey])) : [];
  const maxVal = Math.max(...values, ...compareValues, 1);
  const avgVal = values.reduce((s, v) => s + v, 0) / (values.length || 1);

  const xStep = data.length > 1 ? chartW / (data.length - 1) : chartW;

  const pts: [number, number][] = data.map((d, i) => [
    PAD_LEFT + i * xStep,
    PAD_TOP + chartH - (Number(d[yKey]) / maxVal) * chartH,
  ]);

  const cmpPts: [number, number][] = (compareData ?? []).map((d, i) => [
    PAD_LEFT + i * xStep,
    PAD_TOP + chartH - (Number(d[yKey]) / maxVal) * chartH,
  ]);

  const yTicks = [0, 0.25, 0.5, 0.75, 1];
  const pathD = buildMonotoneSplinePath(pts);
  const areaD = showArea ? buildMonotoneAreaPath(pts, baselineY) : "";
  const cmpPathD = buildMonotoneSplinePath(cmpPts);

  const avgY = PAD_TOP + chartH - (avgVal / maxVal) * chartH;

  // Interacción Web Hover (PointerMove)
  const handlePointer = (locationX: number) => {
    if (!pts.length) return;
    let closestIdx = 0;
    let minDiff = Infinity;
    for (let i = 0; i < pts.length; i++) {
      const diff = Math.abs(pts[i][0] - locationX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    }
    setSelectedIdx(closestIdx);
    onPointPress?.(String(data[closestIdx][xKey]), Number(data[closestIdx][yKey]), closestIdx);
  };

  return (
    <View
      style={{ width: "100%", height }}
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width;
        if (w > 0 && Math.abs(w - layoutWidth) > 2) {
          setLayoutWidth(w);
        }
      }}
      // Web Desktop mouse tracking
      {...(Platform.OS === "web"
        ? {
            onPointerMove: (e: any) => {
              const rect = e.currentTarget?.getBoundingClientRect?.();
              const x = rect ? e.clientX - rect.left : e.nativeEvent?.offsetX ?? 0;
              handlePointer(x);
            },
            onPointerLeave: () => {
              setSelectedIdx(null);
            },
          }
        : {
            onTouchMove: (e: GestureResponderEvent) => {
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
          {/* Subtle area gradient under curve */}
          <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={color} stopOpacity={0.32} />
            <Stop offset="60%" stopColor={color} stopOpacity={0.08} />
            <Stop offset="100%" stopColor={color} stopOpacity={0.0} />
          </LinearGradient>
        </Defs>

        {/* Y grid lines (discrete & subtle) */}
        {yTicks.map((frac, i) => {
          const y = PAD_TOP + chartH * (1 - frac);
          return (
            <G key={i}>
              <Line
                x1={PAD_LEFT}
                y1={y}
                x2={viewBoxW - PAD_RIGHT}
                y2={y}
                stroke={gridColor}
                strokeWidth={0.75}
                strokeDasharray={frac === 0 ? undefined : "3 4"}
              />
              <SvgText
                x={PAD_LEFT - 8}
                y={y + 3.5}
                textAnchor="end"
                fontSize={10}
                fontFamily={CHART_FONTS.regular}
                fill={labelColor}
              >
                {formatLabel(maxVal * frac)}
              </SvgText>
            </G>
          );
        })}

        {/* Línea de Promedio opcional */}
        {showAverage && (
          <G>
            <Line
              x1={PAD_LEFT}
              y1={avgY}
              x2={viewBoxW - PAD_RIGHT}
              y2={avgY}
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            <SvgText
              x={viewBoxW - PAD_RIGHT}
              y={avgY - 4}
              textAnchor="end"
              fontSize={9}
              fontFamily={CHART_FONTS.medium}
              fill={labelColor}
            >
              Promedio: {Math.round(avgVal)}
            </SvgText>
          </G>
        )}

        {/* Comparison line (dashed monotone) */}
        {compareData && (
          <Path
            d={cmpPathD}
            stroke={compareColor}
            strokeWidth={1.75}
            fill="none"
            strokeLinecap="round"
            strokeDasharray="4 4"
          />
        )}

        {/* Main area under curve */}
        {showArea && areaD && <Path d={areaD} fill={`url(#${gradId})`} />}

        {/* Main line with monotone smoothing */}
        <Path
          d={pathD}
          stroke={color}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Comparison dots */}
        {compareData &&
          cmpPts.map(([cx, cy], i) => (
            <Circle
              key={`cmp-${i}`}
              cx={cx}
              cy={cy}
              r={2}
              fill={compareColor}
              fillOpacity={0.7}
            />
          ))}

        {/* Interactive Crosshair, Dots & Floating Tooltip */}
        {data.map((d, i) => {
          const [cx, cy] = pts[i];
          const showLabel = i % xLabelStep === 0;
          const label = `${d[xKey]}${xLabelSuffix}`;
          const isSelected = selectedIdx === i;

          return (
            <G key={i}>
              {/* Invisible tap target for touch devices */}
              <Rect
                x={cx - xStep / 2}
                y={PAD_TOP}
                width={xStep}
                height={chartH + 20}
                fill="transparent"
                onPress={() => {
                  const next = isSelected ? null : i;
                  setSelectedIdx(next);
                  if (next !== null) onPointPress?.(String(d[xKey]), Number(d[yKey]), i);
                }}
              />

              {/* Point dot: subtle small circle when unselected */}
              {!isSelected && (
                <Circle
                  cx={cx}
                  cy={cy}
                  r={data.length > 20 ? 2.5 : 3.5}
                  fill={color}
                  stroke={VIGIA_COLORS.navy}
                  strokeWidth={1}
                />
              )}

              {/* X-axis Label */}
              {showLabel && (
                <SvgText
                  x={cx}
                  y={height - PAD_BOTTOM + 16}
                  textAnchor="middle"
                  fontSize={10}
                  fontFamily={isSelected ? CHART_FONTS.bold : CHART_FONTS.regular}
                  fill={isSelected ? color : labelColor}
                >
                  {label}
                </SvgText>
              )}
            </G>
          );
        })}

        {/* Active Hover Crosshair Overlay */}
        {selectedIdx !== null && pts[selectedIdx] && (
          <G>
            {/* Vertical Laser Crosshair Line */}
            <Line
              x1={pts[selectedIdx][0]}
              y1={PAD_TOP}
              x2={pts[selectedIdx][0]}
              y2={baselineY}
              stroke={color}
              strokeWidth={1.5}
              strokeDasharray="3 3"
              opacity={0.85}
            />

            {/* Glowing Target Halo */}
            <Circle
              cx={pts[selectedIdx][0]}
              cy={pts[selectedIdx][1]}
              r={9}
              fill={color}
              fillOpacity={0.25}
            />
            <Circle
              cx={pts[selectedIdx][0]}
              cy={pts[selectedIdx][1]}
              r={5}
              fill={color}
              stroke="#ffffff"
              strokeWidth={2}
            />

            {/* Floating Tooltip Pill */}
            {(() => {
              const cx = pts[selectedIdx][0];
              const cy = pts[selectedIdx][1];
              const val = Number(data[selectedIdx][yKey]);
              const label = `${data[selectedIdx][xKey]}${xLabelSuffix}`;
              const textStr = `${label}: ${val.toLocaleString("es-BO")}`;
              const tooltipW = Math.max(textStr.length * 7.5 + 20, 70);
              const tooltipH = 26;
              const tooltipX = Math.max(
                PAD_LEFT,
                Math.min(cx - tooltipW / 2, viewBoxW - PAD_RIGHT - tooltipW)
              );
              const tooltipY = Math.max(PAD_TOP - 16, cy - tooltipH - 10);

              return (
                <G>
                  {/* Tooltip background with border */}
                  <Rect
                    x={tooltipX}
                    y={tooltipY}
                    width={tooltipW}
                    height={tooltipH}
                    fill={VIGIA_COLORS.navyCard}
                    stroke={color}
                    strokeWidth={1.2}
                    rx={7}
                  />
                  <SvgText
                    x={tooltipX + tooltipW / 2}
                    y={tooltipY + 16}
                    textAnchor="middle"
                    fontSize={11}
                    fontFamily={CHART_FONTS.bold}
                    fill="#ffffff"
                  >
                    {textStr}
                  </SvgText>
                </G>
              );
            })()}
          </G>
        )}
      </Svg>
    </View>
  );
}
