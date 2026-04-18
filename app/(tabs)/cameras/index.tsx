import { CameraCard } from "@/src/components/camera-card";
import { PageContainer } from "@/src/components/page-container";
import type { Camera } from "@/src/data/mock";
import { CAMERAS } from "@/src/data/mock";
import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { useColors } from "@/src/hooks/use-colors";
import { router } from "expo-router";
import { MotiView } from "moti";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView, Text, View, XStack, YStack } from "tamagui";

// Unique rooms derived from camera data
const ALL_ROOMS = Array.from(new Set(CAMERAS.map((c) => c.room)));
type Filter = "Todas" | "Con alertas" | "Planta baja" | "Planta alta" | "Exterior" | string;
const BASE_FILTERS: Filter[] = ["Todas", "Con alertas", "Planta baja", "Planta alta", "Exterior"];
const FILTERS: Filter[] = [...BASE_FILTERS, ...ALL_ROOMS];

function filterCameras(cameras: Camera[], filter: Filter): Camera[] {
  switch (filter) {
    case "Con alertas":
      return cameras.filter((c) => c.status === "alert" || c.metrics.alertsToday > 0);
    case "Planta baja":
      return cameras.filter((c) => c.floor === "Planta baja");
    case "Planta alta":
      return cameras.filter((c) => c.floor === "Planta alta");
    case "Exterior":
      return cameras.filter((c) => c.floor === "Exterior");
    case "Todas":
      return cameras;
    default:
      return cameras.filter((c) => c.room === filter);
  }
}

export default function CamerasScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { isDesktop, isWide } = useBreakpoint();
  const [activeFilter, setActiveFilter] = useState<Filter>("Todas");
  const filtered = filterCameras(CAMERAS, activeFilter);

  const online = CAMERAS.filter((c) => c.status === "online").length;
  const withAlerts = CAMERAS.filter(
    (c) => c.status === "alert" || c.metrics.alertsToday > 0
  ).length;
  const offline = CAMERAS.filter((c) => c.status === "offline").length;

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
          {filtered.length === 0 ? (
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
