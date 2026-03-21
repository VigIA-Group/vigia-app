import { createMedia } from "@tamagui/react-native-media-driver";
import { shorthands } from "@tamagui/shorthands";
import { tokens as defaultTokens } from "@tamagui/themes";
import { createTamagui, createTokens } from "tamagui";

// Tokens personalizados de VigIA
const tokens = createTokens({
  ...defaultTokens,
  color: {
    // Colores primarios de marca
    primary: "#06b6d4", // cyan
    secondary: "#3b82f6", // blue

    // Colores de acento
    success: "#34d399", // emerald - confirmaciones y estados positivos
    purple: "#a78bfa", // métricas secundarias
    warning: "#fbbf24", // amber - destacados y warnings
    danger: "#f87171", // red - alertas críticas
    alert: "#fb923c", // orange - caídas y urgencia media

    // Colores por módulo
    ocr: "#06b6d4", // cyan - OCR y placas
    people: "#3b82f6", // blue - análisis de personas
    intrusion: "#fbbf24", // amber - intrusión y perímetros
    stolen: "#f87171", // red - objetos robados
    fall: "#fb923c", // orange - caídas y movimiento
    tampering: "#a78bfa", // purple - clasificación y tampering

    // Dark mode colors
    darkBg: "#020617", // slate-950 - fondo más profundo
    darkCard: "#0f172a", // slate-900 - fondo de cards
    darkSecondary: "#1e293b", // slate-800 - elementos secundarios
    darkBorder: "#334155", // slate-700 - bordes
    darkTextPrimary: "#ffffff", // blanco puro
    darkTextSecondary: "#cbd5e1", // slate-300
    darkTextTertiary: "#94a3b8", // slate-400
    darkTextLabel: "#64748b", // slate-500

    // Light mode colors
    lightBg: "#f8fafc", // slate-50 - fondo principal
    lightCard: "#ffffff", // blanco - cards
    lightBorder: "#e2e8f0", // slate-200 - bordes
    lightTextPrimary: "#0f172a", // slate-900 - texto principal
    lightTextSecondary: "#475569", // slate-600 - texto secundario
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

export const tamaguiConfig = createTamagui({
  tokens,
  themes: customThemes,
  shorthands,
  media,
  defaultFont: "body",
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  fonts: {
    body: {
      family: "System",
      size: {},
      lineHeight: {},
      weight: {},
      letterSpacing: {},
      face: {},
    },
  },
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
