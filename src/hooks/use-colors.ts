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
    bg: isDark ? "#020617" : "#f8fafc",
    card: isDark ? "#0f172a" : "#ffffff",
    cardAlt: isDark ? "#1e293b" : "#f1f5f9",
    // Borders
    border: isDark ? "#334155" : "#cbd5e1", // darker in light for better contrast
    borderSoft: isDark ? "#1e293b" : "#e2e8f0",
    // Text
    text: isDark ? "#ffffff" : "#0f172a",
    textSec: isDark ? "#e2e8f0" : "#334155", // lighter in dark, darker in light
    textTer: isDark ? "#cbd5e1" : "#64748b",
    textLabel: isDark ? "#94a3b8" : "#94a3b8",
    // Tab / navigation
    tabBar: isDark ? "#0f172a" : "#ffffff",
    tabBorder: isDark ? "#1e293b" : "#cbd5e1",
    // BlurView tint
    blurTint: isDark ? ("dark" as const) : ("light" as const),
    // Camera preview background
    preview: isDark ? "#0f172a" : "#cbd5e1",
    // Brand gradient colors
    accent: "#3b82f6",
    accentDark: "#1e3a8a",
    accentMid: "#2563eb",
    accentLight: "#60a5fa",
    accentIce: "#93c5fd",
    // Pre-built gradient arrays (dark→light)
    gradientBrand: ["#1e3a8a", "#3b82f6", "#60a5fa"] as readonly [string, string, string],
    gradientAccent: ["#2563eb", "#60a5fa"] as readonly [string, string],
    gradientSubtle: isDark
      ? (["rgba(30,58,138,0.25)", "rgba(59,130,246,0.10)"] as readonly [string, string])
      : (["rgba(37,99,235,0.08)", "rgba(96,165,250,0.04)"] as readonly [string, string]),
    isDark,
  } as const;
}

export type AppColors = ReturnType<typeof useColors>;
