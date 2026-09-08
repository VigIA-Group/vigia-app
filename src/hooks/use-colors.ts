import { useAppTheme } from "./use-app-theme";

/**
 * Returns semantic colors for the current theme.
 * Use this in screens and components that can't use Tamagui $tokens directly.
 */
export function useColors() {
  const { theme } = useAppTheme();
  const isDark = theme === "dark";

  return {
    // Backgrounds
    bg: isDark ? "#050E1D" : "#f8fafc",
    card: isDark ? "#0b172a" : "#ffffff",
    cardAlt: isDark ? "#13233e" : "#f1f5f9",
    // Borders
    border: isDark ? "#1e3357" : "#cbd5e1",
    borderSoft: isDark ? "rgba(255, 255, 255, 0.08)" : "#e2e8f0",
    // Text
    text: isDark ? "#ffffff" : "#050E1D",
    textSec: isDark ? "#e2e8f0" : "#334155",
    textTer: isDark ? "#cbd5e1" : "#64748b",
    textLabel: isDark ? "#94a3b8" : "#94a3b8",
    // Tab / navigation
    tabBar: isDark ? "#0b172a" : "#ffffff",
    tabBorder: isDark ? "#1e3357" : "#cbd5e1",
    // BlurView tint
    blurTint: isDark ? ("dark" as const) : ("light" as const),
    // Camera preview background
    preview: isDark ? "#0b172a" : "#cbd5e1",
    // VigIA Brand palette
    brandNavy: "#050E1D",
    brandBlueDark: "#02209A",
    brandBluePrimary: "#0A4CE8",
    brandBlueAccent: "#056EFA",
    brandBlueCyan: "#2198F4",
    accent: "#056EFA",
    accentDark: "#02209A",
    accentMid: "#0A4CE8",
    accentLight: "#056EFA",
    accentIce: "#2198F4",
    // Pre-built gradient arrays (dark→light)
    gradientBrand: ["#02209A", "#0A4CE8", "#056EFA"] as readonly [string, string, string],
    gradientAccent: ["#0A4CE8", "#2198F4"] as readonly [string, string],
    gradientSubtle: isDark
      ? (["rgba(10, 76, 232, 0.25)", "rgba(5, 110, 250, 0.06)"] as readonly [string, string])
      : (["rgba(10, 76, 232, 0.08)", "rgba(33, 152, 244, 0.03)"] as readonly [string, string]),
    isDark,
  } as const;
}

export type AppColors = ReturnType<typeof useColors>;
