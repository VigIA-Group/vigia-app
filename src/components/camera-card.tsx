import type { Camera } from "@/src/data/mock";
import { useColors } from "@/src/hooks/use-colors";
import { VideoView, useVideoPlayer } from "expo-video";
import {
  Camera as CameraIcon,
  PackageX,
  PersonStanding,
  ScanLine,
  ShieldAlert,
  Users,
} from "lucide-react-native";
import { MotiView } from "moti";
import { Text, View, XStack, YStack } from "tamagui";
import { ModuleChip } from "./module-chip";

const MODULE_ICONS: Record<string, React.ElementType> = {
  ocr: ScanLine,
  people: Users,
  intrusion: ShieldAlert,
  stolen: PackageX,
  fall: PersonStanding,
  tampering: CameraIcon,
};

const VIDEO_SOURCES = [
  require("@/assets/video1.mp4"),
  require("@/assets/video2.mp4"),
  require("@/assets/video3.mp4"),
  require("@/assets/video4.mp4"),
  require("@/assets/video5.mp4"),
  require("@/assets/video6.mp4"),
];

interface CameraCardProps {
  camera: Camera;
  onPress?: () => void;
  videoIndex?: number;
}

export function CameraCard({ camera, onPress, videoIndex = 0 }: CameraCardProps) {
  const hasAlert = camera.status === "alert";
  const isOffline = camera.status === "offline";
  const colors = useColors();

  const player = useVideoPlayer(VIDEO_SOURCES[videoIndex % 6], (p) => {
    p.loop = true;
    p.muted = true;
    if (!isOffline) p.play();
  });

  return (
    <View
      borderRadius={16}
      overflow="hidden"
      backgroundColor="$backgroundStrong"
      borderWidth={1}
      borderColor={hasAlert ? "rgba(248,113,113,0.3)" : "$borderColor"}
      marginBottom={12}
      pressStyle={{ opacity: 0.85 }}
      onPress={onPress}
    >
      {/* Camera Preview Area */}
      <View height={160} backgroundColor={colors.preview} overflow="hidden">
        {/* Video feed */}
        {!isOffline ? (
          <VideoView
            style={{ flex: 1 }}
            player={player}
            contentFit="cover"
            allowsFullscreen={false}
          />
        ) : (
          <View flex={1} alignItems="center" justifyContent="center" opacity={0.3}>
            <CameraIcon size={40} color={colors.border} />
          </View>
        )}

        {/* Camera name overlay — top left */}
        {/* <View
          position="absolute"
          top={8}
          left={8}
          paddingHorizontal={8}
          paddingVertical={4}
          borderRadius={6}
          backgroundColor="rgba(0,0,0,0.7)"
          style={{ backdropFilter: "blur(4px)" } as {}}
        >
          <Text fontSize={11} color="#ffffff" fontFamily="$body" fontWeight="600">
            {camera.name}
          </Text>
        </View> */}

        {/* Status indicator — top right */}
        <View position="absolute" top={10} right={10}>
          {isOffline ? (
            <View width={10} height={10} borderRadius={5} backgroundColor={colors.textLabel} />
          ) : hasAlert ? (
            <MotiView
              from={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1.4, opacity: 0.4 }}
              transition={{ type: "timing", duration: 800, loop: true }}
            >
              <View width={10} height={10} borderRadius={5} backgroundColor="#f87171" />
            </MotiView>
          ) : (
            <MotiView
              from={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1.3, opacity: 0.5 }}
              transition={{ type: "timing", duration: 1200, loop: true }}
            >
              <View width={10} height={10} borderRadius={5} backgroundColor="#34d399" />
            </MotiView>
          )}
        </View>

        {/* Module chips — bottom left */}
        <XStack position="absolute" bottom={8} left={8} gap={4} flexWrap="wrap">
          {camera.activeModules.slice(0, 3).map((moduleId) => (
            <ModuleChip key={moduleId} moduleId={moduleId} compact />
          ))}
        </XStack>
      </View>

      {/* Card info */}
      <YStack padding={12} gap={8}>
        <Text fontSize={14} fontWeight="600" color="$color" fontFamily="$body">
          {camera.name}
        </Text>

        <XStack justifyContent="space-between">
          <MetricCol label="Personas" value={String(camera.metrics.peopleDetected)} />
          <MetricCol
            label="Alertas hoy"
            value={String(camera.metrics.alertsToday)}
            valueColor={camera.metrics.alertsToday > 0 ? "#f87171" : undefined}
          />
          <MetricCol
            label="Uptime"
            value={isOffline ? "—" : `${camera.metrics.uptimePercent}%`}
            valueColor={isOffline ? colors.textLabel : "#34d399"}
          />
        </XStack>
      </YStack>
    </View>
  );
}

function MetricCol({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <YStack alignItems="center" gap={2}>
      <Text fontSize={14} fontFamily="$mono" fontWeight="700" color={valueColor ?? "$color"}>
        {value}
      </Text>
      <Text fontSize={10} color="$placeholderColor" fontFamily="$body">
        {label}
      </Text>
    </YStack>
  );
}
