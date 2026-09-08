/**
 * StoreOpeningPunctualityCard — Control de horarios y puntualidad de apertura de sucursal mediante videoanalítica perimetral.
 */
import { OPERATIONS_METRICS } from "@/src/data/mock";
import { useColors } from "@/src/hooks/use-colors";
import {
  Camera,
  Clock,
  DoorOpen,
} from "lucide-react-native";
import { Text, View, XStack, YStack } from "tamagui";
import { VIGIA_COLORS } from "./chart-theme";

export function StoreOpeningPunctualityCard() {
  const colors = useColors();
  const { todayOpeningDelayMin, punctualityScore, punctualityHistory7D } = OPERATIONS_METRICS;
  const today = punctualityHistory7D[punctualityHistory7D.length - 1];

  return (
    <YStack
      backgroundColor={colors.card}
      borderRadius={16}
      borderWidth={1}
      borderColor={colors.borderSoft}
      padding={18}
      gap={16}
    >
      {/* Header */}
      <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={8}>
        <XStack alignItems="center" gap={8}>
          <View
            width={30}
            height={30}
            borderRadius={8}
            backgroundColor="rgba(251, 191, 36, 0.15)"
            alignItems="center"
            justifyContent="center"
          >
            <DoorOpen size={16} color={VIGIA_COLORS.amberWarning} />
          </View>
          <YStack>
            <Text fontSize={14} fontWeight="700" color={colors.text} fontFamily="$heading">
              Puntualidad de Apertura de Sucursal
            </Text>
            <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
              Detección de levantamiento de cortina metálica y apertura de accesos (cam-001)
            </Text>
          </YStack>
        </XStack>

        <View
          backgroundColor="rgba(52, 211, 153, 0.15)"
          paddingHorizontal={10}
          paddingVertical={5}
          borderRadius={8}
        >
          <Text fontSize={12} fontWeight="800" color={VIGIA_COLORS.emeraldSuccess} fontFamily="$mono">
            {punctualityScore}% Puntualidad 7D
          </Text>
        </View>
      </XStack>

      {/* Today's Focus Card */}
      <XStack
        backgroundColor={colors.cardAlt}
        borderRadius={14}
        padding={14}
        alignItems="center"
        justifyContent="space-between"
        borderWidth={1}
        borderColor={todayOpeningDelayMin > 5 ? "rgba(251, 191, 36, 0.3)" : colors.borderSoft}
        flexWrap="wrap"
        gap={12}
      >
        <YStack gap={2}>
          <XStack alignItems="center" gap={6}>
            <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
              Apertura Hoy: <Text fontWeight="700" color={colors.text}>{today.day} {today.date}</Text>
            </Text>
            <XStack
              backgroundColor="rgba(255, 255, 255, 0.06)"
              paddingHorizontal={6}
              paddingVertical={2}
              borderRadius={4}
              alignItems="center"
              gap={4}
            >
              <Camera size={10} color={colors.textLabel} />
              <Text fontSize={9} color={colors.textLabel} fontFamily="$mono">
                cam-001 Fachada
              </Text>
            </XStack>
          </XStack>

          <XStack alignItems="baseline" gap={8} marginTop={4}>
            <Text fontSize={22} fontWeight="800" color={colors.text} fontFamily="$mono">
              {today.actualOpenTime} h
            </Text>
            <Text fontSize={12} color={colors.textLabel} fontFamily="$body">
              (Programada: {today.scheduledTime} h)
            </Text>
          </XStack>
        </YStack>

        <View
          backgroundColor={
            todayOpeningDelayMin > 10
              ? "rgba(251, 191, 36, 0.15)"
              : todayOpeningDelayMin > 0
                ? "rgba(5, 110, 250, 0.12)"
                : "rgba(52, 211, 153, 0.15)"
          }
          paddingHorizontal={12}
          paddingVertical={6}
          borderRadius={8}
          alignItems="center"
        >
          <Text
            fontSize={13}
            fontWeight="800"
            color={
              todayOpeningDelayMin > 10
                ? VIGIA_COLORS.amberWarning
                : todayOpeningDelayMin > 0
                  ? VIGIA_COLORS.blueVibrant
                  : VIGIA_COLORS.emeraldSuccess
            }
            fontFamily="$mono"
          >
            +{todayOpeningDelayMin} min retraso
          </Text>
          <Text fontSize={9} color={colors.textLabel} fontFamily="$body">
            6 clientes esperando fuera
          </Text>
        </View>
      </XStack>

      {/* 7-Day Timeline Strip */}
      <YStack gap={8}>
        <Text fontSize={11} fontWeight="700" color={colors.textLabel} fontFamily="$heading">
          HISTÓRICO SEMANAL DE HORARIO DE APERTURA (7 DÍAS)
        </Text>

        <XStack gap={8} flexWrap="wrap">
          {punctualityHistory7D.map((p, idx) => {
            const isSevere = p.status === "severe_delay";
            const isSlight = p.status === "slight_delay";
            const color = isSevere
              ? VIGIA_COLORS.redDanger
              : isSlight
                ? VIGIA_COLORS.amberWarning
                : VIGIA_COLORS.emeraldSuccess;

            return (
              <YStack
                key={idx}
                flex={1}
                minWidth={75}
                backgroundColor={colors.cardAlt}
                borderRadius={10}
                padding={10}
                alignItems="center"
                gap={4}
                borderTopWidth={3}
                borderTopColor={color}
              >
                <Text fontSize={11} fontWeight="700" color={colors.text} fontFamily="$heading">
                  {p.day}
                </Text>
                <Text fontSize={9} color={colors.textLabel} fontFamily="$mono">
                  {p.date}
                </Text>

                <Text fontSize={12} fontWeight="800" color={colors.text} fontFamily="$mono" marginTop={2}>
                  {p.actualOpenTime}
                </Text>

                <View
                  backgroundColor={
                    p.delayMinutes === 0
                      ? "rgba(52, 211, 153, 0.15)"
                      : isSevere
                        ? "rgba(248, 113, 113, 0.15)"
                        : "rgba(251, 191, 36, 0.15)"
                  }
                  paddingHorizontal={5}
                  paddingVertical={2}
                  borderRadius={4}
                >
                  <Text fontSize={9} fontWeight="700" color={color} fontFamily="$mono">
                    {p.delayMinutes === 0 ? "A tiempo" : `+${p.delayMinutes}m`}
                  </Text>
                </View>
              </YStack>
            );
          })}
        </XStack>
      </YStack>

      {/* Operational Impact Note */}
      <XStack
        backgroundColor="rgba(251, 191, 36, 0.08)"
        borderRadius={12}
        borderWidth={1}
        borderColor="rgba(251, 191, 36, 0.25)"
        padding={12}
        alignItems="flex-start"
        gap={10}
      >
        <Clock size={16} color={VIGIA_COLORS.amberWarning} style={{ marginTop: 2 }} />
        <YStack flex={1} gap={2}>
          <Text fontSize={11} fontWeight="700" color={colors.text} fontFamily="$heading">
            Impacto en Experiencia de Cliente y Ventas Matutinas
          </Text>
          <Text fontSize={10.5} color={colors.textSec} fontFamily="$body" lineHeight={15}>
            Los retrasos de apertura (sábado +15 min y martes +12 min) generaron colas externas de hasta 8 personas. La apertura puntual a las 08:30 permite capturar compras de desayuno y tránsito laboral temprano.
          </Text>
        </YStack>
      </XStack>
    </YStack>
  );
}
