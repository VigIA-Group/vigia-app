import { useColors } from "@/src/hooks/use-colors";
import { Image } from "expo-image";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Camera,
  CheckCircle2,
  Clock,
  DollarSign,
  PlayCircle,
  Send,
  ShieldAlert,
} from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";

export interface VisualAlertItem {
  id: string;
  title: string;
  desc: string;
  timestamp: string;
  severity: "ALTA" | "MEDIA" | "BAJA";
  zone: string;
  cameraName: string;
  imageSource: any;
  detectionBoxLabel?: string;
  financialImpact?: string;
  actionSucceededLabel?: string;
}

interface VisualAlertCardProps {
  alert: VisualAlertItem;
  onPress?: () => void;
  onAction?: (action: string) => void;
}

export function VisualAlertCard({ alert, onPress, onAction }: VisualAlertCardProps) {
  const colors = useColors();
  const [resolved, setResolved] = useState<boolean>(false);

  const getSeverityColor = (sev: VisualAlertItem["severity"]) => {
    switch (sev) {
      case "ALTA":
        return "#ef4444";
      case "MEDIA":
        return "#f59e0b";
      case "BAJA":
      default:
        return "#38bdf8";
    }
  };

  const sevColor = getSeverityColor(alert.severity);

  return (
    <View
      backgroundColor={colors.card}
      borderRadius={14}
      borderWidth={1}
      borderColor={resolved ? "rgba(16, 185, 129, 0.4)" : colors.borderSoft}
      overflow="hidden"
      opacity={resolved ? 0.75 : 1}
    >
      <XStack flexDirection="column" gap={0}>
        {/* TOP: SNAPSHOT IMAGE WITH BOUNDING BOX HUD */}
        <View height={150} backgroundColor="#000000" position="relative" overflow="hidden">
          <Image
            source={alert.imageSource}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />

          {/* Vignette */}
          <View
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            backgroundColor="rgba(5, 14, 29, 0.25)"
          />

          {/* Simulated AI Bounding Box overlay */}
          <View
            position="absolute"
            top="20%"
            left="25%"
            width="45%"
            height="55%"
            borderWidth={2}
            borderColor={sevColor}
            borderRadius={4}
            backgroundColor={
              alert.severity === "ALTA" ? "rgba(239, 68, 68, 0.15)" : "rgba(245, 158, 11, 0.15)"
            }
          >
            {/* HUD Corner Reticles */}
            <View
              position="absolute"
              top={-2}
              left={-2}
              width={6}
              height={6}
              borderTopWidth={2}
              borderLeftWidth={2}
              borderColor={sevColor}
            />
            <View
              position="absolute"
              top={-2}
              right={-2}
              width={6}
              height={6}
              borderTopWidth={2}
              borderRightWidth={2}
              borderColor={sevColor}
            />
            <View
              position="absolute"
              bottom={-2}
              left={-2}
              width={6}
              height={6}
              borderBottomWidth={2}
              borderLeftWidth={2}
              borderColor={sevColor}
            />
            <View
              position="absolute"
              bottom={-2}
              right={-2}
              width={6}
              height={6}
              borderBottomWidth={2}
              borderRightWidth={2}
              borderColor={sevColor}
            />

            {/* Label Chip */}
            <View
              position="absolute"
              top={-18}
              left={-2}
              backgroundColor={sevColor}
              paddingHorizontal={5}
              paddingVertical={1}
              borderRadius={3}
            >
              <Text fontSize={9} fontWeight="800" color="#ffffff" fontFamily="$mono">
                {alert.detectionBoxLabel || "ANOMALÍA DETECTADA"}
              </Text>
            </View>
          </View>

          {/* Top Camera & Timestamp Bar */}
          <View
            position="absolute"
            top={8}
            left={8}
            backgroundColor="rgba(0, 0, 0, 0.75)"
            paddingHorizontal={7}
            paddingVertical={3}
            borderRadius={5}
            borderWidth={1}
            borderColor="rgba(255, 255, 255, 0.15)"
          >
            <XStack alignItems="center" gap={4}>
              <Camera size={11} color="#38bdf8" />
              <Text fontSize={10} color="#ffffff" fontFamily="$mono" fontWeight="700">
                {alert.cameraName}
              </Text>
            </XStack>
          </View>

          <View
            position="absolute"
            top={8}
            right={8}
            backgroundColor={
              alert.severity === "ALTA"
                ? "rgba(239, 68, 68, 0.9)"
                : alert.severity === "MEDIA"
                  ? "rgba(245, 158, 11, 0.9)"
                  : "rgba(56, 189, 248, 0.9)"
            }
            paddingHorizontal={7}
            paddingVertical={3}
            borderRadius={5}
          >
            <Text fontSize={9.5} color="#ffffff" fontFamily="$mono" fontWeight="800">
              {alert.severity} PRIORIDAD
            </Text>
          </View>

          {/* Bottom Timestamp */}
          <View
            position="absolute"
            bottom={8}
            left={8}
            backgroundColor="rgba(0, 0, 0, 0.75)"
            paddingHorizontal={6}
            paddingVertical={2}
            borderRadius={4}
          >
            <XStack alignItems="center" gap={4}>
              <Clock size={10} color="#94a3b8" />
              <Text fontSize={9.5} color="#cbd5e1" fontFamily="$mono">
                {alert.timestamp} · {alert.zone}
              </Text>
            </XStack>
          </View>
        </View>

        {/* BOTTOM: ALERT TEXT & BUSINESS FINANCIAL IMPACT */}
        <YStack padding={14} gap={10}>
          <YStack gap={3}>
            <Text fontSize={13.5} fontWeight="800" color={colors.text} fontFamily="$body">
              {alert.title}
            </Text>
            <Text fontSize={11} color={colors.textSec} fontFamily="$body" lineHeight={16}>
              {alert.desc}
            </Text>
          </YStack>

          {/* Dollar / Operational impact box */}
          {alert.financialImpact && (
            <View
              backgroundColor="rgba(239, 68, 68, 0.08)"
              borderRadius={8}
              padding={8}
              borderWidth={1}
              borderColor="rgba(239, 68, 68, 0.25)"
            >
              <XStack alignItems="center" gap={6}>
                <DollarSign size={13} color="#f87171" />
                <Text fontSize={10.5} fontWeight="700" color="#f87171" fontFamily="$body" flex={1}>
                  {alert.financialImpact}
                </Text>
              </XStack>
            </View>
          )}

          {/* Action buttons */}
          <XStack justifyContent="space-between" alignItems="center" gap={8} marginTop={2}>
            {resolved ? (
              <XStack alignItems="center" gap={6}>
                <CheckCircle2 size={15} color="#34d399" />
                <Text fontSize={11} fontWeight="700" color="#34d399" fontFamily="$body">
                  Alerta atendida por el personal
                </Text>
              </XStack>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setResolved(true);
                    if (onAction) onAction("notify");
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: "#2198F4",
                    borderRadius: 6,
                    paddingVertical: 7,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 5,
                  }}
                >
                  <Send size={12} color="#ffffff" />
                  <Text fontSize={11} fontWeight="800" color="#ffffff">
                    Notificar a Salón
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setResolved(true);
                    if (onAction) onAction("resolve");
                  }}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.06)",
                    borderWidth: 1,
                    borderColor: colors.borderSoft,
                    borderRadius: 6,
                    paddingHorizontal: 10,
                    paddingVertical: 7,
                  }}
                >
                  <Text fontSize={11} fontWeight="700" color={colors.textSec}>
                    Resolver
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {onPress && (
              <TouchableOpacity onPress={onPress} style={{ padding: 4 }}>
                <ArrowRight size={15} color={colors.textLabel} />
              </TouchableOpacity>
            )}
          </XStack>
        </YStack>
      </XStack>
    </View>
  );
}

