import { MotiView } from "moti";
import { View } from "tamagui";

// Floating owl illustration using geometric shapes
// Each variant has a different expression/pose

type OwlVariant =
  | "idle"
  | "empty"
  | "ocr"
  | "people"
  | "intrusion"
  | "stolen"
  | "fall"
  | "tampering";

type OwlSize = "small" | "medium" | "large";

interface OwlStateProps {
  variant?: OwlVariant;
  size?: OwlSize;
  floating?: boolean;
}

const SIZE_MAP: Record<OwlSize, number> = {
  small: 56,
  medium: 96,
  large: 128,
};

const VARIANT_COLORS: Record<OwlVariant, string> = {
  idle: "#056EFA",
  empty: "#64748b",
  ocr: "#6366f1",
  people: "#056EFA",
  intrusion: "#fbbf24",
  stolen: "#f87171",
  fall: "#fb923c",
  tampering: "#a78bfa",
};

export function OwlState({ variant = "idle", size = "medium", floating = true }: OwlStateProps) {
  const dim = SIZE_MAP[size];
  const color = VARIANT_COLORS[variant];
  const isFloating = floating && variant !== "empty";

  const owlContent = (
    <View width={dim} height={dim} alignItems="center" justifyContent="center">
      <OwlSVG size={dim} color={color} variant={variant} />
    </View>
  );

  if (!isFloating) return owlContent;

  return (
    <MotiView
      from={{ translateY: -6 }}
      animate={{ translateY: 6 }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 10,
        loop: true,
      }}
    >
      {owlContent}
    </MotiView>
  );
}

function OwlSVG({ size, color, variant }: { size: number; color: string; variant: OwlVariant }) {
  // Pure React Native View-based owl illustration
  const s = size;
  const bodyW = s * 0.62;
  const bodyH = s * 0.72;
  const eyeSize = s * 0.16;
  const pupilSize = s * 0.08;
  const earSize = s * 0.14;

  const isDark = variant === "empty";

  return (
    <View width={s} height={s} alignItems="center" justifyContent="center">
      {/* Ears (horns) */}
      <View
        position="absolute"
        top={s * 0.04}
        left={s * 0.5 - bodyW * 0.38}
        width={earSize}
        height={earSize * 1.4}
        borderRadius={earSize * 0.3}
        backgroundColor={isDark ? "#334155" : color + "CC"}
        style={{ transform: [{ rotate: "-15deg" }] }}
      />
      <View
        position="absolute"
        top={s * 0.04}
        left={s * 0.5 + bodyW * 0.18}
        width={earSize}
        height={earSize * 1.4}
        borderRadius={earSize * 0.3}
        backgroundColor={isDark ? "#334155" : color + "CC"}
        style={{ transform: [{ rotate: "15deg" }] }}
      />

      {/* Body */}
      <View
        position="absolute"
        top={s * 0.14}
        left={s * 0.5 - bodyW * 0.5}
        width={bodyW}
        height={bodyH}
        borderRadius={bodyW * 0.4}
        backgroundColor={isDark ? "#1e293b" : color + "22"}
        borderWidth={2}
        borderColor={isDark ? "#475569" : color + "66"}
      />

      {/* Belly patch */}
      <View
        position="absolute"
        top={s * 0.38}
        left={s * 0.5 - bodyW * 0.28}
        width={bodyW * 0.56}
        height={bodyH * 0.46}
        borderRadius={bodyW * 0.25}
        backgroundColor={isDark ? "#0f172a" : color + "11"}
        borderWidth={1}
        borderColor={isDark ? "#334155" : color + "33"}
      />

      {/* Left Eye */}
      <View
        position="absolute"
        top={s * 0.24}
        left={s * 0.5 - bodyW * 0.32}
        width={eyeSize}
        height={eyeSize}
        borderRadius={eyeSize * 0.5}
        backgroundColor="#ffffff"
        borderWidth={1.5}
        borderColor={isDark ? "#475569" : color}
        alignItems="center"
        justifyContent="center"
      >
        <View
          width={pupilSize}
          height={pupilSize}
          borderRadius={pupilSize * 0.5}
          backgroundColor={isDark ? "#64748b" : color}
        />
      </View>

      {/* Right Eye */}
      <View
        position="absolute"
        top={s * 0.24}
        left={s * 0.5 + bodyW * 0.08}
        width={eyeSize}
        height={eyeSize}
        borderRadius={eyeSize * 0.5}
        backgroundColor="#ffffff"
        borderWidth={1.5}
        borderColor={isDark ? "#475569" : color}
        alignItems="center"
        justifyContent="center"
      >
        <View
          width={pupilSize}
          height={pupilSize}
          borderRadius={pupilSize * 0.5}
          backgroundColor={isDark ? "#64748b" : color}
        />
      </View>

      {/* Beak */}
      <View
        position="absolute"
        top={s * 0.38}
        left={s * 0.5 - s * 0.04}
        width={s * 0.08}
        height={s * 0.07}
        borderRadius={s * 0.02}
        backgroundColor={isDark ? "#334155" : "#fbbf24"}
      />

      {/* Wing left */}
      <View
        position="absolute"
        top={s * 0.5}
        left={s * 0.5 - bodyW * 0.56}
        width={bodyW * 0.22}
        height={bodyH * 0.36}
        borderRadius={bodyW * 0.15}
        backgroundColor={isDark ? "#334155" : color + "44"}
        style={{ transform: [{ rotate: "15deg" }] }}
      />

      {/* Wing right */}
      <View
        position="absolute"
        top={s * 0.5}
        left={s * 0.5 + bodyW * 0.34}
        width={bodyW * 0.22}
        height={bodyH * 0.36}
        borderRadius={bodyW * 0.15}
        backgroundColor={isDark ? "#334155" : color + "44"}
        style={{ transform: [{ rotate: "-15deg" }] }}
      />

      {/* Feet */}
      <View
        position="absolute"
        bottom={s * 0.02}
        left={s * 0.5 - bodyW * 0.24}
        width={s * 0.12}
        height={s * 0.08}
        borderRadius={s * 0.04}
        backgroundColor={isDark ? "#334155" : "#fbbf24"}
      />
      <View
        position="absolute"
        bottom={s * 0.02}
        left={s * 0.5 + bodyW * 0.06}
        width={s * 0.12}
        height={s * 0.08}
        borderRadius={s * 0.04}
        backgroundColor={isDark ? "#334155" : "#fbbf24"}
      />
    </View>
  );
}
