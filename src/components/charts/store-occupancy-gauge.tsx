/**
 * StoreOccupancyGauge — Medidor de aforo en tiempo real y densidad por m² por sector.
 * Permite controlar la capacidad máxima permitida de la tienda y detectar saturación por zonas.
 */
import { STORE_CAPACITY_METRICS } from "@/src/data/mock";
import { useColors } from "@/src/hooks/use-colors";
import {
    Activity,
    AlertTriangle,
    Camera,
    CheckCircle2,
    Gauge,
    Layers,
    TrendingUp,
    Users,
} from "lucide-react-native";
import Svg, {
    Circle,
    Defs,
    Line,
    LinearGradient,
    Path,
    Stop,
    Text as SvgText,
} from "react-native-svg";
import { Text, View, XStack, YStack } from "tamagui";
import { CHART_FONTS, VIGIA_COLORS } from "./chart-theme";

export function StoreOccupancyGauge() {
  const colors = useColors();
  const { maxCapacity, currentOccupants, occupancyPercent, zones } = STORE_CAPACITY_METRICS;

  // Parámetros para el medidor radial (arco de 240 grados)
  const size = 150;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2 - 8;
  const cx = size / 2;
  const cy = size / 2;

  // Arco de 240 grados (de -210° a 30°)
  const startAngle = -210;
  const endAngle = 30;
  const totalAngle = 240;
  const currentAngle = startAngle + (Math.min(occupancyPercent, 100) / 100) * totalAngle;

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    r: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, r: number, startA: number, endA: number) => {
    const start = polarToCartesian(x, y, r, endA);
    const end = polarToCartesian(x, y, r, startA);
    const largeArcFlag = endA - startA <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  const backgroundArcD = describeArc(cx, cy, radius, startAngle, endAngle);
  const activeArcD = describeArc(cx, cy, radius, startAngle, currentAngle);
  const needleTip = polarToCartesian(cx, cy, radius, currentAngle);

  const isWarning = occupancyPercent >= 70 && occupancyPercent < 85;
  const isDanger = occupancyPercent >= 85;
  const statusColor = isDanger
    ? VIGIA_COLORS.redDanger
    : isWarning
      ? VIGIA_COLORS.amberWarning
      : VIGIA_COLORS.emeraldSuccess;

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
            backgroundColor="rgba(52, 211, 153, 0.15)"
            alignItems="center"
            justifyContent="center"
          >
            <Gauge size={16} color={VIGIA_COLORS.emeraldSuccess} />
          </View>
          <YStack>
            <Text fontSize={14} fontWeight="700" color={colors.text} fontFamily="$heading">
              Aforo en Tiempo Real y Densidad Espacial
            </Text>
            <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
              Supervisión perimetral de ocupación simultánea y límites de seguridad
            </Text>
          </YStack>
        </XStack>

        {/* Live Status Badge */}
        <XStack
          backgroundColor={
            isDanger
              ? "rgba(248, 113, 113, 0.15)"
              : isWarning
                ? "rgba(251, 191, 36, 0.15)"
                : "rgba(52, 211, 153, 0.15)"
          }
          paddingHorizontal={11}
          paddingVertical={5}
          borderRadius={8}
          alignItems="center"
          gap={6}
        >
          {isDanger || isWarning ? (
            <AlertTriangle size={13} color={statusColor} />
          ) : (
            <CheckCircle2 size={13} color={statusColor} />
          )}
          <Text fontSize={11} fontWeight="700" color={statusColor} fontFamily="$body">
            {isDanger ? "Saturación Crítica" : isWarning ? "Aforo Preventivo" : "Aforo Controlado"}
          </Text>
        </XStack>
      </XStack>

      {/* Main Gauge and Executive Global Stats */}
      <XStack
        backgroundColor={colors.cardAlt}
        borderRadius={14}
        padding={16}
        alignItems="center"
        justifyContent="space-around"
        flexWrap="wrap"
        gap={16}
        borderWidth={1}
        borderColor={colors.borderSoft}
      >
        {/* Futuristic Radial Gauge */}
        <View width={size} height={size} alignItems="center" justifyContent="center">
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <Defs>
              <LinearGradient id="radialGaugeGrad" x1="0" y1="1" x2="1" y2="0">
                <Stop offset="0%" stopColor={VIGIA_COLORS.blueVibrant} />
                <Stop offset="70%" stopColor={VIGIA_COLORS.blueCyan} />
                <Stop offset="100%" stopColor={statusColor} />
              </LinearGradient>
            </Defs>

            {/* Background track */}
            <Path
              d={backgroundArcD}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="none"
            />

            {/* Scale tick marks */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const tickAngle = startAngle + pct * totalAngle;
              const pInner = polarToCartesian(cx, cy, radius - strokeWidth / 2 - 4, tickAngle);
              const pOuter = polarToCartesian(cx, cy, radius - strokeWidth / 2 - 1, tickAngle);
              return (
                <Line
                  key={i}
                  x1={pInner.x}
                  y1={pInner.y}
                  x2={pOuter.x}
                  y2={pOuter.y}
                  stroke="rgba(255, 255, 255, 0.25)"
                  strokeWidth={1}
                />
              );
            })}

            {/* Active filled arc */}
            <Path
              d={activeArcD}
              stroke="url(#radialGaugeGrad)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="none"
            />

            {/* Active tip halo */}
            <Circle cx={needleTip.x} cy={needleTip.y} r={6} fill={statusColor} fillOpacity={0.35} />
            <Circle cx={needleTip.x} cy={needleTip.y} r={3.5} fill="#ffffff" />

            {/* Center percentage label */}
            <SvgText
              x={cx}
              y={cy + 2}
              textAnchor="middle"
              fontSize={24}
              fontFamily={CHART_FONTS.bold}
              fill={colors.text}
            >
              {Math.round(occupancyPercent)}%
            </SvgText>
            <SvgText
              x={cx}
              y={cy + 18}
              textAnchor="middle"
              fontSize={9.5}
              fontFamily={CHART_FONTS.regular}
              fill={colors.textLabel}
            >
              capacidad
            </SvgText>
          </Svg>
        </View>

        {/* Global Key Values */}
        <YStack gap={12} flex={1} minWidth={220}>
          <XStack justifyContent="space-between" alignItems="center">
            <YStack>
              <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
                Ocupación Actual (15:45 h)
              </Text>
              <XStack alignItems="center" gap={6} marginTop={2}>
                <Users size={16} color={VIGIA_COLORS.blueVibrant} />
                <Text fontSize={22} fontWeight="800" color={colors.text} fontFamily="$mono">
                  {currentOccupants}
                </Text>
                <Text fontSize={13} color={colors.textLabel} fontFamily="$mono">
                  / {maxCapacity} límite
                </Text>
              </XStack>
            </YStack>

            <View
              backgroundColor="rgba(5, 110, 250, 0.12)"
              paddingHorizontal={10}
              paddingVertical={5}
              borderRadius={8}
              alignItems="center"
            >
              <Text
                fontSize={12}
                fontWeight="700"
                color={VIGIA_COLORS.blueVibrant}
                fontFamily="$mono"
              >
                {maxCapacity - currentOccupants} cupos
              </Text>
              <Text fontSize={9} color={colors.textLabel} fontFamily="$body">
                disponibles
              </Text>
            </View>
          </XStack>

          <XStack gap={16} flexWrap="wrap">
            <YStack flex={1} minWidth={100}>
              <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
                Densidad Global
              </Text>
              <XStack alignItems="center" gap={4} marginTop={2}>
                <Layers size={13} color={VIGIA_COLORS.purpleMetric} />
                <Text fontSize={14} fontWeight="700" color={colors.text} fontFamily="$mono">
                  {STORE_CAPACITY_METRICS.globalDensityPerM2} p/m²
                </Text>
              </XStack>
              <Text fontSize={9} color={colors.textLabel} fontFamily="$body">
                en {STORE_CAPACITY_METRICS.totalSalesAreaM2} m² sala
              </Text>
            </YStack>

            <YStack flex={1} minWidth={100}>
              <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
                Ritmo de Flujo
              </Text>
              <XStack alignItems="center" gap={4} marginTop={2}>
                <TrendingUp size={13} color={VIGIA_COLORS.emeraldSuccess} />
                <Text
                  fontSize={14}
                  fontWeight="700"
                  color={VIGIA_COLORS.emeraldSuccess}
                  fontFamily="$mono"
                >
                  +18 p/hora
                </Text>
              </XStack>
              <Text fontSize={9} color={colors.textLabel} fontFamily="$body">
                flujo controlado
              </Text>
            </YStack>
          </XStack>
        </YStack>
      </XStack>

      {/* Density breakdown by zone — Responsive Multi-column Grid */}
      <YStack gap={10}>
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize={12} fontWeight="700" color={colors.text} fontFamily="$heading">
            Carga y Densidad por Zona (Cámaras Activas)
          </Text>
          <Text fontSize={10} color={colors.textLabel} fontFamily="$body">
            4 sectores monitoreados
          </Text>
        </XStack>

        {/* Responsive Grid for Desktop & Tablet */}
        <XStack flexWrap="wrap" gap={10}>
          {zones.map((z) => {
            const isZoneDense = z.status === "dense" || z.status === "saturated";
            const zoneColor = isZoneDense ? VIGIA_COLORS.amberWarning : VIGIA_COLORS.blueVibrant;
            const capPercent = Math.round((z.currentPeople / z.capacityMax) * 100);

            return (
              <YStack
                key={z.zone}
                flex={1}
                minWidth={240}
                backgroundColor={colors.cardAlt}
                borderRadius={12}
                padding={12}
                gap={8}
                borderWidth={1}
                borderColor={isZoneDense ? "rgba(251, 191, 36, 0.3)" : colors.borderSoft}
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <XStack alignItems="center" gap={6}>
                    <View width={7} height={7} borderRadius={4} backgroundColor={zoneColor} />
                    <Text fontSize={12} fontWeight="700" color={colors.text} fontFamily="$body">
                      {z.zone}
                    </Text>
                  </XStack>

                  {/* Camera ID Tag */}
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
                      {z.cameraId}
                    </Text>
                  </XStack>
                </XStack>

                <XStack justifyContent="space-between" alignItems="baseline">
                  <XStack alignItems="baseline" gap={4}>
                    <Text fontSize={16} fontWeight="800" color={colors.text} fontFamily="$mono">
                      {z.currentPeople}
                    </Text>
                    <Text fontSize={10} color={colors.textLabel} fontFamily="$mono">
                      / {z.capacityMax} max ({capPercent}%)
                    </Text>
                  </XStack>

                  <View
                    backgroundColor={
                      isZoneDense ? "rgba(251, 191, 36, 0.15)" : "rgba(5, 110, 250, 0.12)"
                    }
                    paddingHorizontal={8}
                    paddingVertical={3}
                    borderRadius={6}
                  >
                    <Text fontSize={10} fontWeight="700" color={zoneColor} fontFamily="$mono">
                      {z.densityPerM2} pers/m²
                    </Text>
                  </View>
                </XStack>

                {/* Micro Progress Bar */}
                <View
                  height={5}
                  borderRadius={3}
                  backgroundColor="rgba(255, 255, 255, 0.08)"
                  overflow="hidden"
                >
                  <View
                    height={5}
                    borderRadius={3}
                    backgroundColor={zoneColor}
                    width={`${Math.min(capPercent, 100)}%` as `${number}%`}
                  />
                </View>
              </YStack>
            );
          })}
        </XStack>
      </YStack>

      {/* Actionable Staffing / Queue Dispatch Alert */}
      <XStack
        backgroundColor="rgba(251, 191, 36, 0.08)"
        borderRadius={12}
        borderWidth={1}
        borderColor="rgba(251, 191, 36, 0.25)"
        padding={12}
        alignItems="flex-start"
        gap={10}
      >
        <Activity size={16} color={VIGIA_COLORS.amberWarning} style={{ marginTop: 2 }} />
        <YStack flex={1} gap={2}>
          <Text fontSize={11} fontWeight="700" color={colors.text} fontFamily="$heading">
            Alerta de Línea de Cajas (cam-002 al 84% de capacidad)
          </Text>
          <Text fontSize={10.5} color={colors.textSec} fontFamily="$body" lineHeight={15}>
            La concentración en Área de Cajas supera los 0.45 pers/m². Se recomienda habilitar 1
            caja adicional en los próximos 15 minutos para prevenir saturación y abandono de compra.
          </Text>
        </YStack>
      </XStack>
    </YStack>
  );
}
