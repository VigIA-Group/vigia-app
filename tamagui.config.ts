import { createMedia } from "@tamagui/react-native-media-driver";
import { shorthands } from "@tamagui/shorthands";
import { tokens as defaultTokens } from "@tamagui/themes";
import { createFont, createTamagui, createTokens } from "tamagui";

// Tokens personalizados de VigIA
const tokens = createTokens({
  ...defaultTokens,
  color: {
    // Colores primarios de marca VigIA
    brandNavy: "#050E1D", // base navy VigIA
    brandBlueDark: "#02209A", // azul de acento oscuro
    brandBluePrimary: "#0A4CE8", // azul de acento primario
    brandBlueAccent: "#056EFA", // azul de acento vibrante
    brandBlueCyan: "#2198F4", // azul cian
    brandBlue: "#0A4CE8",
    primary: "#056EFA", // azul principal
    secondary: "#02209A",
    brandSky: "#2198F4",
    brandIce: "#93c5fd",

    // Colores de acento
    success: "#34d399", // emerald - confirmaciones y estados positivos
    purple: "#a78bfa", // métricas secundarias
    warning: "#fbbf24", // amber - destacados y warnings
    danger: "#f87171", // red - alertas críticas
    alert: "#fb923c", // orange - caídas y urgencia media

    // Colores por módulo
    ocr: "#6366f1", // índigo - OCR y placas (independiente de personas)
    people: "#056EFA", // azul - análisis de personas
    intrusion: "#fbbf24", // amber - intrusión y perímetros
    stolen: "#f87171", // red - objetos robados
    fall: "#fb923c", // orange - caídas y movimiento
    tampering: "#a78bfa", // purple - clasificación y tampering

    // Dark mode colors - VigIA Navy base
    darkBg: "#050E1D", // navy profundo #050E1D
    darkCard: "#0b172a", // navy card
    darkSecondary: "#13233e", // elementos secundarios
    darkBorder: "#1e3357", // bordes sutiles
    darkTextPrimary: "#ffffff", // blanco puro
    darkTextSecondary: "#e2e8f0", // slate-200
    darkTextTertiary: "#cbd5e1", // slate-300
    darkTextLabel: "#94a3b8", // slate-400

    // Light mode colors
    lightBg: "#f8fafc",
    lightCard: "#ffffff",
    lightBorder: "#cbd5e1",
    lightTextPrimary: "#050E1D",
    lightTextSecondary: "#334155",
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
  family: "PlusJakartaSans",
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
    1: "300",
    2: "300",
    3: "400",
    4: "400",
    5: "500",
    6: "500",
    7: "600",
    8: "700",
    9: "800",
    true: "400",
  },
  letterSpacing: { 4: 0 },
  face: {
    300: { normal: "PlusJakartaSans_300Light" },
    400: { normal: "PlusJakartaSans_400Regular" },
    500: { normal: "PlusJakartaSans_500Medium" },
    600: { normal: "PlusJakartaSans_600SemiBold" },
    700: { normal: "PlusJakartaSans_700Bold" },
    800: { normal: "PlusJakartaSans_800ExtraBold" },
  },
});

const headingFont = createFont({
  family: "PlusJakartaSans",
  size: bodyFont.size,
  lineHeight: bodyFont.lineHeight,
  weight: {
    ...bodyFont.weight,
    true: "700",
  },
  letterSpacing: { 4: -0.4 },
  face: bodyFont.face,
});

const monoFont = createFont({
  family: "PlusJakartaSans",
  size: bodyFont.size,
  lineHeight: bodyFont.lineHeight,
  weight: {
    ...bodyFont.weight,
    true: "600",
  },
  letterSpacing: { 4: -0.2 },
  face: bodyFont.face,
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
    heading: headingFont,
    mono: monoFont,
  },
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
