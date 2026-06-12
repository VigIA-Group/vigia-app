/**
 * Alert Threshold Configuration Screen
 * Allows admins to configure high_density, long_dwell, and crowd thresholds per space.
 */
import { useSupabaseAuth } from "@/src/hooks/use-supabase-auth";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowLeft, Bell, Save } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Switch, TextInput } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";

type AlertType = "high_density" | "long_dwell" | "crowd";

type Threshold = {
  id?: string;
  space_id: string;
  alert_type: AlertType;
  threshold_value: number;
  cooldown_seconds: number;
  is_enabled: boolean;
  webhook_url?: string | null;
};

const ALERT_META: Record<AlertType, { label: string; unit: string; hint: string }> = {
  high_density: {
    label: "Alta densidad",
    unit: "personas",
    hint: "Alertar cuando hay más de N personas simultáneas",
  },
  long_dwell: {
    label: "Permanencia prolongada",
    unit: "segundos",
    hint: "Alertar cuando una persona permanece más de N segundos",
  },
  crowd: {
    label: "Aglomeración",
    unit: "personas",
    hint: "Alertar cuando se detecta una multitud de N o más",
  },
};

const COOLDOWN_OPTIONS = [
  { label: "1 min", value: 60 },
  { label: "5 min", value: 300 },
  { label: "15 min", value: 900 },
  { label: "30 min", value: 1800 },
];

type SpaceThresholds = Record<AlertType, Threshold>;

export default function AlertThresholdsScreen() {
  const router = useRouter();
  const { supabase, ready } = useSupabaseAuth();

  const [spaces, setSpaces] = useState<{ id: string; name: string }[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [thresholds, setThresholds] = useState<SpaceThresholds | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load spaces (from locations)
  useEffect(() => {
    if (!ready) return;
    supabase
      .from("locations")
      .select("id, name")
      .then(({ data, error }) => {
        if (error) {
          console.error("[alerts-config] locations error:", error.message);
          return;
        }
        if (data?.length) {
          const mapped = data.map((l: any) => ({ id: l.id, name: l.name }));
          setSpaces(mapped);
          setSelectedSpace(mapped[0]?.id ?? null);
        }
      });
  }, [supabase, ready]);

  // Load thresholds for selected space
  useEffect(() => {
    if (!ready || !selectedSpace) return;
    setLoading(true);
    supabase
      .from("pa_alert_thresholds")
      .select("*")
      .eq("space_id", selectedSpace)
      .then(({ data, error }) => {
        if (error) {
          setThresholds(null);
          setLoading(false);
          return;
        }
        const rows: Threshold[] = data ?? [];
        const map: Partial<SpaceThresholds> = {};
        rows.forEach((t) => {
          map[t.alert_type] = t;
        });

        // Fill defaults for missing types
        const types: AlertType[] = ["high_density", "long_dwell", "crowd"];
        const defaults: Record<AlertType, number> = {
          high_density: 20,
          long_dwell: 300,
          crowd: 50,
        };
        types.forEach((type) => {
          if (!map[type]) {
            map[type] = {
              space_id: selectedSpace,
              alert_type: type,
              threshold_value: defaults[type],
              cooldown_seconds: 300,
              is_enabled: false,
            };
          }
        });
        setThresholds(map as SpaceThresholds);
        setLoading(false);
      });
  }, [supabase, ready, selectedSpace]);

  const updateThreshold = (type: AlertType, patch: Partial<Threshold>) => {
    setThresholds((prev) => {
      if (!prev) return prev;
      return { ...prev, [type]: { ...prev[type], ...patch } };
    });
  };

  const handleSave = async () => {
    if (!thresholds || !selectedSpace || !ready) return;
    setSaving(true);
    try {
      for (const type of Object.keys(thresholds) as AlertType[]) {
        const t = thresholds[type];
        if (t.id) {
          const { error } = await supabase
            .from("pa_alert_thresholds")
            .update({
              threshold_value: t.threshold_value,
              cooldown_seconds: t.cooldown_seconds,
              is_enabled: t.is_enabled,
            })
            .eq("id", t.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("pa_alert_thresholds").upsert({
            space_id: selectedSpace,
            alert_type: type,
            threshold_value: t.threshold_value,
            cooldown_seconds: t.cooldown_seconds,
            is_enabled: t.is_enabled,
          });
          if (error) throw error;
        }
      }
      Alert.alert("Guardado", "Umbrales actualizados correctamente");
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View flex={1}>
      <LinearGradient colors={["#020617", "#0c1a3a", "#020617"]} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <YStack paddingTop={56} paddingHorizontal={20} paddingBottom={16}>
        <XStack alignItems="center" gap={12} marginBottom={4}>
          <View
            width={36}
            height={36}
            borderRadius={10}
            backgroundColor="#0f172a"
            alignItems="center"
            justifyContent="center"
            pressStyle={{ opacity: 0.6 }}
            onPress={() => router.back()}
          >
            <ArrowLeft size={18} color="#94a3b8" />
          </View>
          <XStack alignItems="center" gap={8}>
            <Bell size={20} color="#f59e0b" />
            <Text fontSize={20} fontWeight="700" color="#ffffff" fontFamily="$body">
              Umbrales de Alerta
            </Text>
          </XStack>
        </XStack>
        <Text fontSize={13} color="#64748b" fontFamily="$body" marginLeft={48}>
          Configura cuándo se emiten alertas por espacio
        </Text>
      </YStack>

      {/* Space selector */}
      {spaces.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ maxHeight: 46 }}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8, flexDirection: "row" }}
        >
          {spaces.map((s) => {
            const active = s.id === selectedSpace;
            return (
              <View
                key={s.id}
                paddingHorizontal={14}
                paddingVertical={8}
                borderRadius={20}
                backgroundColor={active ? "rgba(245,158,11,0.12)" : "#0f172a"}
                borderWidth={1}
                borderColor={active ? "#f59e0b" : "#334155"}
                pressStyle={{ opacity: 0.7 }}
                onPress={() => setSelectedSpace(s.id)}
              >
                <Text
                  fontSize={12}
                  fontWeight={active ? "700" : "400"}
                  color={active ? "#f59e0b" : "#94a3b8"}
                  fontFamily="$body"
                >
                  {s.name}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      )}

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        {loading ? (
          <ActivityIndicator color="#f59e0b" style={{ marginTop: 40 }} />
        ) : thresholds ? (
          <YStack gap={14}>
            {(Object.keys(ALERT_META) as AlertType[]).map((type) => {
              const meta = ALERT_META[type];
              const t = thresholds[type];
              return (
                <YStack
                  key={type}
                  backgroundColor="#0f172a"
                  borderRadius={16}
                  borderWidth={1}
                  borderColor={t.is_enabled ? "rgba(245,158,11,0.3)" : "#1e293b"}
                  padding={16}
                  gap={12}
                >
                  {/* Title + toggle */}
                  <XStack justifyContent="space-between" alignItems="center">
                    <YStack flex={1} gap={2}>
                      <Text fontSize={14} fontWeight="700" color="#ffffff" fontFamily="$body">
                        {meta.label}
                      </Text>
                      <Text fontSize={11} color="#64748b" fontFamily="$body">
                        {meta.hint}
                      </Text>
                    </YStack>
                    <Switch
                      value={t.is_enabled}
                      onValueChange={(v) => updateThreshold(type, { is_enabled: v })}
                      trackColor={{ false: "#1e293b", true: "rgba(245,158,11,0.5)" }}
                      thumbColor={t.is_enabled ? "#f59e0b" : "#334155"}
                    />
                  </XStack>

                  {t.is_enabled && (
                    <>
                      {/* Threshold value */}
                      <YStack gap={6}>
                        <Text fontSize={11} fontWeight="600" color="#94a3b8" fontFamily="$body">
                          Umbral ({meta.unit})
                        </Text>
                        <XStack
                          backgroundColor="#0a0f1e"
                          borderRadius={10}
                          borderWidth={1}
                          borderColor="#334155"
                          alignItems="center"
                          paddingHorizontal={12}
                        >
                          <TextInput
                            style={{
                              flex: 1,
                              color: "#ffffff",
                              fontSize: 16,
                              height: 44,
                              fontWeight: "700",
                            }}
                            value={String(t.threshold_value)}
                            onChangeText={(v) =>
                              updateThreshold(type, { threshold_value: parseInt(v) || 0 })
                            }
                            keyboardType="number-pad"
                          />
                          <Text fontSize={12} color="#64748b" fontFamily="$body">
                            {meta.unit}
                          </Text>
                        </XStack>
                      </YStack>

                      {/* Cooldown selector */}
                      <YStack gap={6}>
                        <Text fontSize={11} fontWeight="600" color="#94a3b8" fontFamily="$body">
                          Tiempo de espera entre alertas
                        </Text>
                        <XStack gap={8} flexWrap="wrap">
                          {COOLDOWN_OPTIONS.map((opt) => {
                            const active = t.cooldown_seconds === opt.value;
                            return (
                              <View
                                key={opt.value}
                                paddingHorizontal={12}
                                paddingVertical={6}
                                borderRadius={10}
                                backgroundColor={active ? "rgba(245,158,11,0.12)" : "#1e293b"}
                                borderWidth={1}
                                borderColor={active ? "#f59e0b" : "#334155"}
                                pressStyle={{ opacity: 0.7 }}
                                onPress={() =>
                                  updateThreshold(type, { cooldown_seconds: opt.value })
                                }
                              >
                                <Text
                                  fontSize={12}
                                  fontWeight={active ? "700" : "400"}
                                  color={active ? "#f59e0b" : "#94a3b8"}
                                  fontFamily="$body"
                                >
                                  {opt.label}
                                </Text>
                              </View>
                            );
                          })}
                        </XStack>
                      </YStack>
                    </>
                  )}
                </YStack>
              );
            })}

            {/* Save button */}
            <View
              height={52}
              borderRadius={14}
              overflow="hidden"
              pressStyle={{ opacity: 0.85 }}
              onPress={handleSave}
              marginTop={8}
            >
              <LinearGradient
                colors={["#78350f", "#d97706", "#fcd34d"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
              <View
                flex={1}
                alignItems="center"
                justifyContent="center"
                flexDirection="row"
                gap={8}
              >
                {saving ? (
                  <ActivityIndicator color="#1a0a00" />
                ) : (
                  <>
                    <Save size={16} color="#1a0a00" />
                    <Text fontSize={15} fontWeight="700" color="#1a0a00" fontFamily="$body">
                      Guardar cambios
                    </Text>
                  </>
                )}
              </View>
            </View>
          </YStack>
        ) : (
          <Text color="#64748b" fontFamily="$body" textAlign="center" marginTop={40}>
            Selecciona un espacio para configurar sus alertas
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
