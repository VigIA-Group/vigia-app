import BottomSheet, { BottomSheetScrollView } from "@/src/components/bottom-sheet";
import type { Module, ModuleId } from "@/src/data/mock";
import { useColors } from "@/src/hooks/use-colors";
import {
    Camera,
    ChevronRight,
    PackageX,
    PersonStanding,
    ScanLine,
    ShieldAlert,
    Users,
} from "lucide-react-native";
import { useCallback, useRef } from "react";
import { Text, View, XStack, YStack } from "tamagui";
import { OwlState } from "./owl-state";

const MODULE_ICONS: Record<string, React.ElementType> = {
  ScanLine,
  Users,
  ShieldAlert,
  PackageX,
  PersonStanding,
  Camera,
};

interface ModuleInfoSheetProps {
  module: Module | null;
  onClose: () => void;
}

export function ModuleInfoSheet({ module, onClose }: ModuleInfoSheetProps) {
  const snapPoints = ["60%", "90%"];
  const bottomSheetRef = useRef<BottomSheet>(null);
  const colors = useColors();

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
    onClose();
  }, [onClose]);

  if (!module) return null;

  const IconComponent = MODULE_ICONS[module.icon];

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={0}
      enablePanDownToClose
      onClose={onClose}
      backgroundStyle={{ backgroundColor: colors.card }}
      handleIndicatorStyle={{ backgroundColor: colors.border }}
    >
      <BottomSheetScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        style={{ backgroundColor: colors.card }}
      >
        {/* Header */}
        <YStack
          paddingHorizontal={20}
          paddingTop={16}
          paddingBottom={20}
          alignItems="center"
          gap={8}
          borderBottomWidth={1}
          borderBottomColor={colors.borderSoft}
        >
          <XStack alignItems="center" gap={12} width="100%">
            <View
              width={48}
              height={48}
              borderRadius={12}
              backgroundColor={module.color + "22"}
              alignItems="center"
              justifyContent="center"
            >
              {IconComponent && <IconComponent size={24} color={module.color} />}
            </View>
            <YStack flex={1}>
              <Text fontSize={18} fontWeight="700" color={colors.text} fontFamily="$body">
                {module.name}
              </Text>
              <Text fontSize={12} color={colors.textLabel} fontFamily="$body">
                {module.description}
              </Text>
            </YStack>
            <OwlState variant={module.id as ModuleId} size="small" floating={false} />
          </XStack>
        </YStack>

        {/* Sections */}
        <YStack padding={20} gap={24}>
          {/* Qué detecta */}
          <YStack gap={12}>
            <Text
              fontSize={11}
              fontWeight="700"
              color={colors.textLabel}
              fontFamily="$body"
              letterSpacing={1.2}
            >
              QUÉ DETECTA
            </Text>
            <YStack gap={8}>
              {module.whatItDetects.map((item, i) => (
                <XStack key={i} gap={8} alignItems="flex-start">
                  <View marginTop={3}>
                    <ChevronRight size={12} color="#3b82f6" />
                  </View>
                  <Text
                    fontSize={13}
                    color={colors.textSec}
                    fontFamily="$body"
                    flex={1}
                    lineHeight={19}
                  >
                    {item}
                  </Text>
                </XStack>
              ))}
            </YStack>
          </YStack>

          {/* Cómo usarlo */}
          <YStack gap={10}>
            <Text
              fontSize={11}
              fontWeight="700"
              color={colors.textLabel}
              fontFamily="$body"
              letterSpacing={1.2}
            >
              CÓMO USARLO
            </Text>
            <Text fontSize={13} color={colors.textSec} fontFamily="$body" lineHeight={20}>
              {module.howToUse}
            </Text>
          </YStack>

          {/* Valor generado */}
          <YStack gap={10}>
            <Text
              fontSize={11}
              fontWeight="700"
              color={colors.textLabel}
              fontFamily="$body"
              letterSpacing={1.2}
            >
              VALOR GENERADO
            </Text>
            <Text fontSize={13} color={colors.textSec} fontFamily="$body" lineHeight={20}>
              {module.valueGenerated}
            </Text>
          </YStack>
        </YStack>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
