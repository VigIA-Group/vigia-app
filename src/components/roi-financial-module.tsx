import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { useColors } from "@/src/hooks/use-colors";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Flame,
  Percent,
  Sparkles,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Zap,
} from "lucide-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";

interface RoiFinancialModuleProps {
  industryId?: string;
  turnoverMinutes?: number;
  targetMinutes?: number;
  savedMoneyToday?: string;
  projectedMonthlyRevenue?: string;
  lostRevenuePreventions?: string;
}

export function RoiFinancialModule({
  industryId = "restaurantes",
  turnoverMinutes = 48,
  targetMinutes = 40,
  savedMoneyToday = "$350",
  projectedMonthlyRevenue = "+$6,200",
  lostRevenuePreventions = "$110",
}: RoiFinancialModuleProps) {
  const colors = useColors();
  const { isDesktop } = useBreakpoint();

  return (
    <View
      backgroundColor={colors.card}
      borderRadius={16}
      borderWidth={1}
      borderColor={colors.borderSoft}
      overflow="hidden"
      padding={isDesktop ? 20 : 14}
      gap={14}
    >
      {/* HEADER */}
      <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={10}>
        <XStack alignItems="center" gap={10}>
          <View
            width={34}
            height={34}
            borderRadius={8}
            backgroundColor="rgba(33, 152, 244, 0.15)"
            alignItems="center"
            justifyContent="center"
            borderWidth={1}
            borderColor="rgba(33, 152, 244, 0.3)"
          >
            <DollarSign size={18} color="#38bdf8" />
          </View>
          <YStack gap={1}>
            <XStack alignItems="center" gap={8}>
              <Text fontSize={14} fontWeight="800" color={colors.text} fontFamily="$body">
                IMPACTO FINANCIERO & RECUPERACIÓN DE INGRESOS
              </Text>
              <View
                backgroundColor="rgba(16, 185, 129, 0.15)"
                paddingHorizontal={6}
                paddingVertical={2}
                borderRadius={4}
                borderWidth={1}
                borderColor="rgba(16, 185, 129, 0.3)"
              >
                <Text fontSize={9.5} fontWeight="700" color="#34d399" fontFamily="$mono">
                  ROI PROYECTADO 4.8x
                </Text>
              </View>
            </XStack>
            <Text fontSize={11} color={colors.textSec} fontFamily="$body">
              Cuantificación en tiempo real del costo de tiempos muertos y valor generado por VigIA
            </Text>
          </YStack>
        </XStack>

        {/* Highlight Monthly Projection */}
        <XStack
          backgroundColor="rgba(33, 152, 244, 0.1)"
          borderWidth={1}
          borderColor="rgba(33, 152, 244, 0.3)"
          borderRadius={10}
          paddingHorizontal={12}
          paddingVertical={6}
          alignItems="center"
          gap={8}
        >
          <TrendingUp size={16} color="#38bdf8" />
          <YStack gap={0}>
            <Text fontSize={9.5} fontWeight="700" color="#94a3b8" fontFamily="$mono">
              POTENCIAL MENSUAL ADICIONAL
            </Text>
            <Text fontSize={14} fontWeight="900" color="#38bdf8" fontFamily="$mono">
              {projectedMonthlyRevenue} USD / mes
            </Text>
          </YStack>
        </XStack>
      </XStack>

      {/* 4 CORE FINANCIAL PILLARS */}
      <XStack flexWrap="wrap" gap={12}>
        {/* PILLAR 1: ROTACIÓN DE MESAS */}
        <View
          flex={1}
          minWidth={isDesktop ? 200 : "47%"}
          backgroundColor={colors.bg}
          borderRadius={12}
          borderWidth={1}
          borderColor={colors.borderSoft}
          padding={12}
          gap={6}
        >
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={10.5} fontWeight="700" color={colors.textLabel} fontFamily="$mono">
              ROTACIÓN DE MESA
            </Text>
            <Clock size={13} color="#f59e0b" />
          </XStack>

          <XStack alignItems="baseline" gap={6}>
            <Text fontSize={20} fontWeight="900" color={colors.text} fontFamily="$mono">
              {turnoverMinutes} min
            </Text>
            <Text fontSize={11} color="#f59e0b" fontWeight="700" fontFamily="$mono">
              (Meta: {targetMinutes} min)
            </Text>
          </XStack>

          <Text fontSize={10} color={colors.textSec} fontFamily="$body" lineHeight={14}>
            Optimizar 8 min de sobremesa habilita +2.1 rotaciones adicionales por turno (+
            <Text fontWeight="700" color="#34d399">
              $1,850/semana
            </Text>
            ).
          </Text>
        </View>

        {/* PILLAR 2: PASE DE COCINA & MERMA EVITADA */}
        <View
          flex={1}
          minWidth={isDesktop ? 200 : "47%"}
          backgroundColor={colors.bg}
          borderRadius={12}
          borderWidth={1}
          borderColor={colors.borderSoft}
          padding={12}
          gap={6}
        >
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={10.5} fontWeight="700" color={colors.textLabel} fontFamily="$mono">
              MERMA EN PASE EVITADA
            </Text>
            <UtensilsCrossed size={13} color="#34d399" />
          </XStack>

          <XStack alignItems="baseline" gap={6}>
            <Text fontSize={20} fontWeight="900" color="#34d399" fontFamily="$mono">
              {savedMoneyToday} USD
            </Text>
            <Text fontSize={10} color="#34d399" fontWeight="700" fontFamily="$mono">
              HOY
            </Text>
          </XStack>

          <Text fontSize={10} color={colors.textSec} fontFamily="$body" lineHeight={14}>
            14 platos alertados antes de enfriarse en mostrador. Cero cancelaciones de clientes hoy.
          </Text>
        </View>

        {/* PILLAR 3: ABANDONO DE FILA (WALKOUTS) */}
        <View
          flex={1}
          minWidth={isDesktop ? 200 : "47%"}
          backgroundColor={colors.bg}
          borderRadius={12}
          borderWidth={1}
          borderColor={colors.borderSoft}
          padding={12}
          gap={6}
        >
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={10.5} fontWeight="700" color={colors.textLabel} fontFamily="$mono">
              WALKOUTS EN PUERTA
            </Text>
            <Users size={13} color="#f87171" />
          </XStack>

          <XStack alignItems="baseline" gap={6}>
            <Text fontSize={20} fontWeight="900" color="#f87171" fontFamily="$mono">
              -{lostRevenuePreventions} USD
            </Text>
            <Text fontSize={10} color="#f87171" fontWeight="700" fontFamily="$mono">
              2 grupos
            </Text>
          </XStack>

          <Text fontSize={10} color={colors.textSec} fontFamily="$body" lineHeight={14}>
            Clientes que desistieron tras 14 min de espera en puerta. Alerta automática a Hostess
            para agilizar asignación.
          </Text>
        </View>

        {/* PILLAR 4: VELOCIDAD DE CONTACTO MOZO */}
        <View
          flex={1}
          minWidth={isDesktop ? 200 : "47%"}
          backgroundColor={colors.bg}
          borderRadius={12}
          borderWidth={1}
          borderColor={colors.borderSoft}
          padding={12}
          gap={6}
        >
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={10.5} fontWeight="700" color={colors.textLabel} fontFamily="$mono">
              PRIMER CONTACTO MOZO
            </Text>
            <CheckCircle2 size={13} color="#38bdf8" />
          </XStack>

          <XStack alignItems="baseline" gap={6}>
            <Text fontSize={20} fontWeight="900" color={colors.text} fontFamily="$mono">
              3.8 min
            </Text>
            <Text fontSize={10} color="#34d399" fontWeight="700" fontFamily="$mono">
              ÓPTIMO
            </Text>
          </XStack>

          <Text fontSize={10} color={colors.textSec} fontFamily="$body" lineHeight={14}>
            Tiempo promedio entre sentarse y entrega de carta. 94% de cumplimiento del estándar de
            servicio.
          </Text>
        </View>
      </XStack>
    </View>
  );
}

