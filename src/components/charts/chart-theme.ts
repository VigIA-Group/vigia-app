import { Platform } from "react-native";

// ─────────────────────────────────────────────────────────────
// PALETA DE MARCA VIGIA
// ─────────────────────────────────────────────────────────────
export const VIGIA_COLORS = {
  navy: "#050E1D", // Base dark / navy
  navyCard: "#0b172a", // Fondo de tarjeta
  navySurface: "#13233e", // Superficie intermedia
  blueDark: "#02209A", // Azul acento profundo
  bluePrimary: "#0A4CE8", // Azul acento principal
  blueVibrant: "#056EFA", // Azul acento vibrante
  blueCyan: "#2198F4", // Azul acento cian
  indigoOcr: "#6366f1", // OCR & placas
  emeraldSuccess: "#34d399", // Positivo / éxito
  amberWarning: "#fbbf24", // Alerta media / perímetro
  redDanger: "#f87171", // Alerta crítica / robos
  orangeAlert: "#fb923c", // Caídas y urgencia
  purpleMetric: "#a78bfa", // Clasificación / pico
  gridDark: "rgba(255, 255, 255, 0.07)",
  gridLight: "rgba(5, 14, 29, 0.07)",
  textLabelDark: "#94a3b8",
  textLabelLight: "#64748b",
};

// ─────────────────────────────────────────────────────────────
// TIPOGRAFÍA PLUS JAKARTA SANS PARA SVG
// ─────────────────────────────────────────────────────────────
export const CHART_FONTS = {
  light: Platform.select({
    web: "'Plus Jakarta Sans', -apple-system, sans-serif",
    default: "PlusJakartaSans_300Light",
  }),
  regular: Platform.select({
    web: "'Plus Jakarta Sans', -apple-system, sans-serif",
    default: "PlusJakartaSans_400Regular",
  }),
  medium: Platform.select({
    web: "'Plus Jakarta Sans', -apple-system, sans-serif",
    default: "PlusJakartaSans_500Medium",
  }),
  semiBold: Platform.select({
    web: "'Plus Jakarta Sans', -apple-system, sans-serif",
    default: "PlusJakartaSans_600SemiBold",
  }),
  bold: Platform.select({
    web: "'Plus Jakarta Sans', -apple-system, sans-serif",
    default: "PlusJakartaSans_700Bold",
  }),
  extraBold: Platform.select({
    web: "'Plus Jakarta Sans', -apple-system, sans-serif",
    default: "PlusJakartaSans_800ExtraBold",
  }),
};

// ─────────────────────────────────────────────────────────────
// ALGORITMO MONOTONE CUBIC SPLINE (Fritsch-Carlson)
// Evita picos y quiebres angulares; genera curvas suaves naturales
// ─────────────────────────────────────────────────────────────
export function buildMonotoneSplinePath(pts: [number, number][]): string {
  const n = pts.length;
  if (n === 0) return "";
  if (n === 1) return `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  if (n === 2) {
    return `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)} L ${pts[1][0].toFixed(2)} ${pts[1][1].toFixed(2)}`;
  }

  // 1. Calcular pendientes de secantes deltas
  const dxs: number[] = new Array(n - 1);
  const dys: number[] = new Array(n - 1);
  const slopes: number[] = new Array(n - 1);

  for (let i = 0; i < n - 1; i++) {
    dxs[i] = pts[i + 1][0] - pts[i][0];
    dys[i] = pts[i + 1][1] - pts[i][1];
    slopes[i] = dxs[i] === 0 ? 0 : dys[i] / dxs[i];
  }

  // 2. Calcular tangentes iniciales
  const tangents: number[] = new Array(n);
  tangents[0] = slopes[0];
  tangents[n - 1] = slopes[n - 2];

  for (let i = 1; i < n - 1; i++) {
    if (slopes[i - 1] * slopes[i] <= 0) {
      tangents[i] = 0;
    } else {
      const dx1 = dxs[i - 1];
      const dx2 = dxs[i];
      tangents[i] = (3 * (dx1 + dx2)) / ((2 * dx1 + dx2) / slopes[i - 1] + (dx1 + 2 * dx2) / slopes[i]);
    }
  }

  // 3. Ajuste de monotonicidad de Fritsch-Carlson
  for (let i = 0; i < n - 1; i++) {
    if (dys[i] === 0) {
      tangents[i] = 0;
      tangents[i + 1] = 0;
    } else {
      const alpha = tangents[i] / slopes[i];
      const beta = tangents[i + 1] / slopes[i];
      const dist = alpha * alpha + beta * beta;
      if (dist > 9) {
        const tau = 3 / Math.sqrt(dist);
        tangents[i] = tau * alpha * slopes[i];
        tangents[i + 1] = tau * beta * slopes[i];
      }
    }
  }

  // 4. Construir path con curvas cúbicas de Bézier
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const dx = dxs[i];
    const cp1x = p0[0] + dx / 3;
    const cp1y = p0[1] + (tangents[i] * dx) / 3;
    const cp2x = p1[0] - dx / 3;
    const cp2y = p1[1] - (tangents[i + 1] * dx) / 3;

    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p1[0].toFixed(2)} ${p1[1].toFixed(2)}`;
  }

  return d;
}

/**
 * Construye el path cerrado para el área bajo la curva con monotone spline
 */
export function buildMonotoneAreaPath(pts: [number, number][], baselineY: number): string {
  if (pts.length === 0) return "";
  const lineD = buildMonotoneSplinePath(pts);
  const last = pts[pts.length - 1];
  const first = pts[0];

  return `${lineD} L ${last[0].toFixed(2)} ${baselineY.toFixed(2)} L ${first[0].toFixed(2)} ${baselineY.toFixed(2)} Z`;
}

// ─────────────────────────────────────────────────────────────
// UTILIDADES FINANCIERAS Y DE FORMATO RETAIL
// ─────────────────────────────────────────────────────────────
export function formatCurrency(amount: number, prefix: string = "$"): string {
  return `${prefix}${amount.toLocaleString("es-BO", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatNumberCompact(v: number): string {
  if (Math.abs(v) >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return String(Math.round(v));
}

export const VIGIA_GLOW = {
  blue: "rgba(5, 110, 250, 0.45)",
  cyan: "rgba(33, 152, 244, 0.45)",
  emerald: "rgba(52, 211, 153, 0.45)",
  amber: "rgba(251, 191, 36, 0.45)",
  red: "rgba(248, 113, 113, 0.45)",
};
