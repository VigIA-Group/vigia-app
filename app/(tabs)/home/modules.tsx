import { ModuleCard } from "@/src/components/module-card";
import { ModuleInfoSheet } from "@/src/components/module-info-sheet";
import type { Module } from "@/src/data/mock";
import { MODULES } from "@/src/data/mock";
import { useColors } from "@/src/hooks/use-colors";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View, XStack } from "tamagui";

export default function ModulesScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  return (
    <View flex={1} backgroundColor={colors.bg}>
      {/* Header */}
      <XStack
        paddingTop={insets.top + 8}
        paddingHorizontal={20}
        paddingBottom={14}
        alignItems="center"
        gap={12}
        backgroundColor={colors.bg}
        borderBottomWidth={1}
        borderBottomColor={colors.borderSoft}
      >
        <View
          width={36}
          height={36}
          borderRadius={10}
          backgroundColor={colors.card}
          alignItems="center"
          justifyContent="center"
          pressStyle={{ opacity: 0.6 }}
          onPress={() => router.back()}
        >
          <ArrowLeft size={18} color={colors.textTer} />
        </View>
        <Text fontSize={18} fontWeight="700" color={colors.text} fontFamily="$body">
          Módulos
        </Text>
      </XStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        <View flexDirection="row" flexWrap="wrap" gap={12}>
          {MODULES.map((mod) => (
            <View key={mod.id} width="47%">
              <ModuleCard module={mod} onInfoPress={() => setSelectedModule(mod)} />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Sheet */}
      {selectedModule && (
        <ModuleInfoSheet module={selectedModule} onClose={() => setSelectedModule(null)} />
      )}
    </View>
  );
}
