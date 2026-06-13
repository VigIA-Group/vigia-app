/**
 * HeatmapCanvas — renders a people-analytics heatmap overlay on a floor plan image.
 *
 * Props:
 *   snapshotUrl  — floor plan image URL (from pa_space_snapshots)
 *   points       — array of { x, y, weight } where x/y are 0..1 normalized, weight > 0
 *   width/height — canvas dimensions (fill parent by default)
 */
import {
  BlurMask,
  Canvas,
  Circle,
  Image,
  Paint,
  RadialGradient,
  Rect,
  useImage,
  vec,
} from "@shopify/react-native-skia";
import { useMemo } from "react";

export type HeatPoint = { x: number; y: number; weight: number };

type Props = {
  snapshotUrl: string | null;
  points: HeatPoint[];
  width: number;
  height: number;
};

/** Map weight (0..1 clamp) to a heat colour with alpha */
function heatColor(w: number): string {
  const clamped = Math.min(1, Math.max(0, w));
  if (clamped < 0.33) {
    // blue → cyan
    const t = clamped / 0.33;
    const r = Math.round(0);
    const g = Math.round(t * 200);
    const b = Math.round(255);
    return `rgba(${r},${g},${b},${0.3 + t * 0.4})`;
  } else if (clamped < 0.66) {
    // cyan → yellow
    const t = (clamped - 0.33) / 0.33;
    const r = Math.round(t * 255);
    const g = Math.round(200 + t * 55);
    const b = Math.round(255 - t * 255);
    return `rgba(${r},${g},${b},${0.5 + t * 0.2})`;
  } else {
    // yellow → red
    const t = (clamped - 0.66) / 0.34;
    const r = 255;
    const g = Math.round(255 - t * 255);
    const b = 0;
    return `rgba(${r},${g},${b},${0.65 + t * 0.3})`;
  }
}

export function HeatmapCanvas({ snapshotUrl, points, width, height }: Props) {
  const floorPlan = useImage(snapshotUrl ?? undefined);

  const normalizedPoints = useMemo(() => {
    if (!points.length) return [];
    const maxWeight = Math.max(...points.map((p) => p.weight));
    return points.map((p) => ({
      cx: p.x * width,
      cy: p.y * height,
      r: Math.max(20, (p.weight / maxWeight) * 60),
      w: maxWeight > 0 ? p.weight / maxWeight : 0,
    }));
  }, [points, width, height]);

  return (
    <Canvas style={{ width, height }}>
      {/* Floor plan background */}
      {floorPlan ? (
        <Image image={floorPlan} x={0} y={0} width={width} height={height} fit="cover" />
      ) : (
        <Rect x={0} y={0} width={width} height={height} color="#0f172a" />
      )}

      {/* Heat blobs */}
      {normalizedPoints.map((pt, i) => (
        <Circle key={i} cx={pt.cx} cy={pt.cy} r={pt.r}>
          <Paint>
            <RadialGradient
              c={vec(pt.cx, pt.cy)}
              r={pt.r}
              colors={[heatColor(pt.w), "transparent"]}
            />
            <BlurMask blur={pt.r * 0.4} style="normal" />
          </Paint>
        </Circle>
      ))}
    </Canvas>
  );
}
