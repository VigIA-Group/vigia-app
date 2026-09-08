import { useId, useState } from "react";
import { GestureResponderEvent, Platform, View } from "react-native";
import Svg, { Defs, G, Line, LinearGradient, Rect, Stop, Text as SvgText } from "react-native-svg";
import { CHART_FONTS, VIGIA_COLORS } from "./chart-theme";

const PAD_LEFT = 42;
const PAD_RIGHT = 20;
const PAD_TOP = 26;
const PAD_BOTTOM = 34;

function formatLabel(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return String(Math.round(v));
}

function formatFull(v: number): string {
  return v.toLocaleString("es-BO");
}

export interface SvgBarChartProps<T extends Record<string, unknown>> {
  data: T[];
  xKey: keyof T;
  yKey: keyof T;
  color?: string;
  compareData?: T[];
  compareColor?: string;
  height?: number;
  labelColor?: string;
  gridColor?: string;
  /** Called when user taps a bar */
  onBarPress?: (label: string, value: number, index: number) => void;
}

export function SvgBarChart<T extends Record<string, unknown>>({
  data,
  xKey,
  yKey,
  color = VIGIA_COLORS.blueVibrant,
  compareData,
  compareColor = "#475569",
  height = 200,
  labelColor = VIGIA_COLORS.textLabelDark,
  gridColor = VIGIA_COLORS.gridDark,
  onBarPress,
}: SvgBarChartProps<T>) {
  const [layoutWidth, setLayoutWidth] = useState<number>(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const rawId = useId();
  const barGradId = `bar-grad-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;

  const viewBoxW = layoutWidth > 0 ? layoutWidth : 500;
  const chartW = Math.max(viewBoxW - PAD_LEFT - PAD_RIGHT, 100);
  const chartH = height - PAD_TOP - PAD_BOTTOM;

  const values = data.map((d) => Number(d[yKey]));
  const compareValues = compareData ? compareData.map((d) => Number(d[yKey])) : [];
  const maxVal = Math.max(...values, ...compareValues, 1);

  const hasCmp = !!compareData;
  const groupW = chartW / Math.max(data.length, 1);
  const barW = Math.max(hasCmp ? groupW * 0.36 : Math.min(groupW * 0.54, 32), 6);
  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  // Pointer tracking
  const handlePointer = (clientX: number) => {
    if (!data.length) return;
    const relX = clientX - PAD_LEFT;
    const idx = Math.floor(relX / groupW);
    if (idx >= 0 && idx < data.length) {
      setSelectedIdx(idx);
      onBarPress?.(String(data[idx][xKey]), Number(data[idx][yKey]), idx);
    }
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
          <LinearGradient id={barGradId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={color} stopOpacity={1} />
            <Stop offset="100%" stopColor={color} stopOpacity={0.7} />
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

        {/* Bars and Tooltips */}
        {data.map((d, i) => {
          const val = Number(d[yKey]);
          const barH = Math.max((val / maxVal) * chartH, 3);
          const groupX = PAD_LEFT + groupW * i;
          const x = hasCmp ? groupX + (groupW - barW * 2 - 3) / 2 : groupX + (groupW - barW) / 2;
          const y = PAD_TOP + chartH - barH;
          const label = String(d[xKey]);
          const isSelected = selectedIdx === i;

          // Compare bar
          const cmpVal = compareData ? Number(compareData[i]?.[yKey] ?? 0) : 0;
          const cmpH = Math.max((cmpVal / maxVal) * chartH, 2);
          const cmpX = x + barW + 3;
          const cmpY = PAD_TOP + chartH - cmpH;

          // Tooltip position
          const tooltipText = `${label}: ${formatFull(val)}`;
          const tooltipW = Math.max(tooltipText.length * 7.5 + 16, 64);
          const tooltipH = 24;
          const tooltipCenterX = hasCmp ? (x + cmpX + barW) / 2 : x + barW / 2;
          const tooltipX = Math.max(
            PAD_LEFT,
            Math.min(tooltipCenterX - tooltipW / 2, viewBoxW - PAD_RIGHT - tooltipW)
          );
          const tooltipY = Math.max(PAD_TOP - 22, Math.min(y, cmpY) - tooltipH - 6);

          return (
            <G key={i}>
              {/* Highlight background column */}
              {isSelected && (
                <Rect
                  x={groupX + 2}
                  y={PAD_TOP}
                  width={groupW - 4}
                  height={chartH}
                  fill={color}
                  fillOpacity={0.08}
                  rx={6}
                />
              )}

              {/* Main bar with rounded corners */}
              <Rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                fill={isSelected ? "#ffffff" : `url(#${barGradId})`}
                rx={Math.min(5, barW / 2)}
                onPress={() => {
                  const next = isSelected ? null : i;
                  setSelectedIdx(next);
                  if (next !== null) onBarPress?.(label, val, i);
                }}
              />

              {/* Compare bar with rounded corners */}
              {hasCmp && (
                <Rect
                  x={cmpX}
                  y={cmpY}
                  width={barW}
                  height={cmpH}
                  fill={compareColor}
                  rx={Math.min(4, barW / 2)}
                  fillOpacity={0.7}
                />
              )}

              {/* Tooltip on selection with Navy background & Plus Jakarta Sans */}
              {isSelected && (
                <G>
                  <Rect
                    x={tooltipX}
                    y={tooltipY}
                    width={tooltipW}
                    height={tooltipH}
                    fill={VIGIA_COLORS.navyCard}
                    stroke={color}
                    strokeWidth={1.2}
                    rx={6}
                  />
                  <SvgText
                    x={tooltipX + tooltipW / 2}
                    y={tooltipY + 15}
                    textAnchor="middle"
                    fontSize={10.5}
                    fontFamily={CHART_FONTS.bold}
                    fill="#ffffff"
                  >
                    {tooltipText}
                  </SvgText>
                </G>
              )}

              {/* X label */}
              <SvgText
                x={groupX + groupW / 2}
                y={height - PAD_BOTTOM + 16}
                textAnchor="middle"
                fontSize={10}
                fontFamily={isSelected ? CHART_FONTS.bold : CHART_FONTS.regular}
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
