/**
 * SvgMultiLineChart — multiple line series on a single chart.
 * Works on both native and web (no Skia dependency).
 */
import { View } from "react-native";
import Svg, { Circle, G, Line, Path, Text as SvgText } from "react-native-svg";

const VIEWBOX_W = 400;
const PAD_LEFT = 40;
const PAD_RIGHT = 12;
const PAD_TOP = 16;
const PAD_BOTTOM = 32;

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

interface LineSeries {
  yKey: string;
  color: string;
  label?: string;
}

interface SvgMultiLineChartProps<T extends Record<string, unknown>> {
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
  labelColor = "#64748b",
  gridColor = "#1e293b",
}: SvgMultiLineChartProps<T>) {
  const chartW = VIEWBOX_W - PAD_LEFT - PAD_RIGHT;
  const chartH = height - PAD_TOP - PAD_BOTTOM;

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
              {frac > 0 && (
                <SvgText x={PAD_LEFT - 5} y={y + 4} textAnchor="end" fontSize={9} fill={labelColor}>
                  {Math.round(maxVal * frac)}
                </SvgText>
              )}
            </G>
          );
        })}

        {/* Lines */}
        {lines.map((series) => {
          const pts: [number, number][] = data.map((d, i) => [
            PAD_LEFT + i * xStep,
            PAD_TOP + chartH - (Number(d[series.yKey] ?? 0) / maxVal) * chartH,
          ]);
          return (
            <G key={series.yKey}>
              <Path
                d={buildPath(pts)}
                stroke={series.color}
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
              />
              {pts.map(([cx, cy], i) => (
                <Circle key={i} cx={cx} cy={cy} r={2.5} fill={series.color} />
              ))}
            </G>
          );
        })}

        {/* X labels from first line only */}
        {data.map((d, i) => (
          <SvgText
            key={i}
            x={PAD_LEFT + i * xStep}
            y={height - PAD_BOTTOM + 14}
            textAnchor="middle"
            fontSize={9}
            fill={labelColor}
          >
            {String(d[xKey])}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}
