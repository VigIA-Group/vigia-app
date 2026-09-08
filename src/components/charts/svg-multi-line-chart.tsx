/**
 * SvgMultiLineChart — Gráfico multilínea optimizado para VigIA.
 * Implementa curvas suaves Monotone Cubic Spline, tooltips interactivos
 * con paleta VigIA Navy y tipografía Plus Jakarta Sans.
 */
import { useState } from "react";
import { View } from "react-native";
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from "react-native-svg";
import { CHART_FONTS, VIGIA_COLORS, buildMonotoneSplinePath } from "./chart-theme";

const VIEWBOX_W = 400;
const PAD_LEFT = 38;
const PAD_RIGHT = 14;
const PAD_TOP = 22;
const PAD_BOTTOM = 32;

export interface LineSeries {
  yKey: string;
  color: string;
  label?: string;
}

export interface SvgMultiLineChartProps<T extends Record<string, unknown>> {
  data: T[];
  xKey: keyof T;
  lines: LineSeries[];
  height?: number;
  labelColor?: string;
  gridColor?: string;
}

export function SvgMultiLineChart<T extends Record<string, unknown>>({
  data,
  xKey,
  lines,
  height = 180,
  labelColor = VIGIA_COLORS.textLabelDark,
  gridColor = VIGIA_COLORS.gridDark,
}: SvgMultiLineChartProps<T>) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const chartW = VIEWBOX_W - PAD_LEFT - PAD_RIGHT;
  const chartH = height - PAD_TOP - PAD_BOTTOM;
  const baselineY = PAD_TOP + chartH;

  const allValues = lines.flatMap((l) => data.map((d) => Number(d[l.yKey] ?? 0)));
  const maxVal = Math.max(...allValues, 1);

  const xStep = data.length > 1 ? chartW / (data.length - 1) : chartW;
  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <View style={{ width: "100%", height }}>
      <Svg
        viewBox={`0 0 ${VIEWBOX_W} ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="none"
      >
        {/* Y grid lines (discrete & subtle) */}
        {yTicks.map((frac, i) => {
          const y = PAD_TOP + chartH * (1 - frac);
          return (
            <G key={i}>
              <Line
                x1={PAD_LEFT}
                y1={y}
                x2={VIEWBOX_W - PAD_RIGHT}
                y2={y}
                stroke={gridColor}
                strokeWidth={0.75}
                strokeDasharray={frac === 0 ? undefined : "3 4"}
              />
              {frac > 0 && (
                <SvgText
                  x={PAD_LEFT - 6}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize={9}
                  fontFamily={CHART_FONTS.regular}
                  fill={labelColor}
                >
                  {Math.round(maxVal * frac)}
                </SvgText>
              )}
            </G>
          );
        })}

        {/* Selected index guideline */}
        {selectedIdx !== null && (
          <Line
            x1={PAD_LEFT + selectedIdx * xStep}
            y1={PAD_TOP}
            x2={PAD_LEFT + selectedIdx * xStep}
            y2={baselineY}
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        )}

        {/* Series lines using Monotone Spline */}
        {lines.map((series) => {
          const pts: [number, number][] = data.map((d, i) => [
            PAD_LEFT + i * xStep,
            PAD_TOP + chartH - (Number(d[series.yKey] ?? 0) / maxVal) * chartH,
          ]);
          return (
            <G key={series.yKey}>
              <Path
                d={buildMonotoneSplinePath(pts)}
                stroke={series.color}
                strokeWidth={2.2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {pts.map(([cx, cy], i) => {
                const isSelected = selectedIdx === i;
                return (
                  <Circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 4 : 2.5}
                    fill={series.color}
                    stroke={isSelected ? "#ffffff" : VIGIA_COLORS.navy}
                    strokeWidth={isSelected ? 1.5 : 0.8}
                  />
                );
              })}
            </G>
          );
        })}

        {/* Touch targets and X labels */}
        {data.map((d, i) => {
          const cx = PAD_LEFT + i * xStep;
          const isSelected = selectedIdx === i;

          return (
            <G key={i}>
              <Rect
                x={cx - 14}
                y={PAD_TOP}
                width={28}
                height={chartH}
                fill="transparent"
                onPress={() => setSelectedIdx(isSelected ? null : i)}
              />
              <SvgText
                x={cx}
                y={height - PAD_BOTTOM + 16}
                textAnchor="middle"
                fontSize={9.5}
                fontFamily={isSelected ? CHART_FONTS.bold : CHART_FONTS.regular}
                fill={isSelected ? "#ffffff" : labelColor}
              >
                {String(d[xKey])}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}
