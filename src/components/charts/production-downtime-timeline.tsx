/**
 * ProductionDowntimeTimeline — Bitácora cronológica de paradas de línea detectadas por visión artificial.
 */
import { PRODUCTION_METRICS, ProductionDowntimeEvent } from "@/src/data/mock";
import { useColors } from "@/src/hooks/use-colors";
import {
  AlertOctagon,
  Camera,
  CheckCircle2,
  Clock,
  PauseCircle,
  Wrench,
  ZapOff,
} from "lucide-react-native";
import { useState } from "react";
import { Text, View, XStack, YStack } from "tamagui";
import { VIGIA_COLORS } from "./chart-theme";

type FilterType = "all" | "mechanical" | "cleaning";

export function ProductionDowntimeTimeline() {
  const colors = useColors();
  const rawLog = PRODUCTION_METRICS.downtimeLog;
  const [filter, setFilter] = useState<FilterType>("all");
  const [log, setLog] = useState<ProductionDowntimeEvent[]>(rawLog);

  const filteredLog = log.filter((item) => {
    if (filter === "mechanical") return item.category === "mechanical";
    if (filter === "cleaning") return item.category === "cleaning";
    return true;
  });

  const toggleResolved = (id: string) => {
    setLog((prev) =>
      prev.map((item) => (item.id === id ? { ...item, resolved: !item.resolved } : item))
    );
  };

  const totalLostUnits = log.reduce((sum, item) => sum + item.impactUnitsLost, 0);

  return (
    <YStack
      backgroundColor={colors.card}
      borderRadius={16}
      borderWidth={1}
      borderColor={colors.borderSoft}
      padding={18}
      gap={14}
    >
      {/* Encabezado y Filtro */}
      <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={10}>
        <YStack gap={2}>
          <XStack alignItems="center" gap={7}>
            <View
              width={26}
              height={26}
              borderRadius={6}
              backgroundColor="rgba(251, 191, 36, 0.15)"
              alignItems="center"
              justifyContent="center"
            >
              <PauseCircle size={15} color={VIGIA_COLORS.amberWarning} />
            </View>
            <Text fontSize={15} fontWeight="700" color={colors.text} fontFamily="$heading">
              Bitácora de Paradas de Línea & Inactividad de Cinta
            </Text>
          </XStack>
          <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
            Eventos donde la cinta transportadora no registró flujo de empanadas por más de 3 minutos
          </Text>
        </YStack>

        {/* Filtros */}
        <XStack
          backgroundColor={colors.bg}
          borderRadius={8}
          padding={3}
          borderWidth={1}
          borderColor={colors.borderSoft}
          gap={3}
        >
          <View
            paddingHorizontal={9}
            paddingVertical={4}
            borderRadius={6}
            backgroundColor={filter === "all" ? VIGIA_COLORS.blueVibrant : "transparent"}
            pressStyle={{ opacity: 0.8 }}
            onPress={() => setFilter("all")}
          >
            <Text
              fontSize={10.5}
              fontWeight="700"
              color={filter === "all" ? "#fff" : colors.textLabel}
              fontFamily="$body"
            >
              Todas ({log.length})
            </Text>
          </View>

          <View
            paddingHorizontal={9}
            paddingVertical={4}
            borderRadius={6}
            backgroundColor={filter === "mechanical" ? VIGIA_COLORS.blueVibrant : "transparent"}
            pressStyle={{ opacity: 0.8 }}
            onPress={() => setFilter("mechanical")}
          >
            <Text
              fontSize={10.5}
              fontWeight="700"
              color={filter === "mechanical" ? "#fff" : colors.textLabel}
              fontFamily="$body"
            >
              Mecánicas (1)
            </Text>
          </View>

          <View
            paddingHorizontal={9}
            paddingVertical={4}
            borderRadius={6}
            backgroundColor={filter === "cleaning" ? VIGIA_COLORS.blueVibrant : "transparent"}
            pressStyle={{ opacity: 0.8 }}
            onPress={() => setFilter("cleaning")}
          >
            <Text
              fontSize={10.5}
              fontWeight="700"
              color={filter === "cleaning" ? "#fff" : colors.textLabel}
              fontFamily="$body"
            >
              Operativas (1)
            </Text>
          </View>
        </XStack>
      </XStack>

      {/* Lista de Eventos de Parada */}
      <YStack gap={10}>
        {filteredLog.map((item) => {
          const isMechanical = item.category === "mechanical";

          return (
            <YStack
              key={item.id}
              backgroundColor={colors.bg}
              borderRadius={12}
              borderWidth={1}
              borderColor={item.resolved ? colors.borderSoft : "rgba(248, 113, 113, 0.4)"}
              padding={14}
              gap={10}
            >
              <XStack justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={8}>
                <XStack alignItems="center" gap={8}>
                  <View
                    width={28}
                    height={28}
                    borderRadius={7}
                    backgroundColor={isMechanical ? "rgba(248, 113, 113, 0.15)" : "rgba(251, 191, 36, 0.15)"}
                    alignItems="center"
                    justifyContent="center"
                  >
                    {isMechanical ? (
                      <Wrench size={15} color={VIGIA_COLORS.redDanger} />
                    ) : (
                      <Clock size={15} color={VIGIA_COLORS.amberWarning} />
                    )}
                  </View>

                  <YStack>
                    <XStack alignItems="center" gap={6}>
                      <Text fontSize={13} fontWeight="800" color={colors.text} fontFamily="$mono">
                        {item.startTime} – {item.endTime}
                      </Text>
                      <View
                        backgroundColor={isMechanical ? "rgba(248, 113, 113, 0.14)" : "rgba(251, 191, 36, 0.14)"}
                        paddingHorizontal={6}
                        paddingVertical={1.5}
                        borderRadius={4}
                      >
                        <Text
                          fontSize={9.5}
                          fontWeight="700"
                          color={isMechanical ? VIGIA_COLORS.redDanger : VIGIA_COLORS.amberWarning}
                          fontFamily="$body"
                        >
                          {item.durationMinutes} min de inactividad
                        </Text>
                      </View>
                    </XStack>
                    <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
                      {item.line}
                    </Text>
                  </YStack>
                </XStack>

                {/* Botón interactivo de resolución */}
                <View
                  flexDirection="row"
                  alignItems="center"
                  gap={5}
                  backgroundColor={item.resolved ? "rgba(52, 211, 153, 0.12)" : "rgba(248, 113, 113, 0.12)"}
                  paddingHorizontal={9}
                  paddingVertical={4}
                  borderRadius={7}
                  pressStyle={{ opacity: 0.7 }}
                  onPress={() => toggleResolved(item.id)}
                >
                  {item.resolved ? (
                    <CheckCircle2 size={13} color={VIGIA_COLORS.emeraldSuccess} />
                  ) : (
                    <AlertOctagon size={13} color={VIGIA_COLORS.redDanger} />
                  )}
                  <Text
                    fontSize={10}
                    fontWeight="700"
                    color={item.resolved ? VIGIA_COLORS.emeraldSuccess : VIGIA_COLORS.redDanger}
                    fontFamily="$body"
                  >
                    {item.resolved ? "Cinta Reactivada" : "En Reparación"}
                  </Text>
                </View>
              </XStack>

              {/* Descripción del incidente */}
              <Text fontSize={11.5} color={colors.textSec} fontFamily="$body" lineHeight={17}>
                {item.reason}
              </Text>

              {/* Pie con impacto estimado */}
              <XStack justifyContent="space-between" alignItems="center" paddingTop={4}>
                <XStack alignItems="center" gap={5}>
                  <Camera size={12} color={colors.textLabel} />
                  <Text fontSize={10} color={colors.textLabel} fontFamily="$mono">
                    Registrado por {item.cameraId}
                  </Text>
                </XStack>

                <Text fontSize={11} color={VIGIA_COLORS.redDanger} fontFamily="$mono" fontWeight="700">
                  ~{item.impactUnitsLost} empanadas no producidas
                </Text>
              </XStack>
            </YStack>
          );
        })}
      </YStack>

      {/* Resumen Total de Downtime */}
      <XStack
        backgroundColor="rgba(251, 191, 36, 0.08)"
        borderRadius={10}
        padding={12}
        borderWidth={1}
        borderColor="rgba(251, 191, 36, 0.22)"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={8}
      >
        <XStack alignItems="center" gap={8}>
          <ZapOff size={16} color={VIGIA_COLORS.amberWarning} />
          <Text fontSize={11} color={colors.text} fontFamily="$body">
            Impacto acumulado del turno:{" "}
            <Text fontWeight="800" color={VIGIA_COLORS.amberWarning} fontFamily="$mono">
              {PRODUCTION_METRICS.downtimeMinutesTotal} min totales
            </Text>
          </Text>
        </XStack>

        <Text fontSize={11} color={colors.text} fontFamily="$mono" fontWeight="700">
          Oportunidad de producción perdida: ~{totalLostUnits} pzas (~{Math.round(totalLostUnits * 7.5)} Bs)
        </Text>
      </XStack>
    </YStack>
  );
}
