import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { useColors } from "@/src/hooks/use-colors";
import {
    AlertTriangle,
    Clock,
    Timer,
    UtensilsCrossed
} from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";

interface TableStatus {
  id: string;
  number: string;
  seats: number;
  status: "dirty" | "unattended" | "occupied" | "available";
  minutesInState: number;
  server?: string;
  notes: string;
}

const MOCK_TABLES: TableStatus[] = [
  {
    id: "t-01",
    number: "M-01",
    seats: 4,
    status: "occupied",
    minutesInState: 28,
    server: "Carlos M.",
    notes: "Plato fuerte servido",
  },
  {
    id: "t-02",
    number: "M-02",
    seats: 2,
    status: "dirty",
    minutesInState: 4.5,
    notes: "Comensales salieron · Pendiente retirar vajilla",
  },
  {
    id: "t-03",
    number: "M-03",
    seats: 4,
    status: "available",
    minutesInState: 12,
    notes: "Limpia y sanitizada lista para comensales",
  },
  {
    id: "t-04",
    number: "M-04",
    seats: 6,
    status: "occupied",
    minutesInState: 46,
    server: "Sofía R.",
    notes: "Consumo finalizado · Esperando cuenta",
  },
  {
    id: "t-05",
    number: "M-05",
    seats: 2,
    status: "available",
    minutesInState: 8,
    notes: "Limpia y lista",
  },
  {
    id: "t-06",
    number: "M-06",
    seats: 4,
    status: "unattended",
    minutesInState: 6.4,
    server: "Sin asignar",
    notes: "Sentados hace 6.4 min sin comanda ni atención",
  },
  {
    id: "t-07",
    number: "M-07",
    seats: 4,
    status: "occupied",
    minutesInState: 18,
    server: "Carlos M.",
    notes: "Entradas servidas",
  },
  {
    id: "t-08",
    number: "M-08",
    seats: 2,
    status: "occupied",
    minutesInState: 21,
    server: "Sofía R.",
    notes: "Almorzando normalmente",
  },
  {
    id: "t-09",
    number: "M-09",
    seats: 4,
    status: "dirty",
    minutesInState: 3.8,
    notes: "Mesa desocupada hace 3.8 min sin limpiar",
  },
  {
    id: "t-10",
    number: "M-10",
    seats: 6,
    status: "available",
    minutesInState: 15,
    notes: "Limpia y lista",
  },
  {
    id: "t-11",
    number: "M-11",
    seats: 2,
    status: "unattended",
    minutesInState: 5.1,
    server: "Sin asignar",
    notes: "Comensal sentado hace 5.1 min sin carta",
  },
  {
    id: "t-12",
    number: "M-12",
    seats: 4,
    status: "dirty",
    minutesInState: 2.9,
    notes: "Cuenta pagada y retirada · Requiere fajinado",
  },
];

export function RestaurantTableServiceCard() {
  const colors = useColors();
  const { isDesktop } = useBreakpoint();
  const [selectedTable, setSelectedTable] = useState<TableStatus | null>(MOCK_TABLES[1]);

  const dirtyCount = MOCK_TABLES.filter((t) => t.status === "dirty").length;
  const unattendedCount = MOCK_TABLES.filter((t) => t.status === "unattended").length;
  const occupiedCount = MOCK_TABLES.filter((t) => t.status === "occupied").length;
  const availableCount = MOCK_TABLES.filter((t) => t.status === "available").length;

  return (
    <View
      backgroundColor={colors.card}
      borderRadius={14}
      borderWidth={1}
      borderColor={colors.borderSoft}
      padding={18}
      gap={16}
    >
      {/* HEADER */}
      <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={8}>
        <XStack alignItems="center" gap={10}>
          <View
            width={38}
            height={38}
            borderRadius={10}
            backgroundColor="rgba(245, 158, 11, 0.15)"
            alignItems="center"
            justifyContent="center"
          >
            <UtensilsCrossed size={19} color="#f59e0b" />
          </View>
          <YStack gap={1}>
            <Text fontSize={15} fontWeight="700" color={colors.text} fontFamily="$body">
              Auditoría en Salón: Mesas, Atención & Limpieza
            </Text>
            <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
              Supervisión continua con cámaras IP · Tiempos de respuesta y rotación
            </Text>
          </YStack>
        </XStack>

        <View
          backgroundColor="rgba(16, 185, 129, 0.12)"
          borderWidth={1}
          borderColor="rgba(16, 185, 129, 0.3)"
          paddingHorizontal={10}
          paddingVertical={4}
          borderRadius={6}
          flexDirection="row"
          alignItems="center"
          gap={6}
        >
          <View width={6} height={6} borderRadius={3} backgroundColor="#10b981" />
          <Text fontSize={10.5} fontWeight="800" color="#10b981" fontFamily="$mono">
            VIDEOANALÍTICA ACTIVA
          </Text>
        </View>
      </XStack>

      {/* 4 CORE SERVICE KPIS */}
      <XStack gap={10} flexDirection={isDesktop ? "row" : "column"}>
        {/* KPI 1: Mesas desocupadas sin limpiar */}
        <View
          flex={1}
          backgroundColor={colors.bg}
          borderRadius={12}
          borderWidth={1}
          borderColor={dirtyCount > 0 ? "rgba(248, 113, 113, 0.4)" : colors.borderSoft}
          padding={12}
          gap={4}
        >
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={10.5} fontWeight="700" color={colors.textLabel} fontFamily="$mono">
              MESAS SIN LIMPIAR
            </Text>
            <AlertTriangle size={14} color="#f87171" />
          </XStack>
          <XStack alignItems="baseline" gap={6}>
            <Text fontSize={22} fontWeight="900" color="#f87171" fontFamily="$mono">
              {dirtyCount} mesas
            </Text>
          </XStack>
          <Text fontSize={11} color={colors.textSec} fontFamily="$body">
            Tiempo medio:{" "}
            <Text fontWeight="700" color="#f87171">
              3.7 min
            </Text>{" "}
            (Meta: &lt; 2 min)
          </Text>
        </View>

        {/* KPI 2: Mesas sin atención inicial */}
        <View
          flex={1}
          backgroundColor={colors.bg}
          borderRadius={12}
          borderWidth={1}
          borderColor={unattendedCount > 0 ? "rgba(251, 191, 36, 0.4)" : colors.borderSoft}
          padding={12}
          gap={4}
        >
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={10.5} fontWeight="700" color={colors.textLabel} fontFamily="$mono">
              SIN ATENCIÓN &gt; 5 MIN
            </Text>
            <Clock size={14} color="#fbbf24" />
          </XStack>
          <XStack alignItems="baseline" gap={6}>
            <Text fontSize={22} fontWeight="900" color="#fbbf24" fontFamily="$mono">
              {unattendedCount} mesas
            </Text>
          </XStack>
          <Text fontSize={11} color={colors.textSec} fontFamily="$body">
            Espera máx comensal:{" "}
            <Text fontWeight="700" color="#fbbf24">
              6.4 min
            </Text>{" "}
            (M-06)
          </Text>
        </View>

        {/* KPI 3: Rotación promedio de mesa */}
        <View
          flex={1}
          backgroundColor={colors.bg}
          borderRadius={12}
          borderWidth={1}
          borderColor={colors.borderSoft}
          padding={12}
          gap={4}
        >
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={10.5} fontWeight="700" color={colors.textLabel} fontFamily="$mono">
              ROTACIÓN PROMEDIO
            </Text>
            <Timer size={14} color="#34d399" />
          </XStack>
          <XStack alignItems="baseline" gap={6}>
            <Text fontSize={22} fontWeight="900" color="#34d399" fontFamily="$mono">
              42 min
            </Text>
          </XStack>
          <Text fontSize={11} color={colors.textSec} fontFamily="$body">
            Meta:{" "}
            <Text fontWeight="700" color="#34d399">
              40 min
            </Text>{" "}
            (+6 min vs ayer)
          </Text>
        </View>

        {/* KPI 4: Impacto en Ventas */}
        {/* <View
          flex={1}
          backgroundColor={colors.bg}
          borderRadius={12}
          borderWidth={1}
          borderColor="rgba(56, 189, 248, 0.3)"
          padding={12}
          gap={4}
        >
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={10.5} fontWeight="700" color="#38bdf8" fontFamily="$mono">
              POTENCIAL ADICIONAL
            </Text>
            <TrendingUp size={14} color="#38bdf8" />
          </XStack>
          <XStack alignItems="baseline" gap={6}>
            <Text fontSize={22} fontWeight="900" color="#38bdf8" fontFamily="$mono">
              +$340 USD
            </Text>
          </XStack>
          <Text fontSize={11} color={colors.textSec} fontFamily="$body">
            Por ganar 1 rotación extra al limpiar en &lt; 2 min
          </Text>
        </View> */}
      </XStack>

      {/* INTERACTIVE TABLE GRID */}
      <YStack gap={8}>
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize={12} fontWeight="700" color={colors.text} fontFamily="$body">
            Mapa de Mesas en Salón (12 Zonas Supervisadas)
          </Text>
          {/* Legend */}
          <XStack gap={12} flexWrap="wrap">
            <XStack alignItems="center" gap={4}>
              <View width={8} height={8} borderRadius={4} backgroundColor="#f87171" />
              <Text fontSize={10.5} color={colors.textLabel} fontFamily="$body">
                Sucia ({dirtyCount})
              </Text>
            </XStack>
            <XStack alignItems="center" gap={4}>
              <View width={8} height={8} borderRadius={4} backgroundColor="#fbbf24" />
              <Text fontSize={10.5} color={colors.textLabel} fontFamily="$body">
                Sin atención ({unattendedCount})
              </Text>
            </XStack>
            <XStack alignItems="center" gap={4}>
              <View width={8} height={8} borderRadius={4} backgroundColor="#34d399" />
              <Text fontSize={10.5} color={colors.textLabel} fontFamily="$body">
                En servicio ({occupiedCount})
              </Text>
            </XStack>
            <XStack alignItems="center" gap={4}>
              <View width={8} height={8} borderRadius={4} backgroundColor="#64748b" />
              <Text fontSize={10.5} color={colors.textLabel} fontFamily="$body">
                Disponible ({availableCount})
              </Text>
            </XStack>
          </XStack>
        </XStack>

        <XStack flexWrap="wrap" gap={8}>
          {MOCK_TABLES.map((table) => {
            const isSelected = selectedTable?.id === table.id;
            const statusColor =
              table.status === "dirty"
                ? "#f87171"
                : table.status === "unattended"
                  ? "#fbbf24"
                  : table.status === "occupied"
                    ? "#34d399"
                    : "#64748b";

            return (
              <TouchableOpacity
                key={table.id}
                onPress={() => setSelectedTable(table)}
                style={{
                  flex: isDesktop ? 1 : undefined,
                  minWidth: isDesktop ? 70 : "22%",
                  backgroundColor: isSelected ? statusColor + "25" : colors.bg,
                  borderRadius: 10,
                  borderWidth: 1.5,
                  borderColor: isSelected ? statusColor : statusColor + "40",
                  padding: 8,
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <XStack alignItems="center" gap={4}>
                  <View width={6} height={6} borderRadius={3} backgroundColor={statusColor} />
                  <Text fontSize={11} fontWeight="800" color={colors.text} fontFamily="$mono">
                    {table.number}
                  </Text>
                </XStack>
                <Text
                  fontSize={9.5}
                  fontWeight="700"
                  color={statusColor}
                  fontFamily="$mono"
                  numberOfLines={1}
                >
                  {table.status === "dirty"
                    ? `${table.minutesInState}m sin limpiar`
                    : table.status === "unattended"
                      ? `${table.minutesInState}m sin mozo`
                      : table.status === "occupied"
                        ? `${table.minutesInState}m`
                        : "Libre"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </XStack>
      </YStack>

      {/* SELECTED TABLE INSPECTION DRAWER */}
      {selectedTable && (
        <View
          backgroundColor={colors.bg}
          borderRadius={10}
          borderLeftWidth={4}
          borderLeftColor={
            selectedTable.status === "dirty"
              ? "#f87171"
              : selectedTable.status === "unattended"
                ? "#fbbf24"
                : selectedTable.status === "occupied"
                  ? "#34d399"
                  : "#64748b"
          }
          padding={12}
          gap={6}
        >
          <XStack justifyContent="space-between" alignItems="center">
            <XStack alignItems="center" gap={8}>
              <Text fontSize={13} fontWeight="800" color={colors.text} fontFamily="$mono">
                Detalle de {selectedTable.number} ({selectedTable.seats} comensales)
              </Text>
              <View
                backgroundColor={
                  selectedTable.status === "dirty"
                    ? "rgba(248, 113, 113, 0.15)"
                    : selectedTable.status === "unattended"
                      ? "rgba(251, 191, 36, 0.15)"
                      : "rgba(52, 211, 153, 0.15)"
                }
                paddingHorizontal={6}
                paddingVertical={2}
                borderRadius={4}
              >
                <Text
                  fontSize={10}
                  fontWeight="800"
                  color={
                    selectedTable.status === "dirty"
                      ? "#f87171"
                      : selectedTable.status === "unattended"
                        ? "#fbbf24"
                        : "#34d399"
                  }
                  fontFamily="$mono"
                >
                  {selectedTable.status === "dirty"
                    ? "ALERTA: PENDIENTE LIMPIEZA"
                    : selectedTable.status === "unattended"
                      ? "ALERTA: SIN ATENCIÓN"
                      : selectedTable.status === "occupied"
                        ? "EN SERVICIO"
                        : "DISPONIBLE"}
                </Text>
              </View>
            </XStack>
            <Text fontSize={11} color={colors.textLabel} fontFamily="$mono">
              Tiempo en estado: {selectedTable.minutesInState} min
            </Text>
          </XStack>

          <Text fontSize={12} color={colors.textSec} fontFamily="$body">
            {selectedTable.notes}
            {selectedTable.server && ` · Mozo a cargo: ${selectedTable.server}`}
          </Text>
        </View>
      )}

      {/* LIVE AUDIT LOG */}
      <YStack gap={6}>
        <Text fontSize={11} fontWeight="700" color={colors.textLabel} fontFamily="$mono">
          ÚLTIMAS ANOMALÍAS REGISTRADAS EN SALÓN
        </Text>
        <YStack gap={4}>
          <XStack
            alignItems="center"
            gap={8}
            backgroundColor={colors.bg}
            padding={8}
            borderRadius={6}
          >
            <View width={6} height={6} borderRadius={3} backgroundColor="#f87171" />
            <Text fontSize={11} color={colors.text} fontFamily="$body" flex={1}>
              <Text fontWeight="700">15:42:10</Text> —{" "}
              <Text color="#f87171" fontWeight="700">
                Mesa 02
              </Text>{" "}
              superó el umbral de 4 minutos desocupada sin retirar vajilla. Bloquea entrada de
              clientes en espera.
            </Text>
          </XStack>
          <XStack
            alignItems="center"
            gap={8}
            backgroundColor={colors.bg}
            padding={8}
            borderRadius={6}
          >
            <View width={6} height={6} borderRadius={3} backgroundColor="#fbbf24" />
            <Text fontSize={11} color={colors.text} fontFamily="$body" flex={1}>
              <Text fontWeight="700">15:39:45</Text> —{" "}
              <Text color="#fbbf24" fontWeight="700">
                Mesa 06
              </Text>{" "}
              ocupada por comensales durante 6.4 minutos sin acercamiento de personal de sala.
            </Text>
          </XStack>
          <XStack
            alignItems="center"
            gap={8}
            backgroundColor={colors.bg}
            padding={8}
            borderRadius={6}
          >
            <View width={6} height={6} borderRadius={3} backgroundColor="#34d399" />
            <Text fontSize={11} color={colors.text} fontFamily="$body" flex={1}>
              <Text fontWeight="700">15:35:12</Text> —{" "}
              <Text color="#34d399" fontWeight="700">
                Mesa 03
              </Text>{" "}
              limpiada en 1.8 min. Detección automática de mesa libre para recepción.
            </Text>
          </XStack>
        </YStack>
      </YStack>
    </View>
  );
}
