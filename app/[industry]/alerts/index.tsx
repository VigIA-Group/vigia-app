import { getIndustryById } from "@/src/data/industries";
import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { useColors } from "@/src/hooks/use-colors";
import { router, useLocalSearchParams } from "expo-router";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronRight,
  Filter,
  ShieldAlert,
} from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";

export default function IndustryAlertsScreen() {
  const { industry } = useLocalSearchParams<{ industry: string }>();
  const colors = useColors();
  const { isDesktop } = useBreakpoint();
  const [severityFilter, setSeverityFilter] = useState<string>("Todas");
  const [statusFilter, setStatusFilter] = useState<string>("Todas");

  const ind = industry ? getIndustryById(industry) : undefined;
  if (!ind) return null;

  const alerts = ind.alerts;
  const filteredAlerts = alerts.filter((a) => {
    if (severityFilter !== "Todas" && a.severity !== severityFilter) return false;
    if (statusFilter === "Pendientes" && a.status !== "pending") return false;
    if (statusFilter === "Revisadas" && a.status !== "reviewed") return false;
    return true;
  });

  const highCount = alerts.filter((a) => a.severity === "ALTA").length;
  const medCount = alerts.filter((a) => a.severity === "MEDIA").length;
  const lowCount = alerts.filter((a) => a.severity === "BAJA").length;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        padding: isDesktop ? 28 : 14,
        paddingBottom: 90,
        gap: 20,
      }}
    >
      {/* HEADER & SUMMARY COUNTERS */}
      <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={12}>
        <YStack gap={4}>
          <XStack alignItems="center" gap={8}>
            <Bell size={20} color={ind.accentColor} />
            <Text fontSize={20} fontWeight="800" color={colors.text} fontFamily="$body">
              Alertas del Sector: {ind.shortName}
            </Text>
          </XStack>
          <Text fontSize={12} color={colors.textSec} fontFamily="$body">
            Eventos anómalos detectados automáticamente por videoanalítica en este sector
          </Text>
        </YStack>

        {/* Severity Badges */}
        <XStack
          gap={10}
          backgroundColor={colors.card}
          borderRadius={10}
          padding={10}
          borderWidth={1}
          borderColor={colors.borderSoft}
        >
          <XStack alignItems="center" gap={6}>
            <View width={8} height={8} borderRadius={4} backgroundColor="#f87171" />
            <Text fontSize={12} fontWeight="700" color="#f87171" fontFamily="$mono">
              {highCount} Alta
            </Text>
          </XStack>
          <XStack alignItems="center" gap={6}>
            <View width={8} height={8} borderRadius={4} backgroundColor="#f59e0b" />
            <Text fontSize={12} fontWeight="700" color="#fbbf24" fontFamily="$mono">
              {medCount} Media
            </Text>
          </XStack>
          <XStack alignItems="center" gap={6}>
            <View width={8} height={8} borderRadius={4} backgroundColor="#38bdf8" />
            <Text fontSize={12} fontWeight="700" color="#38bdf8" fontFamily="$mono">
              {lowCount} Baja
            </Text>
          </XStack>
        </XStack>
      </XStack>

      {/* FILTER BUTTONS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack gap={8}>
          {["Todas", "ALTA", "MEDIA", "BAJA"].map((sev) => {
            const isSel = severityFilter === sev;
            return (
              <TouchableOpacity
                key={sev}
                onPress={() => setSeverityFilter(sev)}
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
                  {sev}
                </Text>
              </TouchableOpacity>
            );
          })}
        </XStack>
      </ScrollView>

      {/* ALERTS LIST */}
      <YStack gap={12}>
        {filteredAlerts.length === 0 ? (
          <View
            backgroundColor={colors.card}
            borderRadius={14}
            borderWidth={1}
            borderColor={colors.borderSoft}
            padding={32}
            alignItems="center"
            gap={10}
          >
            <CheckCircle2 size={32} color="#34d399" />
            <Text fontSize={14} fontWeight="700" color={colors.text}>
              No hay alertas para este filtro
            </Text>
            <Text fontSize={12} color={colors.textLabel} textAlign="center">
              Todos los procesos del sector se encuentran operando bajo parámetros estándar.
            </Text>
          </View>
        ) : (
          filteredAlerts.map((alt) => {
            const color =
              alt.severity === "ALTA"
                ? "#f87171"
                : alt.severity === "MEDIA"
                  ? "#f59e0b"
                  : "#38bdf8";

            return (
              <TouchableOpacity
                key={alt.id}
                onPress={() => router.push(`/${ind.id}/alerts/${alt.id}` as any)}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: colors.borderSoft,
                  borderLeftWidth: 4,
                  borderLeftColor: color,
                  padding: 16,
                  gap: 8,
                }}
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <XStack alignItems="center" gap={8} flex={1}>
                    <View
                      backgroundColor={color + "22"}
                      paddingHorizontal={8}
                      paddingVertical={2}
                      borderRadius={4}
                    >
                      <Text fontSize={10} fontWeight="800" color={color} fontFamily="$mono">
                        {alt.severity}
                      </Text>
                    </View>
                    <Text fontSize={13.5} fontWeight="800" color={colors.text} numberOfLines={1}>
                      {alt.title}
                    </Text>
                  </XStack>

                  <Text fontSize={11} color={colors.textLabel} fontFamily="$mono">
                    {alt.timestamp}
                  </Text>
                </XStack>

                <Text fontSize={12} color={colors.textSec} lineHeight={16}>
                  {alt.desc}
                </Text>

                <XStack justifyContent="space-between" alignItems="center" marginTop={4}>
                  <Text fontSize={11} color={colors.textLabel}>
                    Zona: {alt.zone} · {alt.cameraName}
                  </Text>
                  <XStack alignItems="center" gap={4}>
                    <Text fontSize={11} fontWeight="700" color={ind.accentColor}>
                      Ver detalle
                    </Text>
                    <ChevronRight size={13} color={ind.accentColor} />
                  </XStack>
                </XStack>
              </TouchableOpacity>
            );
          })
        )}
      </YStack>
    </ScrollView>
  );
}
