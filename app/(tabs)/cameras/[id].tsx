import { EventItemCard } from "@/src/components/event-item-card";
import { ModuleChip } from "@/src/components/module-chip";
import { PageContainer } from "@/src/components/page-container";
import { CAMERAS, getEventsByCameraId } from "@/src/data/mock";
import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { useColors } from "@/src/hooks/use-colors";
import { router, useLocalSearchParams } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { ArrowLeft, Camera as CameraIcon } from "lucide-react-native";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View, XStack, YStack } from "tamagui";

const VIDEO_SOURCES = [
  "https://firebasestorage.googleapis.com/v0/b/desarrollo-en-la-nube-7e9ff.firebasestorage.app/o/vigia%2Fvideo.mp4?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/desarrollo-en-la-nube-7e9ff.firebasestorage.app/o/vigia%2Fvideo2.mp4?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/desarrollo-en-la-nube-7e9ff.firebasestorage.app/o/vigia%2Fvideo3.mp4?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/desarrollo-en-la-nube-7e9ff.firebasestorage.app/o/vigia%2Fvideo4.mp4?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/desarrollo-en-la-nube-7e9ff.firebasestorage.app/o/vigia%2Fvideo5.mp4?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/desarrollo-en-la-nube-7e9ff.firebasestorage.app/o/vigia%2Fvideo6.mp4?alt=media",
];

export default function CameraDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { isDesktop } = useBreakpoint();
  const camera = CAMERAS.find((c) => c.id === id);
  const cameraEvents = camera ? getEventsByCameraId(camera.id) : [];
  const cameraIndex = camera ? CAMERAS.findIndex((c) => c.id === camera.id) : 0;

  const player = useVideoPlayer(VIDEO_SOURCES[cameraIndex % 6], (p) => {
    p.loop = true;
    p.muted = true;
    if (camera && camera.status !== "offline") p.play();
  });

  if (!camera) {
    return (
      <View flex={1} backgroundColor={colors.bg} alignItems="center" justifyContent="center">
        <Text color={colors.textLabel} fontFamily="$body">
          Cámara no encontrada
        </Text>
      </View>
    );
  }

  const isOffline = camera.status === "offline";
  const hasAlert = camera.status === "alert";

  const videoSection = (
    <View borderRadius={16} overflow="hidden" borderWidth={1} borderColor={colors.borderSoft}>
      <View height={isDesktop ? 280 : 220} backgroundColor={colors.preview}>
        {!isOffline ? (
          <VideoView
            style={{ flex: 1 }}
            player={player}
            contentFit="cover"
            allowsFullscreen={false}
          />
        ) : (
          <View flex={1} alignItems="center" justifyContent="center" gap={8}>
            <CameraIcon size={56} color="#334155" opacity={0.4} />
            <Text fontSize={12} color={colors.textLabel} fontFamily="$body">
              Sin señal de video
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const statsSection = (
    <XStack gap={10}>
      {[
        {
          label: "Personas hoy",
          value: String(camera.metrics.peopleDetected),
          color: "#3b82f6",
        },
        {
          label: "Alertas hoy",
          value: String(camera.metrics.alertsToday),
          color: camera.metrics.alertsToday > 0 ? "#f87171" : "#34d399",
        },
        {
          label: "Uptime",
          value: isOffline ? "—" : `${camera.metrics.uptimePercent}%`,
          color: isOffline ? "#64748b" : "#34d399",
        },
      ].map((m) => (
        <YStack
          key={m.label}
          flex={1}
          backgroundColor={colors.card}
          borderRadius={12}
          borderWidth={1}
          borderColor={colors.borderSoft}
          padding={12}
          alignItems="center"
          gap={4}
        >
          <Text fontSize={20} fontWeight="700" fontFamily="$mono" color={m.color}>
            {m.value}
          </Text>
          <Text fontSize={10} color={colors.textLabel} fontFamily="$body" textAlign="center">
            {m.label}
          </Text>
        </YStack>
      ))}
    </XStack>
  );

  const modulesSection = (
    <XStack gap={8} flexWrap="wrap">
      {camera.activeModules.map((modId) => (
        <ModuleChip key={modId} moduleId={modId} />
      ))}
    </XStack>
  );

  const eventsSection = (
    <YStack gap={10}>
      <Text fontSize={16} fontWeight="700" color={colors.text} fontFamily="$body">
        Eventos de esta cámara
      </Text>
      {cameraEvents.length === 0 ? (
        <View
          backgroundColor={colors.card}
          borderRadius={12}
          borderWidth={1}
          borderColor={colors.borderSoft}
          padding={24}
          alignItems="center"
        >
          <Text fontSize={13} color={colors.textLabel} fontFamily="$body">
            Sin eventos registrados
          </Text>
        </View>
      ) : (
        <View
          backgroundColor={colors.card}
          borderRadius={12}
          borderWidth={1}
          borderColor={colors.borderSoft}
          overflow="hidden"
        >
          {cameraEvents.map((evt, i) => (
            <View key={evt.id}>
              {i > 0 && (
                <View height={1} backgroundColor={colors.borderSoft} marginHorizontal={12} />
              )}
              <EventItemCard event={evt} onPress={() => router.push(`/(tabs)/alerts/${evt.id}`)} />
            </View>
          ))}
        </View>
      )}
    </YStack>
  );

  return (
    <PageContainer>
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
          <YStack flex={1}>
            <Text fontSize={16} fontWeight="700" color={colors.text} fontFamily="$body">
              {camera.name}
            </Text>
            <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
              {camera.room} · {camera.floor}
            </Text>
          </YStack>
          <View
            paddingHorizontal={10}
            paddingVertical={4}
            borderRadius={100}
            backgroundColor={
              isOffline
                ? "rgba(100,116,139,0.15)"
                : hasAlert
                  ? "rgba(248,113,113,0.15)"
                  : "rgba(52,211,153,0.15)"
            }
          >
            <Text
              fontSize={11}
              fontWeight="700"
              fontFamily="$body"
              color={isOffline ? "#64748b" : hasAlert ? "#f87171" : "#34d399"}
            >
              {isOffline ? "Offline" : hasAlert ? "Alerta" : "Online"}
            </Text>
          </View>
        </XStack>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 110 }}
        >
          {isDesktop ? (
            /* Desktop: 2 columns */
            <XStack gap={20} padding={20} alignItems="flex-start">
              <YStack flex={3} gap={16}>
                {videoSection}
                {statsSection}
                {modulesSection}
              </YStack>
              <YStack flex={2} gap={16}>
                {eventsSection}
              </YStack>
            </XStack>
          ) : (
            /* Mobile: single column */
            <YStack gap={14} padding={16}>
              {videoSection}
              {modulesSection}
              {statsSection}
              {eventsSection}
            </YStack>
          )}
        </ScrollView>
      </View>
    </PageContainer>
  );
}
