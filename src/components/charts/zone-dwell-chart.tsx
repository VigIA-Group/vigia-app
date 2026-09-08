/**
 * ZoneDwellChart — Gráfico de barras horizontales de tiempo de permanencia por zona.
 * Muestra el tiempo medio de permanencia de clientes en las distintas áreas de la tienda,
 * diseñado para complementar los mapas de calor con métricas cuantificables.
 */
import { useColors } from "@/src/hooks/use-colors";
import { ZONE_DWELL_TIME } from "@/src/data/mock";
import { Clock, MapPin } from "lucide-react-native";
import { useState } from "react";
import { Text, View, XStack, YStack } from "tamagui";
import { VIGIA_COLORS } from "./chart-theme";

export function ZoneDwellChart() {
  const colors = useColors();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const maxMinutes = Math.max(...ZONE_DWELL_TIME.map((z) => z.avgMinutes), 1);
  const totalDwell = ZONE_DWELL_TIME.reduce((s, z) => s + z.avgMinutes, 0);

  // Paleta de acentos coordinada para las 4 zonas
  const ZONE_COLORS: Record<string, string> = {
    "Entrada": VIGIA_COLORS.blueCyan,
    "Área de Cajas": VIGIA_COLORS.blueVibrant,
    "Pasillos Centro (Góndolas)": VIGIA_COLORS.bluePrimary,
    "Sector Bebidas y Snacks": VIGIA_COLORS.purpleMetric,
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
      <XStack justifyContent="space-between" alignItems="center">
        <XStack alignItems="center" gap={8}>
          <View
            width={28}
            height={28}
            borderRadius={8}
            backgroundColor="rgba(167, 139, 250, 0.15)"
            alignItems="center"
            justifyContent="center"
          >
            <Clock size={15} color={VIGIA_COLORS.purpleMetric} />
          </View>
          <YStack>
            <Text fontSize={14} fontWeight="700" color={colors.text} fontFamily="$heading">
              Tiempo de Permanencia por Zona
            </Text>
            <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
              Promedio por visita de clientes (Total acumulado: ~{totalDwell.toFixed(0)} min)
            </Text>
          </YStack>
        </XStack>
      </XStack>

      {/* Horizontal Bars List */}
      <YStack gap={12}>
        {ZONE_DWELL_TIME.map((item) => {
          const isSelected = selectedZone === item.zone;
          const percentage = Math.round((item.avgMinutes / maxMinutes) * 100);
          const zoneColor = ZONE_COLORS[item.zone] ?? VIGIA_COLORS.blueVibrant;

          return (
            <YStack
              key={item.zone}
              gap={6}
              pressStyle={{ opacity: 0.85 }}
              onPress={() => setSelectedZone(isSelected ? null : item.zone)}
              backgroundColor={isSelected ? colors.cardAlt : "transparent"}
              padding={isSelected ? 8 : 0}
              borderRadius={8}
            >
              {/* Row title & value */}
              <XStack justifyContent="space-between" alignItems="center">
                <XStack alignItems="center" gap={6} flex={1}>
                  <MapPin size={12} color={zoneColor} />
                  <Text
                    fontSize={12}
                    fontWeight={isSelected ? "700" : "500"}
                    color={colors.text}
                    fontFamily="$body"
                    numberOfLines={1}
                  >
                    {item.zone}
                  </Text>
                  <Text fontSize={10} color={colors.textLabel} fontFamily="$mono">
                    ({item.cameraId})
                  </Text>
                </XStack>

                <XStack alignItems="center" gap={4}>
                  <Text
                    fontSize={13}
                    fontWeight="800"
                    color={zoneColor}
                    fontFamily="$mono"
                  >
                    {item.avgMinutes.toFixed(1)}
                  </Text>
                  <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
                    min
                  </Text>
                </XStack>
              </XStack>

              {/* Progress bar with rounded corners */}
              <View
                height={8}
                borderRadius={4}
                backgroundColor={colors.cardAlt}
                overflow="hidden"
              >
                <View
                  height={8}
                  borderRadius={4}
                  backgroundColor={zoneColor}
                  width={`${percentage}%` as `${number}%`}
                />
              </View>

              {/* Zone context hint when tapped */}
              {isSelected && (
                <XStack justifyContent="space-between" alignItems="center" marginTop={2}>
                  <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
                    Representa el {((item.avgMinutes / totalDwell) * 100).toFixed(0)}% del tiempo total de compra
                  </Text>
                  <Text fontSize={10} color={zoneColor} fontFamily="$body" fontWeight="600">
                    {item.zone.includes("Góndolas") ? "Zona de mayor retención" : "Zona de tránsito"}
                  </Text>
                </XStack>
              )}
            </YStack>
          );
        })}
      </YStack>
    </YStack>
  );
}
