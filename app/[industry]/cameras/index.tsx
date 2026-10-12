import { getIndustryById } from "@/src/data/industries";
import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { useColors } from "@/src/hooks/use-colors";
import { VideoView, useVideoPlayer } from "expo-video";
import { router, useLocalSearchParams } from "expo-router";
import {
  Camera as CameraIcon,
  ChevronRight,
  Filter,
  Layers,
  ShieldAlert,
} from "lucide-react-native";
import { MotiView } from "moti";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";

const VIDEO_SOURCES = [
  "https://firebasestorage.googleapis.com/v0/b/desarrollo-en-la-nube-7e9ff.firebasestorage.app/o/vigia%2Fvideo.mp4?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/desarrollo-en-la-nube-7e9ff.firebasestorage.app/o/vigia%2Fvideo2.mp4?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/desarrollo-en-la-nube-7e9ff.firebasestorage.app/o/vigia%2Fvideo3.mp4?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/desarrollo-en-la-nube-7e9ff.firebasestorage.app/o/vigia%2Fvideo4.mp4?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/desarrollo-en-la-nube-7e9ff.firebasestorage.app/o/vigia%2Fvideo5.mp4?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/desarrollo-en-la-nube-7e9ff.firebasestorage.app/o/vigia%2Fvideo6.mp4?alt=media",
];

export default function IndustryCamerasScreen() {
  const { industry } = useLocalSearchParams<{ industry: string }>();
  const colors = useColors();
  const { isDesktop, isWide } = useBreakpoint();
  const [filter, setFilter] = useState<string>("Todas");

  const ind = industry ? getIndustryById(industry) : undefined;
  if (!ind) return null;

  const cameras = ind.cameras;
  const onlineCount = cameras.filter((c) => c.status === "online").length;
  const alertCount = cameras.filter((c) => c.status === "alert").length;

  const filteredCameras = cameras.filter((c) => {
    if (filter === "Todas") return true;
    if (filter === "Online") return c.status === "online";
    if (filter === "Con Alerta") return c.status === "alert";
    return c.floor === filter || c.room.includes(filter);
  });

  const availableFilters = [
    "Todas",
    "Online",
    "Con Alerta",
    ...Array.from(new Set(cameras.map((c) => c.floor))),
  ];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        padding: isDesktop ? 28 : 14,
        paddingBottom: 90,
        gap: 20,
      }}
    >
      {/* HEADER & SUMMARY */}
      <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={12}>
        <YStack gap={4}>
          <XStack alignItems="center" gap={8}>
            <CameraIcon size={20} color={ind.accentColor} />
            <Text fontSize={20} fontWeight="800" color={colors.text} fontFamily="$body">
              Cámaras del Sector: {ind.shortName}
            </Text>
          </XStack>
          <Text fontSize={12} color={colors.textSec} fontFamily="$body">
            {cameras.length} cámaras IP configuradas con analítica de visión artificial en tiempo
            real
          </Text>
        </YStack>

        {/* Status Counts */}
        <XStack
          gap={16}
          backgroundColor={colors.card}
          borderRadius={10}
          padding={10}
          borderWidth={1}
          borderColor={colors.borderSoft}
        >
          <XStack alignItems="center" gap={6}>
            <View width={8} height={8} borderRadius={4} backgroundColor="#34d399" />
            <Text fontSize={12} fontWeight="700" color={colors.text} fontFamily="$mono">
              {onlineCount} Activas
            </Text>
          </XStack>
          <XStack alignItems="center" gap={6}>
            <View width={8} height={8} borderRadius={4} backgroundColor="#f59e0b" />
            <Text fontSize={12} fontWeight="700" color={colors.text} fontFamily="$mono">
              {alertCount} Con Alerta
            </Text>
          </XStack>
        </XStack>
      </XStack>

      {/* FILTER PILLS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack gap={8}>
          {availableFilters.map((f) => {
            const isSel = filter === f;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                  borderRadius: 100,
                  backgroundColor: isSel ? ind.accentColor + "20" : colors.card,
                  borderWidth: 1,
                  borderColor: isSel ? ind.accentColor : colors.borderSoft,
                }}
              >
                <Text
                  fontSize={11.5}
                  fontWeight={isSel ? "700" : "500"}
                  color={isSel ? ind.accentColor : colors.textLabel}
                  fontFamily="$body"
                >
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </XStack>
      </ScrollView>

      {/* CAMERAS GRID */}
      <XStack flexWrap="wrap" gap={16}>
        {filteredCameras.map((cam, idx) => (
          <CameraPreviewCard
            key={cam.id}
            camera={cam}
            industryId={ind.id}
            accentColor={ind.accentColor}
            videoIndex={cam.streamUrlIndex ?? idx}
          />
        ))}
      </XStack>
    </ScrollView>
  );
}

function CameraPreviewCard({
  camera,
  industryId,
  accentColor,
  videoIndex,
}: {
  camera: any;
  industryId: string;
  accentColor: string;
  videoIndex: number;
}) {
  const colors = useColors();
  const { isDesktop } = useBreakpoint();
  const isAlert = camera.status === "alert";

  const player = useVideoPlayer(VIDEO_SOURCES[videoIndex % 6], (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  return (
    <View
      flex={1}
      minWidth={isDesktop ? 320 : "100%"}
      maxWidth={isDesktop ? "49%" : "100%"}
      backgroundColor={colors.card}
      borderRadius={16}
      borderWidth={1}
      borderColor={isAlert ? "rgba(248, 113, 113, 0.4)" : colors.borderSoft}
      overflow="hidden"
    >
      {/* Video Feed Area */}
      <View height={180} backgroundColor={colors.preview} overflow="hidden">
        <VideoView
          style={{ flex: 1 }}
          player={player}
          contentFit="cover"
          allowsFullscreen={false}
        />

        {/* Live Badge */}
        <View
          position="absolute"
          top={10}
          left={10}
          backgroundColor="rgba(0, 0, 0, 0.65)"
          paddingHorizontal={8}
          paddingVertical={3}
          borderRadius={6}
          flexDirection="row"
          alignItems="center"
          gap={5}
        >
          <View
            width={6}
            height={6}
            borderRadius={3}
            backgroundColor={isAlert ? "#f87171" : "#10b981"}
          />
          <Text fontSize={9.5} fontWeight="700" color="#ffffff" fontFamily="$mono">
            {isAlert ? "EVENTO ACTIVO" : "EN VIVO"}
          </Text>
        </View>

        {/* Floor badge */}
        <View
          position="absolute"
          top={10}
          right={10}
          backgroundColor="rgba(0, 0, 0, 0.65)"
          paddingHorizontal={8}
          paddingVertical={3}
          borderRadius={6}
        >
          <Text fontSize={10} color="#ffffff" fontFamily="$mono">
            {camera.floor}
          </Text>
        </View>
      </View>

      {/* Info Body */}
      <YStack padding={14} gap={8}>
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize={14} fontWeight="800" color={colors.text} numberOfLines={1}>
            {camera.name}
          </Text>
          <Text fontSize={11} color={colors.textLabel} fontFamily="$mono">
            {camera.room}
          </Text>
        </XStack>

        <Text fontSize={11} color={colors.textSec} numberOfLines={2}>
          {camera.description}
        </Text>

        {/* Metrics Row */}
        <XStack
          justifyContent="space-between"
          backgroundColor={colors.bg}
          borderRadius={8}
          padding={8}
          marginTop={4}
        >
          <YStack alignItems="center">
            <Text fontSize={9.5} color={colors.textLabel}>
              Personas
            </Text>
            <Text fontSize={12} fontWeight="800" color={colors.text} fontFamily="$mono">
              {camera.metrics.peopleDetected}
            </Text>
          </YStack>

          <YStack alignItems="center">
            <Text fontSize={9.5} color={colors.textLabel}>
              Alertas Hoy
            </Text>
            <Text
              fontSize={12}
              fontWeight="800"
              color={camera.metrics.alertsToday > 0 ? "#f87171" : "#10b981"}
              fontFamily="$mono"
            >
              {camera.metrics.alertsToday}
            </Text>
          </YStack>

          <YStack alignItems="center">
            <Text fontSize={9.5} color={colors.textLabel}>
              Uptime
            </Text>
            <Text fontSize={12} fontWeight="800" color="#34d399" fontFamily="$mono">
              {camera.metrics.uptimePercent}%
            </Text>
          </YStack>
        </XStack>

        {/* Action Link */}
        <TouchableOpacity
          onPress={() => router.push(`/${industryId}/cameras/${camera.id}` as any)}
          style={{
            backgroundColor: accentColor + "18",
            borderRadius: 8,
            paddingVertical: 9,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 6,
            marginTop: 4,
          }}
        >
          <Text fontSize={11.5} fontWeight="700" color={accentColor}>
            Ver Transmisión & Detecciones
          </Text>
          <ChevronRight size={13} color={accentColor} />
        </TouchableOpacity>
      </YStack>
    </View>
  );
}
