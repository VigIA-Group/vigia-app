import type { EventItem } from "@/src/data/mock";
import { getRelativeTime } from "@/src/data/mock";
import {
  Camera,
  PackageX,
  PersonStanding,
  ScanLine,
  ShieldAlert,
  Users,
} from "lucide-react-native";
import { MotiView } from "moti";
import { Text, View, XStack, YStack } from "tamagui";

const MODULE_ICONS: Record<string, React.ElementType> = {
  ocr: ScanLine,
  people: Users,
  intrusion: ShieldAlert,
  stolen: PackageX,
  fall: PersonStanding,
  tampering: Camera,
};

const MODULE_COLORS: Record<string, string> = {
  ocr: "#3b82f6",
  people: "#3b82f6",
  intrusion: "#fbbf24",
  stolen: "#f87171",
  fall: "#fb923c",
  tampering: "#a78bfa",
};

const SEVERITY_CONFIG = {
  ALTA: { bg: "#ef4444", text: "#ffffff" },
  MEDIA: { bg: "#d97706", text: "#ffffff" },
  BAJA: { bg: "#059669", text: "#ffffff" },
};

interface EventItemCardProps {
  event: EventItem;
  onPress?: () => void;
}

export function EventItemCard({ event, onPress }: EventItemCardProps) {
  const IconComponent = MODULE_ICONS[event.module];
  const moduleColor = MODULE_COLORS[event.module];
  const severityConfig = SEVERITY_CONFIG[event.severity];

  return (
    <XStack
      padding={12}
      gap={12}
      alignItems="flex-start"
      pressStyle={{ opacity: 0.7 }}
      onPress={onPress}
    >
      {/* Module icon thumbnail */}
      <View
        width={56}
        height={44}
        borderRadius={10}
        backgroundColor="$backgroundHover"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
      >
        {IconComponent && <IconComponent size={20} color={moduleColor} />}
      </View>

      {/* Event info */}
      <YStack flex={1} gap={3}>
        <Text fontSize={13} fontWeight="600" color="$color" fontFamily="$body" numberOfLines={2}>
          {event.type}
        </Text>
        <Text fontSize={11} color="$placeholderColor" fontFamily="$body" numberOfLines={1}>
          {event.cameraName}
        </Text>
        <XStack alignItems="center" gap={6} marginTop={2}>
          <SeverityBadge severity={event.severity} />
        </XStack>
      </YStack>

      {/* Timestamp */}
      <YStack alignItems="flex-end" gap={4} flexShrink={0}>
        <Text fontSize={11} fontFamily="$mono" color="$placeholderColor">
          {getRelativeTime(event.timestamp)}
        </Text>
        <View
          width={8}
          height={8}
          borderRadius={4}
          backgroundColor={severityConfig.text}
          opacity={event.reviewed ? 0.35 : 1}
        />
      </YStack>
    </XStack>
  );
}

interface SeverityBadgeProps {
  severity: "ALTA" | "MEDIA" | "BAJA";
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const config = SEVERITY_CONFIG[severity];
  const isPulse = severity === "ALTA";

  const badge = (
    <View paddingHorizontal={8} paddingVertical={3} borderRadius={100} backgroundColor={config.bg}>
      <Text
        fontSize={10}
        fontWeight="700"
        fontFamily="$body"
        color={config.text}
        letterSpacing={0.5}
      >
        {severity}
      </Text>
    </View>
  );

  if (!isPulse) return badge;

  return (
    <MotiView
      from={{ scale: 1 }}
      animate={{ scale: 1.03 }}
      transition={{ type: "timing", duration: 1500, loop: true }}
    >
      {badge}
    </MotiView>
  );
}
