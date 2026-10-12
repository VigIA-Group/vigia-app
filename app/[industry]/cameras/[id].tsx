import { getIndustryById } from "@/src/data/industries";
import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { useColors } from "@/src/hooks/use-colors";
import { VideoView, useVideoPlayer } from "expo-video";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Bell,
  Camera as CameraIcon,
  CheckCircle2,
  Clock,
  Layers,
  ShieldCheck,
  TrendingUp,
} from "lucide-react-native";
import React from "react";
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

export default function IndustryCameraDetailScreen() {
  const { industry, id } = useLocalSearchParams<{ industry: string; id: string }>();
  const colors = useColors();
  const { isDesktop } = useBreakpoint();

  const ind = industry ? getIndustryById(industry) : undefined;
  const camera = ind ? ind.cameras.find((c) => c.id === id) : undefined;
  const cameraAlerts = ind
    ? ind.alerts.filter((a) => a.cameraId === id || a.zone.includes(camera?.room ?? ""))
    : [];

  const videoIndex = camera ? (camera.streamUrlIndex ?? 0) : 0;
  const player = useVideoPlayer(VIDEO_SOURCES[videoIndex % 6], (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  if (!ind || !camera) {
    return (
      <View flex={1} alignItems="center" justifyContent="center" padding={20}>
        <Text fontSize={16} color={colors.textSec} fontFamily="$body">
          Cámara no encontrada
        </Text>
        <TouchableOpacity
          onPress={() => router.push(`/${industry}/cameras` as any)}
          style={{ marginTop: 12 }}
        >
          <Text fontSize={13} color="#38bdf8" fontWeight="700">
            Volver al listado de cámaras
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isAlert = camera.status === "alert";

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        padding: isDesktop ? 28 : 14,
        paddingBottom: 90,
        gap: 20,
      }}
    >
      {/* TOP BAR / BACK */}
      <XStack alignItems="center" gap={12}>
        <TouchableOpacity
          onPress={() => router.push(`/${ind.id}/cameras` as any)}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.borderSoft,
            alignItems: "center" as const,
            justifyContent: "center" as const,
          }}
        >
          <ArrowLeft size={16} color={colors.text} />
        </TouchableOpacity>

        <YStack gap={2}>
          <XStack alignItems="center" gap={8}>
            <Text fontSize={18} fontWeight="800" color={colors.text} fontFamily="$body">
              {camera.name}
            </Text>
            <View
              backgroundColor={isAlert ? "rgba(248, 113, 113, 0.2)" : "rgba(16, 185, 129, 0.2)"}
              paddingHorizontal={8}
              paddingVertical={2}
              borderRadius={4}
            >
              <Text
                fontSize={10}
                fontWeight="700"
                color={isAlert ? "#f87171" : "#34d399"}
                fontFamily="$mono"
              >
                {camera.status.toUpperCase()}
              </Text>
            </View>
          </XStack>
          <Text fontSize={12} color={colors.textSec} fontFamily="$body">
            {ind.shortName} · {camera.room} ({camera.floor})
          </Text>
        </YStack>
      </XStack>

      {/* VIDEO PLAYER */}
      <View
        borderRadius={16}
        overflow="hidden"
        borderWidth={1}
        borderColor={colors.borderSoft}
        backgroundColor={colors.preview}
      >
        <View height={isDesktop ? 360 : 220} overflow="hidden">
          <VideoView
            style={{ flex: 1 }}
            player={player}
            contentFit="cover"
            allowsFullscreen={false}
          />

          {/* Overlay info */}
          <View
            position="absolute"
            top={12}
            left={12}
            backgroundColor="rgba(0, 0, 0, 0.7)"
            paddingHorizontal={10}
            paddingVertical={4}
            borderRadius={6}
            flexDirection="row"
            alignItems="center"
            gap={6}
          >
            <View width={6} height={6} borderRadius={3} backgroundColor="#34d399" />
            <Text fontSize={10} fontWeight="700" color="#ffffff" fontFamily="$mono">
              STREAM RTSP 1080p @ 30 FPS · VIGIA INFERENCE 14.8ms
            </Text>
          </View>
        </View>
      </View>

      {/* TELEMETRY METRICS */}
      <XStack flexWrap="wrap" gap={12}>
        <View
          flex={1}
          minWidth={140}
          backgroundColor={colors.card}
          borderRadius={12}
          borderWidth={1}
          borderColor={colors.borderSoft}
          padding={14}
          gap={4}
        >
          <Text fontSize={11} color={colors.textLabel}>
            Personas Detectadas
          </Text>
          <Text fontSize={22} fontWeight="800" color={colors.text} fontFamily="$mono">
            {camera.metrics.peopleDetected}
          </Text>
        </View>

        <View
          flex={1}
          minWidth={140}
          backgroundColor={colors.card}
          borderRadius={12}
          borderWidth={1}
          borderColor={colors.borderSoft}
          padding={14}
          gap={4}
        >
          <Text fontSize={11} color={colors.textLabel}>
            Alertas Hoy
          </Text>
          <Text
            fontSize={22}
            fontWeight="800"
            color={camera.metrics.alertsToday > 0 ? "#f87171" : "#10b981"}
            fontFamily="$mono"
          >
            {camera.metrics.alertsToday}
          </Text>
        </View>

        <View
          flex={1}
          minWidth={140}
          backgroundColor={colors.card}
          borderRadius={12}
          borderWidth={1}
          borderColor={colors.borderSoft}
          padding={14}
          gap={4}
        >
          <Text fontSize={11} color={colors.textLabel}>
            Disponibilidad (Uptime)
          </Text>
          <Text fontSize={22} fontWeight="800" color="#34d399" fontFamily="$mono">
            {camera.metrics.uptimePercent}%
          </Text>
        </View>

        {camera.metrics.throughputPerHour != null && (
          <View
            flex={1}
            minWidth={140}
            backgroundColor={colors.card}
            borderRadius={12}
            borderWidth={1}
            borderColor={colors.borderSoft}
            padding={14}
            gap={4}
          >
            <Text fontSize={11} color={colors.textLabel}>
              Ritmo / Hora
            </Text>
            <Text fontSize={22} fontWeight="800" color="#38bdf8" fontFamily="$mono">
              {camera.metrics.throughputPerHour} u/h
            </Text>
          </View>
        )}
      </XStack>

      {/* DESCRIPTION & ACTIVE MODULES */}
      <View
        backgroundColor={colors.card}
        borderRadius={14}
        borderWidth={1}
        borderColor={colors.borderSoft}
        padding={16}
        gap={12}
      >
        <Text fontSize={13} fontWeight="800" color={colors.text} fontFamily="$body">
          Descripción del Punto de Monitoreo
        </Text>
        <Text fontSize={12} color={colors.textSec} fontFamily="$body" lineHeight={18}>
          {camera.description}
        </Text>

        <Text fontSize={12} fontWeight="700" color={colors.text} marginTop={4}>
          Módulos de Visión Artificial Activos en esta Cámara:
        </Text>
        <XStack flexWrap="wrap" gap={8}>
          {camera.activeModules.map((m: string) => (
            <View
              key={m}
              backgroundColor="rgba(33, 152, 244, 0.12)"
              borderWidth={1}
              borderColor="rgba(33, 152, 244, 0.3)"
              paddingHorizontal={10}
              paddingVertical={5}
              borderRadius={6}
            >
              <Text fontSize={11} fontWeight="700" color="#38bdf8" fontFamily="$mono">
                {m.toUpperCase()}
              </Text>
            </View>
          ))}
        </XStack>
      </View>

      {/* ALERTS ON THIS CAMERA */}
      <View
        backgroundColor={colors.card}
        borderRadius={14}
        borderWidth={1}
        borderColor={colors.borderSoft}
        padding={16}
        gap={12}
      >
        <XStack alignItems="center" gap={8}>
          <Bell size={16} color={ind.accentColor} />
          <Text fontSize={13} fontWeight="800" color={colors.text} fontFamily="$body">
            Alertas Registradas en este Punto ({cameraAlerts.length})
          </Text>
        </XStack>

        {cameraAlerts.length === 0 ? (
          <Text fontSize={12} color={colors.textLabel}>
            No hay alertas activas para esta cámara en el turno actual.
          </Text>
        ) : (
          <YStack gap={8}>
            {cameraAlerts.map((alt) => (
              <TouchableOpacity
                key={alt.id}
                onPress={() => router.push(`/${ind.id}/alerts/${alt.id}` as any)}
                style={{
                  backgroundColor: colors.bg,
                  borderRadius: 8,
                  padding: 10,
                  borderWidth: 1,
                  borderColor: colors.borderSoft,
                  gap: 3,
                }}
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize={12} fontWeight="700" color={colors.text}>
                    {alt.title}
                  </Text>
                  <Text fontSize={10} color={colors.textLabel} fontFamily="$mono">
                    {alt.timestamp}
                  </Text>
                </XStack>
                <Text fontSize={11} color={colors.textSec}>
                  {alt.desc}
                </Text>
              </TouchableOpacity>
            ))}
          </YStack>
        )}
      </View>
    </ScrollView>
  );
}
