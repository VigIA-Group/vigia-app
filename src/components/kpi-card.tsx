import type { KPI } from "@/src/data/mock";
import { LinearGradient } from "expo-linear-gradient";
import { AlertTriangle, Cctv, ShoppingCart, Timer, TrendingUp, Users } from "lucide-react-native";
import { MotiView } from "moti";
import { Text, XStack, YStack } from "tamagui";

const ICON_MAP: Record<string, React.ElementType> = {
  Users,
  TrendingUp,
  AlertTriangle,
  Timer,
  Cctv,
  ShoppingCart,
};

interface KPICardProps {
  kpi: KPI;
  index: number;
}

export function KPICard({ kpi, index }: KPICardProps) {
  const IconComponent = ICON_MAP[kpi.icon];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 16 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 350, delay: index * 80 }}
    >
      <YStack
        width={154}
        backgroundColor="$backgroundStrong"
        borderRadius={14}
        overflow="hidden"
        borderWidth={1}
        borderColor="$borderColor"
      >
        {/* Top accent bar — VigIA brand gradient */}
        <LinearGradient
          colors={["#02209A", kpi.accentColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ height: 3 }}
        />

        <YStack padding={14} gap={6}>
          <XStack justifyContent="space-between" alignItems="center">
            <Text
              fontSize={11}
              color="$placeholderColor"
              fontFamily="$body"
              fontWeight="600"
              numberOfLines={1}
            >
              {kpi.label}
            </Text>
            {IconComponent && <IconComponent size={15} color={kpi.accentColor} />}
          </XStack>

          <Text
            fontSize={23}
            fontFamily="$heading"
            fontWeight="800"
            color="$color"
            letterSpacing={-0.5}
          >
            {kpi.value}
          </Text>

          <XStack alignItems="center" gap={4}>
            <Text
              fontSize={11}
              fontFamily="$mono"
              color={kpi.changePositive ? "#34d399" : "#f87171"}
              fontWeight="600"
            >
              {kpi.changePositive ? "↑" : "↓"} {kpi.change}
            </Text>
            <Text fontSize={10} color="$placeholderColor" fontFamily="$body">
              vs ayer
            </Text>
          </XStack>
        </YStack>
      </YStack>
    </MotiView>
  );
}
