import type { Module } from "@/src/data/mock";
import { LinearGradient } from "expo-linear-gradient";
import {
    Camera,
    Info,
    PackageX,
    PersonStanding,
    ScanLine,
    ShieldAlert,
    Users,
} from "lucide-react-native";
import { Text, View, XStack, YStack } from "tamagui";

const MODULE_ICONS: Record<string, React.ElementType> = {
  ScanLine,
  Users,
  ShieldAlert,
  PackageX,
  PersonStanding,
  Camera,
};

interface ModuleCardProps {
  module: Module;
  onInfoPress?: () => void;
  onPress?: () => void;
}

export function ModuleCard({ module, onInfoPress, onPress }: ModuleCardProps) {
  const IconComponent = MODULE_ICONS[module.icon];

  return (
    <YStack
      flex={1}
      backgroundColor="$backgroundStrong"
      borderRadius={14}
      overflow="hidden"
      borderWidth={1}
      borderColor="$borderColor"
      pressStyle={{ opacity: 0.85 }}
      onPress={onPress}
    >
      {/* Top accent — brand gradient */}
      <LinearGradient
        colors={["#1e3a8a", module.color]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ height: 3 }}
      />

      <YStack padding={14} gap={8} flex={1}>
        {/* Header row */}
        <XStack justifyContent="space-between" alignItems="flex-start">
          {IconComponent && <IconComponent size={24} color={module.color} />}
          <View
            pressStyle={{ opacity: 0.6 }}
            onPress={onInfoPress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Info size={14} color="#64748b" />
          </View>
        </XStack>

        {/* Name */}
        <Text fontSize={13} fontWeight="600" color="$color" fontFamily="$body" numberOfLines={2}>
          {module.name}
        </Text>

        {/* Description */}
        <Text
          fontSize={11}
          color="$placeholderColor"
          fontFamily="$body"
          numberOfLines={2}
          lineHeight={15}
        >
          {module.description}
        </Text>

        {/* Stat */}
        <XStack alignItems="baseline" gap={4} marginTop="auto">
          <Text fontSize={20} fontFamily="$mono" fontWeight="700" color={module.color}>
            {module.stat}
          </Text>
          <Text fontSize={10} color="$placeholderColor" fontFamily="$body">
            {module.statLabel}
          </Text>
        </XStack>
      </YStack>
    </YStack>
  );
}
