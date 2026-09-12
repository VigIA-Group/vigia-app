/**
 * ProductionQualityControlCard — Monitor interactivo de Control de Calidad Visual (QC) con IA.
 * Clasificación y conteo óptico de empanadas quemadas, repulgue roto y deformidades.
 */
import { PRODUCTION_METRICS, QualityDefectMetric } from "@/src/data/mock";
import { useColors } from "@/src/hooks/use-colors";
import {
  AlertCircle,
  Camera,
  Flame,
  Layers,
  Scale,
  ShieldAlert,
  Sparkles,
} from "lucide-react-native";
import { useState } from "react";
import { Text, View, XStack, YStack } from "tamagui";
import { VIGIA_COLORS } from "./chart-theme";

export function ProductionQualityControlCard() {
  const colors = useColors();
  const m = PRODUCTION_METRICS;
  const [selectedDefect, setSelectedDefect] = useState<QualityDefectMetric>(m.defects[0]);

  const optimalCount = m.totalProduced - m.defectiveTotal;

  return (
    <YStack
      backgroundColor={colors.card}
      borderRadius={16}
      borderWidth={1}
      borderColor={colors.borderSoft}
      padding={18}
      gap={14}
    >
      {/* Encabezado */}
      <XStack justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={8}>
        <YStack gap={2}>
          <XStack alignItems="center" gap={7}>
            <View
              width={26}
              height={26}
              borderRadius={6}
              backgroundColor="rgba(248, 113, 113, 0.14)"
              alignItems="center"
              justifyContent="center"
            >
              <ShieldAlert size={15} color={VIGIA_COLORS.redDanger} />
            </View>
            <Text fontSize={15} fontWeight="700" color={colors.text} fontFamily="$heading">
              Control de Calidad Visual & Defectos de Horneo
            </Text>
          </XStack>
          <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
            Clasificación automática por visión artificial en salida de hornos (cam-003)
          </Text>
        </YStack>

        <View
          backgroundColor="rgba(52, 211, 153, 0.12)"
          paddingHorizontal={9}
          paddingVertical={4}
          borderRadius={8}
          borderWidth={1}
          borderColor="rgba(52, 211, 153, 0.25)"
        >
          <Text fontSize={11} fontWeight="700" color={VIGIA_COLORS.emeraldSuccess} fontFamily="$body">
            96.8% Aptas para Empaque
          </Text>
        </View>
      </XStack>

      {/* Barra de Distribución Proporcional de Calidad */}
      <YStack gap={6}>
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
            Distribución del Lote ({m.totalProduced.toLocaleString("es-BO")} unidades inspeccionadas)
          </Text>
          <Text fontSize={11} fontWeight="700" color={colors.text} fontFamily="$mono">
            {optimalCount.toLocaleString("es-BO")} óptimas · {m.defectiveTotal} descartadas
          </Text>
        </XStack>

        <XStack height={10} borderRadius={5} overflow="hidden" backgroundColor={colors.bg}>
          <View flex={optimalCount} backgroundColor={VIGIA_COLORS.emeraldSuccess} />
          <View flex={m.burnedTotal} backgroundColor={VIGIA_COLORS.redDanger} />
          <View flex={48} backgroundColor={VIGIA_COLORS.orangeAlert} />
          <View flex={24} backgroundColor={VIGIA_COLORS.amberWarning} />
        </XStack>

        <XStack justifyContent="space-between" flexWrap="wrap" gap={8} marginTop={2}>
          <XStack alignItems="center" gap={4}>
            <View width={8} height={8} borderRadius={2} backgroundColor={VIGIA_COLORS.emeraldSuccess} />
            <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
              Óptimas ({optimalCount})
            </Text>
          </XStack>
          <XStack alignItems="center" gap={4}>
            <View width={8} height={8} borderRadius={2} backgroundColor={VIGIA_COLORS.redDanger} />
            <Text fontSize={10} color={VIGIA_COLORS.redDanger} fontFamily="$body" fontWeight="700">
              Quemadas ({m.burnedTotal})
            </Text>
          </XStack>
          <XStack alignItems="center" gap={4}>
            <View width={8} height={8} borderRadius={2} backgroundColor={VIGIA_COLORS.orangeAlert} />
            <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
              Repulgue Roto (48)
            </Text>
          </XStack>
          <XStack alignItems="center" gap={4}>
            <View width={8} height={8} borderRadius={2} backgroundColor={VIGIA_COLORS.amberWarning} />
            <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
              Deformes (24)
            </Text>
          </XStack>
        </XStack>
      </YStack>

      {/* Selector Interactivo de Tipos de Defecto */}
      <YStack gap={8}>
        <Text fontSize={11.5} fontWeight="700" color={colors.text} fontFamily="$heading">
          Tipología de Defectos Detectados por IA:
        </Text>

        <XStack gap={8} flexWrap="wrap">
          {m.defects.map((d) => {
            const isSelected = selectedDefect.id === d.id;
            const isBurned = d.type === "burned";
            return (
              <View
                key={d.id}
                flex={1}
                minWidth={140}
                padding={11}
                borderRadius={12}
                borderWidth={1}
                borderColor={isSelected ? d.color : colors.borderSoft}
                backgroundColor={isSelected ? "rgba(5, 110, 250, 0.08)" : colors.bg}
                pressStyle={{ opacity: 0.8 }}
                onPress={() => setSelectedDefect(d)}
                gap={5}
              >
                <XStack justifyContent="space-between" alignItems="center">
                  {isBurned ? (
                    <Flame size={16} color={VIGIA_COLORS.redDanger} />
                  ) : d.type === "broken_crust" ? (
                    <Layers size={16} color={VIGIA_COLORS.orangeAlert} />
                  ) : (
                    <Scale size={16} color={VIGIA_COLORS.amberWarning} />
                  )}
                  <View
                    backgroundColor={isSelected ? d.color : "rgba(255,255,255,0.06)"}
                    paddingHorizontal={6}
                    paddingVertical={2}
                    borderRadius={5}
                  >
                    <Text
                      fontSize={9.5}
                      fontWeight="800"
                      color={isSelected ? "#fff" : colors.textLabel}
                      fontFamily="$mono"
                    >
                      {d.count} pzas
                    </Text>
                  </View>
                </XStack>

                <Text fontSize={11} fontWeight="700" color={colors.text} fontFamily="$body" numberOfLines={1}>
                  {d.label.split("/")[0].trim()}
                </Text>

                <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
                  {d.percentageOfDefects}% del scrap
                </Text>
              </View>
            );
          })}
        </XStack>
      </YStack>

      {/* Tarjeta de Detalle del Defecto Seleccionado */}
      <YStack
        backgroundColor={colors.bg}
        borderRadius={12}
        borderWidth={1}
        borderColor={colors.borderSoft}
        padding={14}
        gap={10}
      >
        <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={8}>
          <XStack alignItems="center" gap={7}>
            <View
              width={24}
              height={24}
              borderRadius={6}
              backgroundColor={selectedDefect.color}
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize={11} fontWeight="800" color="#fff" fontFamily="$mono">
                !
              </Text>
            </View>
            <Text fontSize={13} fontWeight="700" color={colors.text} fontFamily="$heading">
              {selectedDefect.label}
            </Text>
          </XStack>

          <XStack alignItems="center" gap={6}>
            <Camera size={13} color={colors.textLabel} />
            <Text fontSize={10.5} color={colors.textLabel} fontFamily="$mono">
              {selectedDefect.cameraSource}
            </Text>
          </XStack>
        </XStack>

        <Text fontSize={11.5} color={colors.textSec} fontFamily="$body" lineHeight={17}>
          {selectedDefect.description}
        </Text>

        <XStack
          backgroundColor="rgba(248, 113, 113, 0.08)"
          borderRadius={8}
          padding={9}
          alignItems="flex-start"
          gap={8}
        >
          <AlertCircle size={15} color={VIGIA_COLORS.redDanger} style={{ marginTop: 2 }} />
          <YStack flex={1}>
            <Text fontSize={10} fontWeight="700" color={VIGIA_COLORS.redDanger} fontFamily="$body">
              Causa Raíz Diagnosticada por IA:
            </Text>
            <Text fontSize={11} color={colors.text} fontFamily="$body" lineHeight={16}>
              {selectedDefect.suspectedCause}
            </Text>
          </YStack>
        </XStack>
      </YStack>

      {/* Recomendación de Recuperación de Merma */}
      <XStack
        backgroundColor="rgba(52, 211, 153, 0.06)"
        borderRadius={10}
        padding={11}
        borderWidth={1}
        borderColor="rgba(52, 211, 153, 0.2)"
        gap={9}
        alignItems="center"
      >
        <Sparkles size={17} color={VIGIA_COLORS.emeraldSuccess} />
        <Text fontSize={11} color={colors.textSec} fontFamily="$body" flex={1} lineHeight={16}>
          <Text fontWeight="700" color={colors.text} fontFamily="$body">
            Impacto Económico:
          </Text>{" "}
          Las {m.burnedTotal} empanadas quemadas representaron {Math.round(m.burnedTotal * 7.5)} Bs de merma
          crítica. Corrigiendo el Horno 2, la conformidad estimada ascenderá al 98.6%.
        </Text>
      </XStack>
    </YStack>
  );
}
