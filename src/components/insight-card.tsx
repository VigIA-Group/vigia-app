import type { Insight } from "@/src/data/mock";
import { useColors } from "@/src/hooks/use-colors";
import { AlertCircle, AlertTriangle, CheckCircle2, ChevronRight, Info } from "lucide-react-native";
import { Text, View, XStack, YStack } from "tamagui";

const TYPE_CONFIG = {
  positive: {
    color: "#059669",
    Icon: CheckCircle2,
    bg: "rgba(5,150,105,0.12)",
    solidBg: "#059669",
  },
  warning: {
    color: "#d97706",
    Icon: AlertTriangle,
    bg: "rgba(217,119,6,0.12)",
    solidBg: "#d97706",
  },
  critical: { color: "#dc2626", Icon: AlertCircle, bg: "rgba(220,38,38,0.12)", solidBg: "#dc2626" },
  info: { color: "#7c3aed", Icon: Info, bg: "rgba(124,58,237,0.12)", solidBg: "#7c3aed" },
};

interface InsightCardProps {
  insight: Insight;
  compact?: boolean;
  onPress?: () => void;
}

export function InsightCard({ insight, compact = false, onPress }: InsightCardProps) {
  const colors = useColors();
  const { color, Icon, bg, solidBg } = TYPE_CONFIG[insight.type];

  return (
    <View
      backgroundColor={colors.card}
      borderRadius={14}
      borderWidth={1}
      borderColor={colors.borderSoft}
      borderLeftWidth={3}
      borderLeftColor={color}
      padding={14}
      pressStyle={onPress ? { opacity: 0.8 } : {}}
      onPress={onPress}
    >
      <XStack gap={12} alignItems="flex-start">
        {/* Icon */}
        <View
          width={36}
          height={36}
          borderRadius={10}
          backgroundColor={bg}
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          <Icon size={18} color={color} />
        </View>

        {/* Content */}
        <YStack flex={1} gap={4}>
          <XStack justifyContent="space-between" alignItems="flex-start">
            <Text
              fontSize={13}
              fontWeight="700"
              color={colors.text}
              fontFamily="$body"
              flex={1}
              numberOfLines={2}
            >
              {insight.title}
            </Text>
            {insight.metric && (
              <View
                marginLeft={8}
                paddingHorizontal={7}
                paddingVertical={2}
                borderRadius={20}
                backgroundColor={solidBg}
                flexShrink={0}
              >
                <Text fontSize={10} color="#ffffff" fontFamily="$mono" fontWeight="700">
                  {insight.metric}
                </Text>
              </View>
            )}
          </XStack>

          <Text
            fontSize={12}
            color={colors.textSec}
            fontFamily="$body"
            lineHeight={17}
            numberOfLines={compact ? 2 : undefined}
          >
            {insight.description}
          </Text>

          {!compact && (
            <XStack
              marginTop={6}
              paddingTop={8}
              borderTopWidth={1}
              borderTopColor={colors.borderSoft}
              gap={6}
              alignItems="flex-start"
            >
              <ChevronRight size={13} color={color} style={{ marginTop: 1 }} />
              <Text
                fontSize={12}
                color={colors.textTer}
                fontFamily="$body"
                lineHeight={17}
                flex={1}
                fontStyle="italic"
              >
                {insight.recommendation}
              </Text>
            </XStack>
          )}
        </YStack>
      </XStack>
    </View>
  );
}
