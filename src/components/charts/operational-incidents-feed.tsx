/**
 * OperationalIncidentsFeed — Registro interactivo de incidentes de cumplimiento operativo y protocolos de personal.
 */
import { OPERATIONS_METRICS, OperationalIncident } from "@/src/data/mock";
import { useColors } from "@/src/hooks/use-colors";
import {
  Camera,
  Clock,
  ShieldAlert,
  Shirt,
  Smartphone,
  Users,
} from "lucide-react-native";
import { useState } from "react";
import { Text, View, XStack, YStack } from "tamagui";
import { VIGIA_COLORS } from "./chart-theme";

type IncidentFilter = "all" | "uniform_missing" | "phone_distraction" | "unattended_checkout" | "late_opening";

export function OperationalIncidentsFeed() {
  const colors = useColors();
  const [filter, setFilter] = useState<IncidentFilter>("all");
  const [incidents, setIncidents] = useState<OperationalIncident[]>(
    OPERATIONS_METRICS.recentIncidents
  );

  const filteredIncidents = incidents.filter((inc) => {
    if (filter === "all") return true;
    return inc.type === filter;
  });

  const getIncidentIcon = (type: OperationalIncident["type"]) => {
    switch (type) {
      case "phone_distraction":
        return Smartphone;
      case "unattended_checkout":
        return Users;
      case "late_opening":
        return Clock;
      case "uniform_missing":
      default:
        return Shirt;
    }
  };

  const getIncidentColor = (severity: OperationalIncident["severity"]) => {
    switch (severity) {
      case "high":
        return VIGIA_COLORS.redDanger;
      case "medium":
        return VIGIA_COLORS.amberWarning;
      case "low":
      default:
        return VIGIA_COLORS.blueVibrant;
    }
  };

  const toggleResolution = (id: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, resolved: !inc.resolved } : inc))
    );
  };

  return (
    <YStack
      backgroundColor={colors.card}
      borderRadius={16}
      borderWidth={1}
      borderColor={colors.borderSoft}
      padding={18}
      gap={14}
    >
      {/* Header */}
      <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={8}>
        <XStack alignItems="center" gap={8}>
          <View
            width={30}
            height={30}
            borderRadius={8}
            backgroundColor="rgba(99, 102, 241, 0.15)"
            alignItems="center"
            justifyContent="center"
          >
            <ShieldAlert size={16} color={VIGIA_COLORS.indigoOcr} />
          </View>
          <YStack>
            <Text fontSize={14} fontWeight="700" color={colors.text} fontFamily="$heading">
              Bitácora de Incidentes de Operaciones (IA en Vivo)
            </Text>
            <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
              Registro continuo de desvíos de protocolo, distracciones y alertas de puesto
            </Text>
          </YStack>
        </XStack>

        <Text fontSize={11} color={colors.textLabel} fontFamily="$mono">
          {filteredIncidents.length} evento{filteredIncidents.length !== 1 ? "s" : ""}
        </Text>
      </XStack>

      {/* Filter pills */}
      <XStack backgroundColor={colors.cardAlt} borderRadius={8} padding={3} gap={2} flexWrap="wrap">
        {(
          [
            { key: "all", label: "Todos" },
            { key: "uniform_missing", label: "Uniforme/EPP" },
            { key: "phone_distraction", label: "Uso Celular" },
            { key: "unattended_checkout", label: "Cajas Vacías" },
            { key: "late_opening", label: "Puntualidad" },
          ] as const
        ).map((f) => (
          <View
            key={f.key}
            paddingHorizontal={10}
            paddingVertical={5}
            borderRadius={6}
            backgroundColor={filter === f.key ? VIGIA_COLORS.bluePrimary : "transparent"}
            pressStyle={{ opacity: 0.8 }}
            onPress={() => setFilter(f.key)}
          >
            <Text
              fontSize={10.5}
              fontWeight={filter === f.key ? "700" : "500"}
              color={filter === f.key ? "#ffffff" : colors.textLabel}
              fontFamily="$body"
            >
              {f.label}
            </Text>
          </View>
        ))}
      </XStack>

      {/* Incidents list */}
      <YStack gap={8}>
        {filteredIncidents.map((inc) => {
          const Icon = getIncidentIcon(inc.type);
          const color = getIncidentColor(inc.severity);

          return (
            <XStack
              key={inc.id}
              backgroundColor={colors.cardAlt}
              borderRadius={12}
              borderWidth={1}
              borderColor={inc.resolved ? colors.borderSoft : color}
              padding={12}
              justifyContent="space-between"
              alignItems="flex-start"
              gap={10}
            >
              <XStack gap={10} flex={1}>
                <View
                  width={34}
                  height={34}
                  borderRadius={8}
                  backgroundColor={
                    inc.severity === "high"
                      ? "rgba(248, 113, 113, 0.15)"
                      : inc.severity === "medium"
                        ? "rgba(251, 191, 36, 0.15)"
                        : "rgba(5, 110, 250, 0.12)"
                  }
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon size={16} color={color} />
                </View>

                <YStack flex={1} gap={3}>
                  <XStack alignItems="center" gap={6} flexWrap="wrap">
                    <Text fontSize={12} fontWeight="700" color={colors.text} fontFamily="$body">
                      {inc.title}
                    </Text>
                    <XStack
                      backgroundColor="rgba(255, 255, 255, 0.06)"
                      paddingHorizontal={6}
                      paddingVertical={2}
                      borderRadius={4}
                      alignItems="center"
                      gap={3}
                    >
                      <Camera size={9} color={colors.textLabel} />
                      <Text fontSize={9} color={colors.textLabel} fontFamily="$mono">
                        {inc.cameraId}
                      </Text>
                    </XStack>
                    <Text fontSize={10} color={colors.textLabel} fontFamily="$mono">
                      {inc.time} h
                    </Text>
                  </XStack>

                  <Text fontSize={11} color={colors.textSec} fontFamily="$body" lineHeight={15}>
                    {inc.description}
                  </Text>

                  <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
                    Ubicación: <Text color={colors.text}>{inc.zone}</Text>
                    {inc.durationMinutes ? ` · Duración: ${inc.durationMinutes} min` : ""}
                  </Text>
                </YStack>
              </XStack>

              {/* Status Pill with Toggle */}
              <View
                backgroundColor={
                  inc.resolved ? "rgba(52, 211, 153, 0.15)" : "rgba(248, 113, 113, 0.15)"
                }
                paddingHorizontal={8}
                paddingVertical={4}
                borderRadius={6}
                pressStyle={{ opacity: 0.7 }}
                onPress={() => toggleResolution(inc.id)}
              >
                <Text
                  fontSize={10}
                  fontWeight="700"
                  color={inc.resolved ? VIGIA_COLORS.emeraldSuccess : VIGIA_COLORS.redDanger}
                  fontFamily="$mono"
                >
                  {inc.resolved ? "Resuelta" : "Pendiente"}
                </Text>
              </View>
            </XStack>
          );
        })}
      </YStack>
    </YStack>
  );
}
