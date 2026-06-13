import type { ModuleId } from "@/src/data/mock";
import {
  Camera,
  PackageX,
  PersonStanding,
  ScanLine,
  ShieldAlert,
  Users,
} from "lucide-react-native";
import { Text, XStack } from "tamagui";

const MODULE_ICONS: Record<ModuleId, React.ElementType> = {
  ocr: ScanLine,
  people: Users,
  intrusion: ShieldAlert,
  stolen: PackageX,
  fall: PersonStanding,
  tampering: Camera,
};

const MODULE_COLORS: Record<ModuleId, string> = {
  ocr: "#3b82f6",
  people: "#3b82f6",
  intrusion: "#fbbf24",
  stolen: "#f87171",
  fall: "#fb923c",
  tampering: "#a78bfa",
};

const MODULE_NAMES: Record<ModuleId, string> = {
  ocr: "OCR",
  people: "Personas",
  intrusion: "Intrusión",
  stolen: "Robos",
  fall: "Caídas",
  tampering: "Tampering",
};

interface ModuleChipProps {
  moduleId: ModuleId;
  compact?: boolean;
  selected?: boolean;
  onPress?: () => void;
}

export function ModuleChip({
  moduleId,
  compact = false,
  selected = false,
  onPress,
}: ModuleChipProps) {
  const IconComponent = MODULE_ICONS[moduleId];
  const color = MODULE_COLORS[moduleId];
  const name = MODULE_NAMES[moduleId];

  return (
    <XStack
      paddingHorizontal={compact ? 6 : 10}
      paddingVertical={compact ? 3 : 5}
      borderRadius={100}
      backgroundColor={selected ? color + "33" : compact ? "rgba(0,0,0,0.55)" : color + "1A"}
      borderWidth={selected ? 1 : 0}
      borderColor={selected ? color : "transparent"}
      alignItems="center"
      gap={4}
      pressStyle={{ opacity: 0.7 }}
      onPress={onPress}
    >
      {IconComponent && <IconComponent size={compact ? 10 : 12} color={color} />}
      {!compact && (
        <Text fontSize={11} fontWeight="600" fontFamily="$body" color={color}>
          {name}
        </Text>
      )}
    </XStack>
  );
}
