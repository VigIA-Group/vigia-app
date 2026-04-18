/**
 * SvgBarChart — a lightweight bar chart built on react-native-svg.
 * Supports tap-to-reveal exact values.
 * Works on both native and web (no Skia dependency).
 */
import { useState } from "react";
import { View } from "react-native";
import Svg, { G, Line, Rect, Text as SvgText } from "react-native-svg";

const VIEWBOX_W = 400;
const PAD_LEFT = 40;
const PAD_RIGHT = 12;
const PAD_TOP = 24;
const PAD_BOTTOM = 32;

function formatLabel(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return String(Math.round(v));
}

function formatFull(v: number): string {
  return v.toLocaleString("es-BO");
}

interface SvgBarChartProps<T extends Record<string, unknown>> {
  data: T[];
  xKey: keyof T;
  yKey: keyof T;
  color?: string;
  compareData?: T[];
  compareColor?: string;
  height?: number;
  labelColor?: string;
  gridColor?: string;
  /** Called when user taps a bar — useful for external selection display */
  onBarPress?: (label: string, value: number, index: number) => void;
}

export function SvgBarChart<T extends Record<string, unknown>>({
  data,
  xKey,
  yKey,
  color = "#3b82f6",
  compareData,
  compareColor = "#475569",
  height = 180,
  labelColor = "#64748b",
  gridColor = "#1e293b",
  onBarPress,
}: SvgBarChartProps<T>) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const chartW = VIEWBOX_W - PAD_LEFT - PAD_RIGHT;
  const chartH = height - PAD_TOP - PAD_BOTTOM;

  const values = data.map((d) => Number(d[yKey]));
  const compareValues = compareData ? compareData.map((d) => Number(d[yKey])) : [];
  const maxVal = Math.max(...values, ...compareValues, 1);

  const hasCmp = !!compareData;
  const groupW = chartW / data.length;
  const barW = hasCmp ? groupW * 0.38 : groupW * 0.55;
  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <View style={{ width: "100%", height }}>
      <Svg
        viewBox={`0 0 ${VIEWBOX_W} ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="none"
      >
        {/* Y grid lines */}
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
                strokeWidth={1}
                strokeDasharray={frac === 0 ? undefined : "4 3"}
              />
              <SvgText x={PAD_LEFT - 5} y={y + 4} textAnchor="end" fontSize={9} fill={labelColor}>
                {formatLabel(maxVal * frac)}
              </SvgText>
            </G>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const val = Number(d[yKey]);
          const barH = Math.max((val / maxVal) * chartH, 2);
          const groupX = PAD_LEFT + groupW * i;
          const x = hasCmp ? groupX + (groupW - barW * 2 - 3) / 2 : groupX + (groupW - barW) / 2;
          const y = PAD_TOP + chartH - barH;
          const label = String(d[xKey]);
          const isSelected = selectedIdx === i;
          const barColor = isSelected ? "#ffffff" : color;

          // Compare bar
          const cmpVal = compareData ? Number(compareData[i]?.[yKey] ?? 0) : 0;
          const cmpH = Math.max((cmpVal / maxVal) * chartH, 2);
          const cmpX = x + barW + 3;
          const cmpY = PAD_TOP + chartH - cmpH;

          return (
            <G key={i}>
              {/* Highlight background */}
              {isSelected && (
                <Rect
                  x={groupX + 2}
                  y={PAD_TOP}
                  width={groupW - 4}
                  height={chartH}
                  fill={color}
                  fillOpacity={0.08}
                  rx={4}
                />
              )}

              {/* Main bar */}
              <Rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                fill={barColor}
                rx={3}
                onPress={() => {
                  const next = isSelected ? null : i;
                  setSelectedIdx(next);
                  if (next !== null) onBarPress?.(label, val, i);
                }}
              />

              {/* Compare bar */}
              {hasCmp && (
                <Rect
                  x={cmpX}
                  y={cmpY}
                  width={barW}
                  height={cmpH}
                  fill={compareColor}
                  rx={3}
                  fillOpacity={0.7}
                />
              )}

              {/* Value label above bar when selected */}
              {isSelected && (
                <SvgText
                  x={x + barW / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fontSize={10}
                  fill={color}
                  fontWeight="700"
                >
                  {formatFull(val)}
                </SvgText>
              )}

              {/* X label */}
              <SvgText
                x={groupX + groupW / 2}
                y={height - PAD_BOTTOM + 14}
                textAnchor="middle"
                fontSize={9}
                fill={isSelected ? color : labelColor}
              >
                {label}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}
