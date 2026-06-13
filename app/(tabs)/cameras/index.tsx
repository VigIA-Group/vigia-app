import { CameraCard } from "@/src/components/camera-card";
import { PageContainer } from "@/src/components/page-container";
import type { Camera, ModuleId } from "@/src/data/mock";
import { useSupabaseAuth } from "@/src/hooks/use-supabase-auth";
import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { useColors } from "@/src/hooks/use-colors";
import { router } from "expo-router";
import { MotiView } from "moti";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView, Text, View, XStack, YStack } from "tamagui";

type Filter = "Todas" | "Con alertas" | "Online" | "Offline";
const FILTERS: Filter[] = ["Todas", "Con alertas", "Online", "Offline"];

const SERVICE_TO_MODULE: Record<string, ModuleId> = {
  people_analytics: "people",
  person_detection: "people",
  vehicle_plates: "ocr",
  theft_detection: "stolen",
  heat_map: "people",
  intrusion_detection: "intrusion",
  fall_detection: "fall",
  tampering_detection: "tampering",
  ocr: "ocr",
  people: "people",
  intrusion: "intrusion",
  stolen: "stolen",
  fall: "fall",
  tampering: "tampering",
};

function mapDbToCamera(dbCam: any): Camera {
  const services: string[] = dbCam.services ?? [];
  const activeModules = services.map((s) => SERVICE_TO_MODULE[s]).filter(Boolean) as ModuleId[];

  const status: Camera["status"] =
    dbCam.status === "offline" ? "offline" : dbCam.status === "online" ? "online" : "alert";

  return {
    id: dbCam.id,
    name: dbCam.name,
    zone: "",
    floor: "Planta baja",
    room: "",
    activeModules,
    status,
    metrics: {
      peopleDetected: 0,
      alertsToday: 0,
      uptimePercent: status === "offline" ? 0 : 99,
    },
    description: "",
  };
}

function filterCameras(cameras: Camera[], filter: Filter): Camera[] {
  switch (filter) {
    case "Con alertas":
      return cameras.filter((c) => c.status === "alert" || c.metrics.alertsToday > 0);
    case "Online":
      return cameras.filter((c) => c.status === "online");
    case "Offline":
      return cameras.filter((c) => c.status === "offline");
    case "Todas":
    default:
      return cameras;
  }
}

export default function CamerasScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { isDesktop, isWide } = useBreakpoint();
  const { supabase, ready } = useSupabaseAuth();
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<Filter>("Todas");

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;

    async function load() {
      try {
        const { data, error: dbError } = await supabase
          .from("cameras")
          .select("*, camera_services(is_enabled, service_catalog(key))")
          .eq("is_active", true)
          .order("created_at");

        if (dbError) throw new Error(dbError.message);
        if (cancelled) return;

        const flattened = (data ?? []).map((cam: any) => {
          const services = (cam.camera_services ?? [])
            .filter((cs: any) => cs.is_enabled)
            .map((cs: any) => cs.service_catalog?.key)
            .filter(Boolean);
          return mapDbToCamera({ ...cam, services });
        });

        setCameras(flattened);
        setError(null);
      } catch (err: any) {
        if (!cancelled) setError(err.message ?? "Error al cargar cámaras");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [supabase, ready]);

  const filtered = filterCameras(cameras, activeFilter);

  const online = cameras.filter((c) => c.status === "online").length;
  const withAlerts = cameras.filter(
    (c) => c.status === "alert" || c.metrics.alertsToday > 0
  ).length;
  const offline = cameras.filter((c) => c.status === "offline").length;

  return (
    <PageContainer>
      <View flex={1} backgroundColor={colors.bg}>
        {/* Header */}
        <YStack
          paddingTop={insets.top + 8}
          paddingHorizontal={20}
          paddingBottom={12}
          backgroundColor={colors.bg}
          gap={12}
        >
          {/* Title row — on desktop also shows summary inline */}
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={22} fontWeight="700" color={colors.text} fontFamily="$body">
              Cámaras
            </Text>
            {isDesktop && (
              <XStack gap={24}>
                <StatusStat
                  label="Activas"
                  value={online}
                  dotColor="#34d399"
                  animate
                  textColor={colors.text}
                  labelColor={colors.textLabel}
                />
                <StatusStat
                  label="Con alertas"
                  value={withAlerts}
                  dotColor="#f87171"
                  textColor={colors.text}
                  labelColor={colors.textLabel}
                />
                <StatusStat
                  label="Sin señal"
                  value={offline}
                  dotColor="#64748b"
                  textColor={colors.text}
                  labelColor={colors.textLabel}
                />
              </XStack>
            )}
          </XStack>

          {/* Summary card — mobile only */}
          {!isDesktop && (
            <View
              backgroundColor={colors.card}
              borderRadius={12}
              borderWidth={1}
              borderColor={colors.borderSoft}
              padding={12}
            >
              <XStack justifyContent="space-around">
                <StatusStat
                  label="Activas"
                  value={online}
                  dotColor="#34d399"
                  animate
                  textColor={colors.text}
                  labelColor={colors.textLabel}
                />
                <View width={1} backgroundColor={colors.borderSoft} />
                <StatusStat
                  label="Con alertas"
                  value={withAlerts}
                  dotColor="#f87171"
                  textColor={colors.text}
                  labelColor={colors.textLabel}
                />
                <View width={1} backgroundColor={colors.borderSoft} />
                <StatusStat
                  label="Sin señal"
                  value={offline}
                  dotColor="#64748b"
                  textColor={colors.text}
                  labelColor={colors.textLabel}
                />
              </XStack>
            </View>
          )}

          {/* Filter chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack gap={8}>
              {FILTERS.map((f) => {
                const isActive = activeFilter === f;
                return (
                  <View
                    key={f}
                    paddingHorizontal={14}
                    paddingVertical={6}
                    borderRadius={100}
                    backgroundColor={isActive ? "rgba(59,130,246,0.15)" : colors.card}
                    borderWidth={1}
                    borderColor={isActive ? "#3b82f6" : colors.borderSoft}
                    pressStyle={{ opacity: 0.7 }}
                    onPress={() => setActiveFilter(f)}
                  >
                    <Text
                      fontSize={12}
                      fontWeight="600"
                      fontFamily="$body"
                      color={isActive ? "#3b82f6" : colors.textLabel}
                    >
                      {f}
                    </Text>
                  </View>
                );
              })}
            </XStack>
          </ScrollView>
        </YStack>

        {/* Camera list / grid */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
        >
          {!ready || loading ? (
            <YStack flex={1} alignItems="center" justifyContent="center" paddingTop={60} gap={12}>
              <Text fontSize={15} color={colors.textLabel} fontFamily="$body" textAlign="center">
                Cargando cámaras…
              </Text>
            </YStack>
          ) : error ? (
            <YStack flex={1} alignItems="center" justifyContent="center" paddingTop={60} gap={12}>
              <Text fontSize={15} color="#f87171" fontFamily="$body" textAlign="center">
                {error}
              </Text>
            </YStack>
          ) : filtered.length === 0 ? (
            <YStack flex={1} alignItems="center" justifyContent="center" paddingTop={60} gap={12}>
              <Text fontSize={15} color={colors.textLabel} fontFamily="$body" textAlign="center">
                Sin cámaras para este filtro
              </Text>
            </YStack>
          ) : isWide ? (
            /* Desktop / tablet: 2-3 column grid */
            <View flexDirection="row" flexWrap="wrap" gap={12}>
              {filtered.map((camera, idx) => (
                <View
                  key={camera.id}
                  style={{ width: isDesktop ? "calc(33.33% - 8px)" : "calc(50% - 6px)" } as any}
                >
                  <CameraCard
                    camera={camera}
                    videoIndex={idx}
                    onPress={() => router.push(`/(tabs)/cameras/${camera.id}`)}
                  />
                </View>
              ))}
            </View>
          ) : (
            /* Mobile: single column */
            <>
              {filtered.map((camera, idx) => (
                <CameraCard
                  key={camera.id}
                  camera={camera}
                  videoIndex={idx}
                  onPress={() => router.push(`/(tabs)/cameras/${camera.id}`)}
                />
              ))}
            </>
          )}
        </ScrollView>
      </View>
    </PageContainer>
  );
}

function StatusStat({
  label,
  value,
  dotColor,
  animate,
  textColor,
  labelColor,
}: {
  label: string;
  value: number;
  dotColor: string;
  animate?: boolean;
  textColor: string;
  labelColor: string;
}) {
  return (
    <XStack alignItems="center" gap={6}>
      {animate ? (
        <MotiView
          from={{ scale: 1, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0.4 }}
          transition={{ type: "timing", duration: 1200, loop: true }}
        >
          <View width={8} height={8} borderRadius={4} backgroundColor={dotColor} />
        </MotiView>
      ) : (
        <View width={8} height={8} borderRadius={4} backgroundColor={dotColor} />
      )}
      <YStack>
        <Text fontSize={15} fontWeight="700" color={textColor} fontFamily="$mono">
          {value}
        </Text>
        <Text fontSize={10} color={labelColor} fontFamily="$body">
          {label}
        </Text>
      </YStack>
    </XStack>
  );
}
