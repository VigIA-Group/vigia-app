import { getIndustryById } from "@/src/data/industries";
import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { useColors } from "@/src/hooks/use-colors";
import { VideoView, useVideoPlayer } from "expo-video";
import { router, useLocalSearchParams } from "expo-router";
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  Camera,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  ShieldAlert,
} from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";

export default function IndustryAlertDetailScreen() {
  const { industry, id } = useLocalSearchParams<{ industry: string; id: string }>();
  const colors = useColors();
  const { isDesktop } = useBreakpoint();

  const ind = industry ? getIndustryById(industry) : undefined;
  const alert = ind ? ind.alerts.find((a) => a.id === id) : undefined;
  const [reviewed, setReviewed] = useState(alert?.status === "reviewed");

  const player = useVideoPlayer(
    "https://firebasestorage.googleapis.com/v0/b/desarrollo-en-la-nube-7e9ff.firebasestorage.app/o/vigia%2Falert.webm",
    (p) => {
      p.loop = true;
      p.muted = true;
      p.play();
    }
  );

  if (!ind || !alert) {
    return (
      <View flex={1} alignItems="center" justifyContent="center" padding={20}>
        <Text fontSize={16} color={colors.textSec} fontFamily="$body">
          Alerta no encontrada
        </Text>
        <TouchableOpacity
          onPress={() => router.push(`/${industry}/alerts` as any)}
          style={{ marginTop: 12 }}
        >
          <Text fontSize={13} color="#38bdf8" fontWeight="700">
            Volver al listado de alertas
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const color =
    alert.severity === "ALTA" ? "#f87171" : alert.severity === "MEDIA" ? "#f59e0b" : "#38bdf8";

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
          onPress={() => router.push(`/${ind.id}/alerts` as any)}
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
            <View
              backgroundColor={color + "22"}
              paddingHorizontal={8}
              paddingVertical={2}
              borderRadius={4}
            >
              <Text fontSize={10} fontWeight="800" color={color} fontFamily="$mono">
                {alert.severity}
              </Text>
            </View>
            <Text fontSize={18} fontWeight="800" color={colors.text} fontFamily="$body">
              {alert.title}
            </Text>
          </XStack>
          <Text fontSize={12} color={colors.textSec} fontFamily="$body">
            {ind.shortName} · {alert.zone} · {alert.timestamp}
          </Text>
        </YStack>
      </XStack>

      {/* VIDEO CLIP / SNAPSHOT */}
      <View
        borderRadius={16}
        overflow="hidden"
        borderWidth={1}
        borderColor={colors.borderSoft}
        backgroundColor={colors.preview}
      >
        <View height={isDesktop ? 340 : 220} overflow="hidden">
          <VideoView
            style={{ flex: 1 }}
            player={player}
            contentFit="cover"
            allowsFullscreen={false}
          />

          {/* Bounding box simulated overlay */}
          <View
            position="absolute"
            top="30%"
            left="35%"
            width={120}
            height={90}
            borderWidth={2}
            borderColor={color}
            borderRadius={4}
            backgroundColor={color + "15"}
          >
            <View
              backgroundColor={color}
              paddingHorizontal={4}
              paddingVertical={1}
              alignSelf="flex-start"
            >
              <Text fontSize={9} fontWeight="700" color="#ffffff" fontFamily="$mono">
                DETECCIÓN IA 98.4%
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* INCIDENT DETAILS */}
      <View
        backgroundColor={colors.card}
        borderRadius={14}
        borderWidth={1}
        borderColor={colors.borderSoft}
        padding={16}
        gap={12}
      >
        <Text fontSize={14} fontWeight="800" color={colors.text} fontFamily="$body">
          Detalle del Incidente Observado
        </Text>
        <Text fontSize={13} color={colors.textSec} fontFamily="$body" lineHeight={19}>
          {alert.desc}
        </Text>

        <View height={1} backgroundColor={colors.borderSoft} marginVertical={4} />

        <XStack flexWrap="wrap" gap={16}>
          <XStack alignItems="center" gap={8}>
            <Clock size={16} color={colors.textLabel} />
            <YStack>
              <Text fontSize={10} color={colors.textLabel}>
                Hora Detectada
              </Text>
              <Text fontSize={12} fontWeight="700" color={colors.text} fontFamily="$mono">
                {alert.timestamp}
              </Text>
            </YStack>
          </XStack>

          <XStack alignItems="center" gap={8}>
            <MapPin size={16} color={colors.textLabel} />
            <YStack>
              <Text fontSize={10} color={colors.textLabel}>
                Zona Observable
              </Text>
              <Text fontSize={12} fontWeight="700" color={colors.text}>
                {alert.zone}
              </Text>
            </YStack>
          </XStack>

          <XStack alignItems="center" gap={8}>
            <Camera size={16} color={colors.textLabel} />
            <YStack>
              <Text fontSize={10} color={colors.textLabel}>
                Cámara Origen
              </Text>
              <Text fontSize={12} fontWeight="700" color={colors.text}>
                {alert.cameraName}
              </Text>
            </YStack>
          </XStack>
        </XStack>

        {alert.actionTaken && (
          <View
            backgroundColor="rgba(16, 185, 129, 0.1)"
            borderRadius={8}
            padding={12}
            borderWidth={1}
            borderColor="rgba(16, 185, 129, 0.3)"
            gap={4}
          >
            <Text fontSize={11} fontWeight="700" color="#34d399">
              Protocolo / Acción Correctiva Registrada:
            </Text>
            <Text fontSize={11.5} color={colors.textSec}>
              {alert.actionTaken}
            </Text>
          </View>
        )}

        {/* Action Button: Mark Reviewed */}
        <TouchableOpacity
          onPress={() => setReviewed(!reviewed)}
          style={{
            backgroundColor: reviewed ? "rgba(16, 185, 129, 0.15)" : ind.accentColor,
            borderWidth: 1,
            borderColor: reviewed ? "#10b981" : "transparent",
            paddingVertical: 12,
            borderRadius: 10,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
            marginTop: 8,
          }}
        >
          <CheckCircle2 size={16} color={reviewed ? "#34d399" : "#ffffff"} />
          <Text
            fontSize={13}
            fontWeight="700"
            color={reviewed ? "#34d399" : "#ffffff"}
            fontFamily="$body"
          >
            {reviewed ? "Alerta Marcada como Revisada ✓" : "Confirmar Revisión de Alerta"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
