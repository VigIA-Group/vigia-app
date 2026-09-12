/**
 * ProductVarietyBreakdownCard — Desglose de volumen producido por tipo de empanada y tasa de merma por variedad.
 */
import { PRODUCTION_METRICS } from "@/src/data/mock";
import { useColors } from "@/src/hooks/use-colors";
import {
  PieChart,
  ShoppingBag,
} from "lucide-react-native";
import { Text, View, XStack, YStack } from "tamagui";
import { VIGIA_COLORS } from "./chart-theme";

export function ProductVarietyBreakdownCard() {
  const colors = useColors();
  const varieties = PRODUCTION_METRICS.varieties;
  const total = PRODUCTION_METRICS.totalProduced;

  // Ingreso estimado por empanadas óptimas
  const totalRevenueBs = varieties.reduce(
    (sum, v) => sum + (v.produced - v.defective) * v.unitPriceBs,
    0
  );

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
      <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={8}>
        <YStack gap={2}>
          <XStack alignItems="center" gap={7}>
            <View
              width={26}
              height={26}
              borderRadius={6}
              backgroundColor="rgba(5, 110, 250, 0.12)"
              alignItems="center"
              justifyContent="center"
            >
              <PieChart size={15} color={VIGIA_COLORS.blueVibrant} />
            </View>
            <Text fontSize={15} fontWeight="700" color={colors.text} fontFamily="$heading">
              Producción por Variedad de Empanada
            </Text>
          </XStack>
          <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
            Conteo y tasa de defectos según receta y características de horneo
          </Text>
        </YStack>

        <View
          backgroundColor="rgba(5, 110, 250, 0.12)"
          paddingHorizontal={9}
          paddingVertical={4}
          borderRadius={8}
        >
          <Text fontSize={11} fontWeight="700" color={VIGIA_COLORS.blueVibrant} fontFamily="$mono">
            {total.toLocaleString("es-BO")} pzas totales
          </Text>
        </View>
      </XStack>

      {/* Lista de Variedades */}
      <YStack gap={10}>
        {varieties.map((v) => {
          const isWarning = v.defectRate > v.targetRate;
          const revenueBs = (v.produced - v.defective) * v.unitPriceBs;

          return (
            <YStack
              key={v.id}
              backgroundColor={colors.bg}
              borderRadius={12}
              borderWidth={1}
              borderColor={colors.borderSoft}
              padding={12}
              gap={7}
            >
              <XStack justifyContent="space-between" alignItems="center">
                <XStack alignItems="center" gap={8}>
                  <View width={10} height={10} borderRadius={3} backgroundColor={v.color} />
                  <Text fontSize={13} fontWeight="700" color={colors.text} fontFamily="$body">
                    {v.name}
                  </Text>
                </XStack>

                <XStack alignItems="center" gap={8}>
                  <View
                    backgroundColor={isWarning ? "rgba(251, 191, 36, 0.15)" : "rgba(52, 211, 153, 0.12)"}
                    paddingHorizontal={6}
                    paddingVertical={2}
                    borderRadius={5}
                  >
                    <Text
                      fontSize={9.5}
                      fontWeight="700"
                      color={isWarning ? VIGIA_COLORS.amberWarning : VIGIA_COLORS.emeraldSuccess}
                      fontFamily="$body"
                    >
                      {v.defectRate}% merma {isWarning ? "(!)" : ""}
                    </Text>
                  </View>

                  <Text fontSize={13} fontWeight="800" color={colors.text} fontFamily="$mono">
                    {v.produced.toLocaleString("es-BO")} u
                  </Text>
                </XStack>
              </XStack>

              {/* Barra de Progreso del Volumen */}
              <View height={6} borderRadius={3} backgroundColor={colors.borderSoft} overflow="hidden">
                <View
                  width={`${v.percentage}%`}
                  height="100%"
                  backgroundColor={v.color}
                  borderRadius={3}
                />
              </View>

              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
                  Participación: <Text fontWeight="700" color={colors.text} fontFamily="$mono">{v.percentage}%</Text> · Valor despacho:{" "}
                  <Text fontWeight="700" color={colors.text} fontFamily="$mono">{revenueBs.toLocaleString("es-BO")} Bs</Text>
                </Text>

                <Text fontSize={10} color={isWarning ? VIGIA_COLORS.amberWarning : colors.textLabel} fontFamily="$body">
                  {v.defective} descartadas (máx {v.targetRate}%)
                </Text>
              </XStack>
            </YStack>
          );
        })}
      </YStack>

      {/* Resumen Comercial de Despacho */}
      <XStack
        backgroundColor={colors.bg}
        borderRadius={10}
        padding={12}
        borderWidth={1}
        borderColor={colors.borderSoft}
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={10}
      >
        <XStack alignItems="center" gap={7}>
          <ShoppingBag size={16} color={VIGIA_COLORS.blueVibrant} />
          <YStack>
            <Text fontSize={10.5} color={colors.textLabel} fontFamily="$body">
              Valor Comercial Lote Conforme
            </Text>
            <Text fontSize={14} fontWeight="800" color={colors.text} fontFamily="$mono">
              {totalRevenueBs.toLocaleString("es-BO")} Bs (~${Math.round(totalRevenueBs / 6.96).toLocaleString("es-BO")} USD)
            </Text>
          </YStack>
        </XStack>

        <View
          backgroundColor="rgba(251, 191, 36, 0.12)"
          paddingHorizontal={8}
          paddingVertical={4}
          borderRadius={6}
        >
          <Text fontSize={10} color={VIGIA_COLORS.amberWarning} fontFamily="$body" fontWeight="700">
            Queso: mayor tasa de desfonde (5.6%)
          </Text>
        </View>
      </XStack>
    </YStack>
  );
}
