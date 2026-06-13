import { ModuleCard } from "@/src/components/module-card";
import { ModuleInfoSheet } from "@/src/components/module-info-sheet";
import type { Module } from "@/src/data/mock";
import { useSupabaseAuth } from "@/src/hooks/use-supabase-auth";
import { useColors } from "@/src/hooks/use-colors";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View, XStack } from "tamagui";

const SERVICE_TO_MODULE: Record<string, { id: string; icon: string; color: string }> = {
  people_analytics: { id: "people", icon: "Users", color: "#3b82f6" },
  person_detection: { id: "people", icon: "Users", color: "#3b82f6" },
  vehicle_plates: { id: "ocr", icon: "ScanLine", color: "#3b82f6" },
  theft_detection: { id: "stolen", icon: "PackageX", color: "#f87171" },
  heat_map: { id: "people", icon: "Users", color: "#3b82f6" },
  intrusion_detection: { id: "intrusion", icon: "ShieldAlert", color: "#fbbf24" },
  fall_detection: { id: "fall", icon: "PersonStanding", color: "#fb923c" },
  tampering_detection: { id: "tampering", icon: "Camera", color: "#a78bfa" },
};

const SERVICE_NAMES_ES: Record<string, string> = {
  people_analytics: "Análisis de Personas",
  person_detection: "Detección de Personas",
  vehicle_plates: "Reconocimiento de Placas",
  theft_detection: "Detección de Robos",
  heat_map: "Mapa de Calor",
  intrusion_detection: "Detección de Intrusión",
  fall_detection: "Detección de Caídas",
  tampering_detection: "Detección de Sabotaje",
};

function mapServiceToModule(svc: any): Module {
  const meta = SERVICE_TO_MODULE[svc.key] ?? { id: svc.key, icon: "ShieldAlert", color: "#3b82f6" };
  return {
    id: meta.id as any,
    name: SERVICE_NAMES_ES[svc.key] ?? svc.name,
    description: svc.description ?? "",
    icon: meta.icon,
    color: meta.color,
    stat: "0",
    statLabel: "Activado",
    whatItDetects: [svc.description ?? ""],
    howToUse: "Configurado automáticamente",
    valueGenerated: "",
  };
}

export default function ModulesScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { supabase, ready } = useSupabaseAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;

    supabase
      .from("service_catalog")
      .select("*")
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("[modules] error:", error.message);
        } else {
          setModules((data ?? []).map(mapServiceToModule));
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [supabase, ready]);

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
        {loading ? (
          <Text fontSize={14} color={colors.textLabel} textAlign="center" marginTop={40}>
            Cargando módulos…
          </Text>
        ) : (
          <View flexDirection="row" flexWrap="wrap" gap={12}>
            {modules.map((mod) => (
              <View key={mod.id + mod.name} width="47%">
                <ModuleCard module={mod} onInfoPress={() => setSelectedModule(mod)} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom Sheet */}
      {selectedModule && (
        <ModuleInfoSheet module={selectedModule} onClose={() => setSelectedModule(null)} />
      )}
    </View>
  );
}
