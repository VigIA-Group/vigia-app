import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { useColors } from "@/src/hooks/use-colors";
import { Image } from "expo-image";
import {
  AlertCircle,
  AlertTriangle,
  Armchair,
  CheckCircle2,
  Clock,
  Eye,
  Flame,
  Layers,
  Sparkles,
  Users,
  UtensilsCrossed,
  X,
  Zap,
} from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";

export interface TableZoneState {
  id: string;
  name: string;
  section: "Salón Norte" | "Salón Centro" | "Salón Terraza" | "Barra VIP";
  capacity: number;
  status: "optimal" | "waiting_dish" | "delayed" | "free";
  occupiedSince?: string;
  dwellMinutes?: number;
  waiter?: string;
  currentDishes?: string;
  ticketAmount?: string;
  aiRecommendation?: string;
}

export function FloorplanHeatmapInteractive() {
  const colors = useColors();
  const { isDesktop } = useBreakpoint();
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
  const [selectedTableId, setSelectedTableId] = useState<string>("M-04");

  const tables: TableZoneState[] = [
    {
      id: "M-01",
      name: "Mesa 01",
      section: "Salón Norte",
      capacity: 4,
      status: "optimal",
      occupiedSince: "15:20",
      dwellMinutes: 24,
      waiter: "Carlos G.",
      currentDishes: "2x Bife de Chorizo · 1x Ensalada César",
      ticketAmount: "$58.00",
      aiRecommendation: "Servicio a tiempo. Próximo contacto para reposición de bebidas en 6 min.",
    },
    {
      id: "M-02",
      name: "Mesa 02",
      section: "Salón Norte",
      capacity: 2,
      status: "optimal",
      occupiedSince: "15:28",
      dwellMinutes: 16,
      waiter: "Carlos G.",
      currentDishes: "1x Salmón a la plancha",
      ticketAmount: "$32.00",
      aiRecommendation: "Comida en curso dentro del estándar óptimo de 35 min.",
    },
    {
      id: "M-03",
      name: "Mesa 03",
      section: "Salón Norte",
      capacity: 6,
      status: "free",
      aiRecommendation: "Mesa disponible, higienizada y lista para asignación por Hostess.",
    },
    {
      id: "M-04",
      name: "Mesa 04",
      section: "Salón Centro",
      capacity: 4,
      status: "delayed",
      occupiedSince: "14:58",
      dwellMinutes: 46,
      waiter: "Andrea P.",
      currentDishes: "Consumo finalizado · 3x Postres volcán de chocolate",
      ticketAmount: "$84.00",
      aiRecommendation:
        "⚠️ TIEMPO CRÍTICO: Mesa lleva 14 min sin consumo activo esperando cuenta. Llevar cuenta liberará la mesa para el grupo en fila.",
    },
    {
      id: "M-05",
      name: "Mesa 05",
      section: "Salón Centro",
      capacity: 4,
      status: "waiting_dish",
      occupiedSince: "15:15",
      dwellMinutes: 29,
      waiter: "Andrea P.",
      currentDishes: "Comanda enviada a cocina hace 16 min (Pase demorado)",
      ticketAmount: "$64.00",
      aiRecommendation:
        "Demora de cocina detectada por cámara del pase. Notificar al capitán de salón.",
    },
    {
      id: "M-06",
      name: "Mesa 06",
      section: "Salón Centro",
      capacity: 2,
      status: "optimal",
      occupiedSince: "15:32",
      dwellMinutes: 12,
      waiter: "Sebastián R.",
      currentDishes: "Entradas servidas · 2x Empanadas rústicas",
      ticketAmount: "$22.00",
      aiRecommendation: "Ritmo perfecto. Platos principales estimados para salir en 8 min.",
    },
    {
      id: "M-07",
      name: "Mesa 07",
      section: "Salón Centro",
      capacity: 4,
      status: "optimal",
      occupiedSince: "15:10",
      dwellMinutes: 34,
      waiter: "Andrea P.",
      currentDishes: "Platos principales en mesa · Consumo 80%",
      ticketAmount: "$72.00",
      aiRecommendation: "Ofrecer postres o café en 5 min.",
    },
    {
      id: "M-08",
      name: "Mesa 08",
      section: "Salón Centro",
      capacity: 2,
      status: "free",
      aiRecommendation: "Mesa libre. Limpieza realizada hace 4 min.",
    },
    {
      id: "M-09",
      name: "Mesa 09",
      section: "Salón Terraza",
      capacity: 4,
      status: "waiting_dish",
      occupiedSince: "15:18",
      dwellMinutes: 26,
      waiter: "Mauricio V.",
      currentDishes: "2x Hamburguesa Angus gourmet",
      ticketAmount: "$38.00",
      aiRecommendation: "Plato listo en pase de cocina esperando retiro por mesero.",
    },
    {
      id: "M-10",
      name: "Mesa 10",
      section: "Salón Terraza",
      capacity: 4,
      status: "optimal",
      occupiedSince: "15:25",
      dwellMinutes: 19,
      waiter: "Mauricio V.",
      currentDishes: "Platos principales servidos",
      ticketAmount: "$48.00",
      aiRecommendation: "Servicio normal en terraza.",
    },
    {
      id: "M-11",
      name: "Mesa 11",
      section: "Salón Terraza",
      capacity: 6,
      status: "optimal",
      occupiedSince: "15:05",
      dwellMinutes: 39,
      waiter: "Mauricio V.",
      currentDishes: "Parrillada mixta para 4",
      ticketAmount: "$115.00",
      aiRecommendation: "Comensales satisfechos. Tiempo proyectado de salida: 15 min.",
    },
    {
      id: "M-12",
      name: "Mesa 12",
      section: "Salón Terraza",
      capacity: 2,
      status: "free",
      aiRecommendation: "Mesa libre en zona exterior.",
    },
  ];

  const selectedTable = tables.find((t) => t.id === selectedTableId) || tables[3];

  const getStatusBadge = (status: TableZoneState["status"]) => {
    switch (status) {
      case "delayed":
        return {
          label: "DEMORA CRÍTICA",
          color: "#ef4444",
          bg: "rgba(239, 68, 68, 0.2)",
          borderColor: "rgba(239, 68, 68, 0.4)",
        };
      case "waiting_dish":
        return {
          label: "ESPERA PLATO",
          color: "#f59e0b",
          bg: "rgba(245, 158, 11, 0.2)",
          borderColor: "rgba(245, 158, 11, 0.4)",
        };
      case "optimal":
        return {
          label: "EN TIEMPO",
          color: "#10b981",
          bg: "rgba(16, 185, 129, 0.2)",
          borderColor: "rgba(16, 185, 129, 0.4)",
        };
      case "free":
      default:
        return {
          label: "DISPONIBLE",
          color: "#94a3b8",
          bg: "rgba(255, 255, 255, 0.05)",
          borderColor: "rgba(255, 255, 255, 0.12)",
        };
    }
  };

  return (
    <View
      backgroundColor={colors.card}
      borderRadius={16}
      borderWidth={1}
      borderColor={colors.borderSoft}
      overflow="hidden"
      gap={0}
    >
      {/* 1. HEADER WITH HEATMAP TOGGLE */}
      <View
        backgroundColor="rgba(5, 14, 29, 0.95)"
        paddingHorizontal={16}
        paddingVertical={12}
        borderBottomWidth={1}
        borderBottomColor={colors.borderSoft}
      >
        <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={10}>
          <XStack alignItems="center" gap={10}>
            <View
              width={34}
              height={34}
              borderRadius={8}
              backgroundColor="rgba(16, 185, 129, 0.15)"
              alignItems="center"
              justifyContent="center"
              borderWidth={1}
              borderColor="rgba(16, 185, 129, 0.3)"
            >
              <Armchair size={18} color="#34d399" />
            </View>
            <YStack gap={1}>
              <XStack alignItems="center" gap={8}>
                <Text fontSize={14} fontWeight="800" color="#ffffff" fontFamily="$body">
                  PLANO INTERACTIVO DE SALÓN & TIEMPOS DE ATENCIÓN
                </Text>
                <View
                  backgroundColor="rgba(33, 152, 244, 0.15)"
                  paddingHorizontal={6}
                  paddingVertical={2}
                  borderRadius={4}
                  borderWidth={1}
                  borderColor="rgba(33, 152, 244, 0.3)"
                >
                  <Text fontSize={9.5} fontWeight="700" color="#38bdf8" fontFamily="$mono">
                    OCUPACIÓN 75%
                  </Text>
                </View>
              </XStack>
              <Text fontSize={11} color="#94a3b8" fontFamily="$body">
                Haz clic en cualquier mesa para auditar tiempos, platos en espera y recomendaciones
                de IA
              </Text>
            </YStack>
          </XStack>

          {/* Heatmap toggle button */}
          <TouchableOpacity
            onPress={() => setShowHeatmap(!showHeatmap)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              paddingHorizontal: 12,
              paddingVertical: 7,
              borderRadius: 8,
              backgroundColor: showHeatmap
                ? "rgba(245, 158, 11, 0.25)"
                : "rgba(255, 255, 255, 0.08)",
              borderWidth: 1,
              borderColor: showHeatmap ? "#f59e0b" : "rgba(255, 255, 255, 0.15)",
            }}
          >
            <Flame size={15} color={showHeatmap ? "#f59e0b" : "#ffffff"} />
            <Text
              fontSize={11.5}
              fontWeight="700"
              color={showHeatmap ? "#f59e0b" : "#ffffff"}
              fontFamily="$body"
            >
              {showHeatmap ? "Ocultar Mapa de Calor" : "Ver Mapa de Calor de Tráfico"}
            </Text>
          </TouchableOpacity>
        </XStack>

        {/* Status Legend */}
        <XStack gap={14} marginTop={10} flexWrap="wrap">
          <XStack alignItems="center" gap={5}>
            <View width={8} height={8} borderRadius={4} backgroundColor="#10b981" />
            <Text fontSize={10.5} color="#94a3b8" fontFamily="$body">
              En tiempo (&lt;30m)
            </Text>
          </XStack>
          <XStack alignItems="center" gap={5}>
            <View width={8} height={8} borderRadius={4} backgroundColor="#f59e0b" />
            <Text fontSize={10.5} color="#94a3b8" fontFamily="$body">
              Espera plato (&gt;12m)
            </Text>
          </XStack>
          <XStack alignItems="center" gap={5}>
            <View width={8} height={8} borderRadius={4} backgroundColor="#ef4444" />
            <Text fontSize={10.5} color="#94a3b8" fontFamily="$body">
              Demora crítica (&gt;40m o cuenta lenta)
            </Text>
          </XStack>
          <XStack alignItems="center" gap={5}>
            <View width={8} height={8} borderRadius={4} backgroundColor="#64748b" />
            <Text fontSize={10.5} color="#94a3b8" fontFamily="$body">
              Disponible / Libre
            </Text>
          </XStack>
        </XStack>
      </View>

      {/* 2. MAIN BODY: FLOORPLAN GRID + SELECTED TABLE DETAIL DRAWER */}
      <XStack
        flexDirection={isDesktop ? "row" : "column"}
        alignItems="stretch"
        position="relative"
      >
        {/* FLOORPLAN 2D CANVAS */}
        <View
          flex={3}
          padding={16}
          backgroundColor="rgba(2, 32, 154, 0.08)"
          position="relative"
          gap={14}
        >
          {/* Optional Heatmap image overlay */}
          {showHeatmap && (
            <View
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              opacity={0.35}
              pointerEvents="none"
              overflow="hidden"
            >
              <Image
                source={require("@/assets/heatmap.png")}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            </View>
          )}

          {/* Operational Anchor Bars (Kitchen pass, Bar, Entrance) */}
          <XStack gap={10} flexWrap="wrap">
            {/* Pase de Cocina */}
            <View
              flex={2}
              backgroundColor="rgba(239, 68, 68, 0.12)"
              borderWidth={1.5}
              borderColor="rgba(239, 68, 68, 0.4)"
              borderRadius={10}
              padding={10}
              gap={4}
            >
              <XStack justifyContent="space-between" alignItems="center">
                <XStack alignItems="center" gap={6}>
                  <UtensilsCrossed size={14} color="#f87171" />
                  <Text fontSize={11} fontWeight="800" color="#f87171" fontFamily="$mono">
                    PASE DE COCINA CALIENTE
                  </Text>
                </XStack>
                <View
                  backgroundColor="#ef4444"
                  paddingHorizontal={6}
                  paddingVertical={2}
                  borderRadius={4}
                >
                  <Text fontSize={9.5} fontWeight="800" color="#ffffff" fontFamily="$mono">
                    4 PLATOS EN ESPERA
                  </Text>
                </View>
              </XStack>
              <Text fontSize={10} color="#cbd5e1" fontFamily="$body">
                Cámara Cám-01 monitoreando salida de platos · Tiempo máx actual: 07:18 min
              </Text>
            </View>

            {/* Barra */}
            <View
              flex={1}
              backgroundColor="rgba(33, 152, 244, 0.12)"
              borderWidth={1.5}
              borderColor="rgba(33, 152, 244, 0.4)"
              borderRadius={10}
              padding={10}
              gap={4}
            >
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize={11} fontWeight="800" color="#38bdf8" fontFamily="$mono">
                  BARRA DE TRAGOS
                </Text>
                <Text fontSize={10} fontWeight="700" color="#38bdf8" fontFamily="$mono">
                  6/10
                </Text>
              </XStack>
              <Text fontSize={10} color="#cbd5e1" fontFamily="$body">
                Espera media: 2.4 min
              </Text>
            </View>

            {/* Recepción / Hostess */}
            <View
              flex={1}
              backgroundColor="rgba(245, 158, 11, 0.12)"
              borderWidth={1.5}
              borderColor="rgba(245, 158, 11, 0.4)"
              borderRadius={10}
              padding={10}
              gap={4}
            >
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize={11} fontWeight="800" color="#f59e0b" fontFamily="$mono">
                  HOSTESS & FILA
                </Text>
                <Text fontSize={10} fontWeight="700" color="#f59e0b" fontFamily="$mono">
                  5 EN FILA
                </Text>
              </XStack>
              <Text fontSize={10} color="#cbd5e1" fontFamily="$body">
                Espera media: 04:30 min
              </Text>
            </View>
          </XStack>

          {/* TABLES GRID BY SECTIONS */}
          <YStack gap={12}>
            {/* SECTION: SALÓN CENTRO & NORTE */}
            <YStack gap={6}>
              <Text
                fontSize={11}
                fontWeight="800"
                color={colors.textLabel}
                fontFamily="$mono"
                letterSpacing={0.5}
              >
                SALÓN NORTE Y CENTRO (ZONA PRINCIPAL)
              </Text>
              <XStack flexWrap="wrap" gap={10}>
                {tables.slice(0, 8).map((tbl) => {
                  const isSelected = tbl.id === selectedTableId;
                  const badge = getStatusBadge(tbl.status);

                  return (
                    <TouchableOpacity
                      key={tbl.id}
                      onPress={() => setSelectedTableId(tbl.id)}
                      style={{
                        flex: 1,
                        minWidth: 105,
                        backgroundColor: isSelected
                          ? "rgba(33, 152, 244, 0.25)"
                          : "rgba(5, 14, 29, 0.75)",
                        borderRadius: 10,
                        borderWidth: isSelected ? 2 : 1.5,
                        borderColor: isSelected ? "#38bdf8" : badge.borderColor,
                        padding: 10,
                        gap: 6,
                      }}
                    >
                      <XStack justifyContent="space-between" alignItems="center">
                        <Text
                          fontSize={12}
                          fontWeight="800"
                          color={isSelected ? "#38bdf8" : "#ffffff"}
                          fontFamily="$mono"
                        >
                          {tbl.name}
                        </Text>
                        <View
                          width={8}
                          height={8}
                          borderRadius={4}
                          backgroundColor={badge.color}
                        />
                      </XStack>

                      <XStack justifyContent="space-between" alignItems="center">
                        <XStack alignItems="center" gap={4}>
                          <Users size={11} color="#94a3b8" />
                          <Text fontSize={10} color="#94a3b8" fontFamily="$mono">
                            {tbl.capacity}p
                          </Text>
                        </XStack>
                        {tbl.dwellMinutes !== undefined && (
                          <XStack alignItems="center" gap={3}>
                            <Clock size={10} color={badge.color} />
                            <Text
                              fontSize={10}
                              fontWeight="700"
                              color={badge.color}
                              fontFamily="$mono"
                            >
                              {tbl.dwellMinutes}m
                            </Text>
                          </XStack>
                        )}
                      </XStack>
                    </TouchableOpacity>
                  );
                })}
              </XStack>
            </YStack>

            {/* SECTION: SALÓN TERRAZA */}
            <YStack gap={6}>
              <Text
                fontSize={11}
                fontWeight="800"
                color={colors.textLabel}
                fontFamily="$mono"
                letterSpacing={0.5}
              >
                SALÓN TERRAZA (ZONA EXTERIOR)
              </Text>
              <XStack flexWrap="wrap" gap={10}>
                {tables.slice(8, 12).map((tbl) => {
                  const isSelected = tbl.id === selectedTableId;
                  const badge = getStatusBadge(tbl.status);

                  return (
                    <TouchableOpacity
                      key={tbl.id}
                      onPress={() => setSelectedTableId(tbl.id)}
                      style={{
                        flex: 1,
                        minWidth: 105,
                        backgroundColor: isSelected
                          ? "rgba(33, 152, 244, 0.25)"
                          : "rgba(5, 14, 29, 0.75)",
                        borderRadius: 10,
                        borderWidth: isSelected ? 2 : 1.5,
                        borderColor: isSelected ? "#38bdf8" : badge.borderColor,
                        padding: 10,
                        gap: 6,
                      }}
                    >
                      <XStack justifyContent="space-between" alignItems="center">
                        <Text
                          fontSize={12}
                          fontWeight="800"
                          color={isSelected ? "#38bdf8" : "#ffffff"}
                          fontFamily="$mono"
                        >
                          {tbl.name}
                        </Text>
                        <View
                          width={8}
                          height={8}
                          borderRadius={4}
                          backgroundColor={badge.color}
                        />
                      </XStack>

                      <XStack justifyContent="space-between" alignItems="center">
                        <XStack alignItems="center" gap={4}>
                          <Users size={11} color="#94a3b8" />
                          <Text fontSize={10} color="#94a3b8" fontFamily="$mono">
                            {tbl.capacity}p
                          </Text>
                        </XStack>
                        {tbl.dwellMinutes !== undefined && (
                          <XStack alignItems="center" gap={3}>
                            <Clock size={10} color={badge.color} />
                            <Text
                              fontSize={10}
                              fontWeight="700"
                              color={badge.color}
                              fontFamily="$mono"
                            >
                              {tbl.dwellMinutes}m
                            </Text>
                          </XStack>
                        )}
                      </XStack>
                    </TouchableOpacity>
                  );
                })}
              </XStack>
            </YStack>
          </YStack>
        </View>

        {/* 3. SELECTED TABLE AUDIT DETAIL DRAWER (RIGHT COLUMN) */}
        <View
          flex={2}
          backgroundColor={colors.card}
          borderLeftWidth={isDesktop ? 1 : 0}
          borderTopWidth={isDesktop ? 0 : 1}
          borderColor={colors.borderSoft}
          padding={16}
          gap={12}
        >
          {/* Header of detail */}
          <XStack justifyContent="space-between" alignItems="center">
            <XStack alignItems="center" gap={8}>
              <View
                width={30}
                height={30}
                borderRadius={8}
                backgroundColor="rgba(33, 152, 244, 0.15)"
                alignItems="center"
                justifyContent="center"
              >
                <Eye size={16} color="#38bdf8" />
              </View>
              <YStack gap={1}>
                <Text fontSize={14} fontWeight="800" color={colors.text} fontFamily="$body">
                  Auditoría Visual: {selectedTable.name}
                </Text>
                <Text fontSize={10.5} color={colors.textSec} fontFamily="$body">
                  {selectedTable.section} · Capacidad {selectedTable.capacity} comensales
                </Text>
              </YStack>
            </XStack>

            {(() => {
              const badge = getStatusBadge(selectedTable.status);
              return (
                <View
                  backgroundColor={badge.bg}
                  paddingHorizontal={8}
                  paddingVertical={3}
                  borderRadius={6}
                  borderWidth={1}
                  borderColor={badge.borderColor}
                >
                  <Text fontSize={10} fontWeight="800" color={badge.color} fontFamily="$mono">
                    {badge.label}
                  </Text>
                </View>
              );
            })()}
          </XStack>

          {/* Dwell time & Waiter metrics */}
          <XStack gap={10}>
            <View
              flex={1}
              backgroundColor={colors.bg}
              borderRadius={8}
              padding={10}
              borderWidth={1}
              borderColor={colors.borderSoft}
              gap={2}
            >
              <Text fontSize={10} color={colors.textLabel} fontFamily="$mono">
                TIEMPO EN MESA
              </Text>
              <Text fontSize={16} fontWeight="800" color={colors.text} fontFamily="$mono">
                {selectedTable.dwellMinutes !== undefined
                  ? `${selectedTable.dwellMinutes} min`
                  : "0 min"}
              </Text>
              <Text fontSize={9.5} color={colors.textSec}>
                {selectedTable.occupiedSince ? `Desde ${selectedTable.occupiedSince}` : "Libre"}
              </Text>
            </View>

            <View
              flex={1}
              backgroundColor={colors.bg}
              borderRadius={8}
              padding={10}
              borderWidth={1}
              borderColor={colors.borderSoft}
              gap={2}
            >
              <Text fontSize={10} color={colors.textLabel} fontFamily="$mono">
                MOZO ASIGNADO
              </Text>
              <Text
                fontSize={14}
                fontWeight="800"
                color={colors.text}
                fontFamily="$body"
                numberOfLines={1}
              >
                {selectedTable.waiter || "Sin asignar"}
              </Text>
              <Text fontSize={9.5} color={colors.textSec}>
                {selectedTable.ticketAmount ? `Ticket: ${selectedTable.ticketAmount}` : "Disponible"}
              </Text>
            </View>
          </XStack>

          {/* Current Orders detected */}
          {selectedTable.currentDishes && (
            <YStack
              backgroundColor={colors.bg}
              borderRadius={8}
              padding={10}
              borderWidth={1}
              borderColor={colors.borderSoft}
              gap={4}
            >
              <Text fontSize={10} fontWeight="700" color={colors.textLabel} fontFamily="$mono">
                DETECCIÓN DE CONSUMO & COMANDA
              </Text>
              <Text fontSize={11.5} color={colors.text} fontFamily="$body" fontWeight="600">
                {selectedTable.currentDishes}
              </Text>
            </YStack>
          )}

          {/* AI Recommendation */}
          <YStack
            backgroundColor="rgba(33, 152, 244, 0.08)"
            borderRadius={10}
            padding={12}
            borderWidth={1}
            borderColor="rgba(33, 152, 244, 0.3)"
            gap={6}
          >
            <XStack alignItems="center" gap={6}>
              <Sparkles size={14} color="#38bdf8" />
              <Text fontSize={11} fontWeight="800" color="#38bdf8" fontFamily="$body">
                DIAGNÓSTICO VIGIA IA
              </Text>
            </XStack>
            <Text fontSize={11.5} color={colors.text} fontFamily="$body" lineHeight={17}>
              {selectedTable.aiRecommendation}
            </Text>
          </YStack>

          {/* Action button */}
          <TouchableOpacity
            style={{
              backgroundColor: "#2198F4",
              borderRadius: 8,
              paddingVertical: 9,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text fontSize={11.5} fontWeight="800" color="#ffffff" fontFamily="$body">
              Enviar Alerta a Mozo / Capitán
            </Text>
          </TouchableOpacity>
        </View>
      </XStack>
    </View>
  );
}

