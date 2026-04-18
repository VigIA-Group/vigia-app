/**
 * SvgLineChart — a lightweight line chart built on react-native-svg.
 * Supports tap-to-reveal, comparison line, and touch dots.
 * Works on both native and web (no Skia dependency).
 */
import { useState } from "react";
import { View } from "react-native";
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from "react-native-svg";

const VIEWBOX_W = 400;
const PAD_LEFT = 40;
const PAD_RIGHT = 12;
const PAD_TOP = 16;
const PAD_BOTTOM = 32;

function formatLabel(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return String(Math.round(v));
}

/** Build a smooth cubic bezier path through a set of [x,y] points */
function buildPath(pts: [number, number][]): string {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0][0]} ${pts[0][1]}`;

  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const cpX = (prev[0] + curr[0]) / 2;
    d += ` C ${cpX} ${prev[1]}, ${cpX} ${curr[1]}, ${curr[0]} ${curr[1]}`;
  }
  return d;
}

interface SvgLineChartProps<T extends Record<string, unknown>> {
  data: T[];
  xKey: keyof T;
  yKey: keyof T;
  color?: string;
  compareData?: T[];
  compareColor?: string;
  height?: number;
  labelColor?: string;
  gridColor?: string;
  /** How many x-axis labels to show (default: show all) */
  xLabelStep?: number;
  xLabelSuffix?: string;
  onPointPress?: (label: string, value: number, index: number) => void;
}

export function SvgLineChart<T extends Record<string, unknown>>({
  data,
  xKey,
  yKey,
  color = "#3b82f6",
  compareData,
  compareColor = "#475569",
  height = 180,
  labelColor = "#64748b",
  gridColor = "#1e293b",
  xLabelStep = 1,
  xLabelSuffix = "",
  onPointPress,
}: SvgLineChartProps<T>) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const chartW = VIEWBOX_W - PAD_LEFT - PAD_RIGHT;
  const chartH = height - PAD_TOP - PAD_BOTTOM;

  const values = data.map((d) => Number(d[yKey]));
  const compareValues = compareData ? compareData.map((d) => Number(d[yKey])) : [];
  const maxVal = Math.max(...values, ...compareValues, 1);

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
  const pathD = buildPath(pts);
  const cmpPathD = buildPath(cmpPts);

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

        {/* Comparison line (dashed) */}
        {compareData && (
          <Path
            d={cmpPathD}
            stroke={compareColor}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeDasharray="5 4"
          />
        )}

        {/* Main line */}
        <Path d={pathD} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" />

        {/* Dots + x labels + tap targets */}
        {data.map((d, i) => {
          const [cx, cy] = pts[i];
          const showLabel = i % xLabelStep === 0;
          const label = `${d[xKey]}${xLabelSuffix}`;
          const val = Number(d[yKey]);
          const isSelected = selectedIdx === i;

          return (
            <G key={i}>
              {/* Larger transparent tap target */}
              <Rect
                x={cx - 12}
                y={PAD_TOP}
                width={24}
                height={chartH}
                fill="transparent"
                onPress={() => {
                  const next = isSelected ? null : i;
                  setSelectedIdx(next);
                  if (next !== null) onPointPress?.(String(d[xKey]), val, i);
                }}
              />
              {/* Selection vertical line */}
              {isSelected && (
                <Line
                  x1={cx}
                  y1={PAD_TOP}
                  x2={cx}
                  y2={PAD_TOP + chartH}
                  stroke={color}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
              )}
              <Circle cx={cx} cy={cy} r={isSelected ? 5 : 3} fill={color} />
              {/* Value bubble when selected */}
              {isSelected && (
                <>
                  <Rect x={cx - 20} y={cy - 22} width={40} height={18} fill={color} rx={4} />
                  <SvgText
                    x={cx}
                    y={cy - 9}
                    textAnchor="middle"
                    fontSize={9}
                    fill="#ffffff"
                    fontWeight="700"
                  >
                    {val.toLocaleString("es-BO")}
                  </SvgText>
                </>
              )}
              {showLabel && (
                <SvgText
                  x={cx}
                  y={height - PAD_BOTTOM + 14}
                  textAnchor="middle"
                  fontSize={9}
                  fill={isSelected ? color : labelColor}
                >
                  {label}
                </SvgText>
              )}
            </G>
          );
        })}

        {/* Comparison dots */}
        {compareData &&
          cmpPts.map(([cx, cy], i) => (
            <Circle
              key={`cmp-${i}`}
              cx={cx}
              cy={cy}
              r={2.5}
              fill={compareColor}
              fillOpacity={0.7}
            />
          ))}
      </Svg>
    </View>
  );
}
