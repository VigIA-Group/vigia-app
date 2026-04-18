import { createMedia } from "@tamagui/react-native-media-driver";
import { shorthands } from "@tamagui/shorthands";
import { tokens as defaultTokens } from "@tamagui/themes";
import { createFont, createTamagui, createTokens } from "tamagui";

// Tokens personalizados de VigIA
const tokens = createTokens({
  ...defaultTokens,
  color: {
    // Colores primarios de marca — degradé del logotipo
    brandNavy: "#1e3a8a", // azul oscuro (izquierda del isotipo)
    brandBlue: "#2563eb", // azul medio
    primary: "#3b82f6", // azul principal
    secondary: "#1d4ed8", // blue-700
    brandSky: "#60a5fa", // azul claro (parte derecha del isotipo)
    brandIce: "#93c5fd", // celeste suave (gradiente final)

    // Colores de acento
    success: "#34d399", // emerald - confirmaciones y estados positivos
    purple: "#a78bfa", // métricas secundarias
    warning: "#fbbf24", // amber - destacados y warnings
    danger: "#f87171", // red - alertas críticas
    alert: "#fb923c", // orange - caídas y urgencia media

    // Colores por módulo
    ocr: "#3b82f6", // cyan - OCR y placas
    people: "#3b82f6", // blue - análisis de personas
    intrusion: "#fbbf24", // amber - intrusión y perímetros
    stolen: "#f87171", // red - objetos robados
    fall: "#fb923c", // orange - caídas y movimiento
    tampering: "#a78bfa", // purple - clasificación y tampering

    // Dark mode colors - improved contrast
    darkBg: "#020617", // slate-950 - fondo más profundo
    darkCard: "#0f172a", // slate-900 - fondo de cards
    darkSecondary: "#1e293b", // slate-800 - elementos secundarios
    darkBorder: "#334155", // slate-700 - bordes
    darkTextPrimary: "#ffffff", // blanco puro
    darkTextSecondary: "#e2e8f0", // slate-200 - lighter for better contrast
    darkTextTertiary: "#cbd5e1", // slate-300 - lighter
    darkTextLabel: "#94a3b8", // slate-400 - lighter

    // Light mode colors - using more blue
    lightBg: "#f8fafc", // slate-50 - fondo principal
    lightCard: "#ffffff", // blanco - cards
    lightBorder: "#cbd5e1", // slate-300 - darker borders for better contrast
    lightTextPrimary: "#0f172a", // slate-900 - texto principal
    lightTextSecondary: "#334155", // slate-700 - darker secondary text
  },
});

// Temas personalizados
const customThemes = {
  light: {
    background: tokens.color.lightBg,
    backgroundHover: tokens.color.lightCard,
    backgroundPress: tokens.color.lightBorder,
    backgroundFocus: tokens.color.lightCard,
    backgroundStrong: tokens.color.lightCard,
    backgroundTransparent: "rgba(255,255,255,0)",
    color: tokens.color.lightTextPrimary,
    colorHover: tokens.color.lightTextPrimary,
    colorPress: tokens.color.lightTextPrimary,
    colorFocus: tokens.color.lightTextPrimary,
    colorTransparent: "rgba(0,0,0,0)",
    borderColor: tokens.color.lightBorder,
    borderColorHover: tokens.color.lightTextSecondary,
    borderColorFocus: tokens.color.primary,
    borderColorPress: tokens.color.primary,
    placeholderColor: tokens.color.lightTextSecondary,
    outlineColor: "transparent",
  },
  dark: {
    background: tokens.color.darkBg,
    backgroundHover: tokens.color.darkCard,
    backgroundPress: tokens.color.darkSecondary,
    backgroundFocus: tokens.color.darkCard,
    backgroundStrong: tokens.color.darkCard,
    backgroundTransparent: "rgba(0,0,0,0)",
    color: tokens.color.darkTextPrimary,
    colorHover: tokens.color.darkTextPrimary,
    colorPress: tokens.color.darkTextPrimary,
    colorFocus: tokens.color.darkTextPrimary,
    colorTransparent: "rgba(255,255,255,0)",
    borderColor: tokens.color.darkBorder,
    borderColorHover: tokens.color.darkTextSecondary,
    borderColorFocus: tokens.color.primary,
    borderColorPress: tokens.color.primary,
    placeholderColor: tokens.color.darkTextSecondary,
    outlineColor: "transparent",
  },
};

const media = createMedia({
  xs: { maxWidth: 660 },
  sm: { maxWidth: 800 },
  md: { maxWidth: 1020 },
  lg: { maxWidth: 1280 },
  xl: { maxWidth: 1420 },
  xxl: { maxWidth: 1600 },
  gtXs: { minWidth: 660 + 1 },
  gtSm: { minWidth: 800 + 1 },
  gtMd: { minWidth: 1020 + 1 },
  gtLg: { minWidth: 1280 + 1 },
  short: { maxHeight: 820 },
  tall: { minHeight: 820 },
  hoverNone: { hover: "none" },
  pointerCoarse: { pointer: "coarse" },
});

const bodyFont = createFont({
  family: "Outfit",
  size: {
    1: 12,
    2: 13,
    3: 14,
    4: 15,
    5: 16,
    6: 17,
    7: 20,
    8: 22,
    9: 24,
    10: 26,
    11: 30,
    12: 34,
    true: 15,
  },
  lineHeight: {
    1: 17,
    2: 19,
    3: 21,
    4: 22,
    5: 23,
    6: 25,
    7: 28,
    8: 30,
    9: 32,
    10: 34,
    11: 38,
    12: 42,
    true: 22,
  },
  weight: {
    1: "400",
    2: "400",
    3: "400",
    4: "400",
    5: "400",
    6: "500",
    7: "600",
    8: "700",
    true: "400",
  },
  letterSpacing: { 4: 0 },
  face: {
    400: { normal: "Outfit_400Regular" },
    500: { normal: "Outfit_500Medium" },
    600: { normal: "Outfit_600SemiBold" },
    700: { normal: "Outfit_700Bold" },
  },
});

const monoFont = createFont({
  family: "IBMPlexMono",
  size: {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    5: 15,
    6: 17,
    7: 19,
    8: 21,
    true: 14,
  },
  lineHeight: {
    1: 15,
    2: 17,
    3: 19,
    4: 21,
    5: 23,
    6: 25,
    7: 27,
    8: 29,
    true: 21,
  },
  weight: {
    1: "400",
    true: "400",
  },
  letterSpacing: { 4: 0 },
  face: {
    400: { normal: "IBMPlexMono_400Regular" },
    700: { normal: "IBMPlexMono_700Bold" },
  },
});

export const tamaguiConfig = createTamagui({
  tokens,
  themes: customThemes,
  shorthands,
  media,
  defaultFont: "body",
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  fonts: {
    body: bodyFont,
    heading: bodyFont,
    mono: monoFont,
  },
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
