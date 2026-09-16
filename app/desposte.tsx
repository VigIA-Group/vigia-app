import { PageContainer } from "@/src/components/page-container";
import { SvgBarChart } from "@/src/components/charts/svg-bar-chart";
import { SvgLineChart } from "@/src/components/charts/svg-line-chart";
import { VIGIA_COLORS } from "@/src/components/charts/chart-theme";
import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { useColors } from "@/src/hooks/use-colors";
import { router } from "expo-router";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Beef,
  Bell,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  Eye,
  Factory,
  Layers,
  Pause,
  Play,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react-native";
import React, { useState } from "react";
import { Platform, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View, XStack, YStack } from "tamagui";

type DesposteTab = "all" | "cuts" | "epp" | "downtime" | "workers";
type Period = "today" | "7d" | "30d";

interface PorkCutItem {
  id: string;
  name: string;
  code: string;
  count: number;
  target: number;
  percentage: number;
  color: string;
  expectedPerPig: number;
  status: "optimal" | "warning" | "alert";
}

const PORK_CUTS: PorkCutItem[] = [
  {
    id: "cut-muslo",
    name: "Jamón / Muslo Trasero (Pierna)",
    code: "MUSLO-TR",
    count: 142,
    target: 140,
    percentage: 20.3,
    color: "#10b981",
    expectedPerPig: 2,
    status: "optimal",
  },
  {
    id: "cut-costilla",
    name: "Costillar / Pechito (Ribs)",
    code: "COST-RIB",
    count: 141,
    target: 140,
    percentage: 20.1,
    color: "#f59e0b",
    expectedPerPig: 2,
    status: "optimal",
  },
  {
    id: "cut-paleta",
    name: "Paleta / Brazuelo Delantero",
    code: "PAL-BRZ",
    count: 140,
    target: 140,
    percentage: 20.0,
    color: "#8b5cf6",
    expectedPerPig: 2,
    status: "optimal",
  },
  {
    id: "cut-lomo",
    name: "Lomo / Carré / Cinta",
    code: "LOM-CAR",
    count: 138,
    target: 140,
    percentage: 19.7,
    color: "#ec4899",
    expectedPerPig: 2,
    status: "optimal",
  },
  {
    id: "cut-cabeza",
    name: "Cabeza de Cerdo Despiezada",
    code: "CAB-PIG",
    count: 70,
    target: 70,
    percentage: 10.0,
    color: "#2198f4",
    expectedPerPig: 1,
    status: "optimal",
  },
  {
    id: "cut-panceta",
    name: "Panceta / Tocino / Bacon",
    code: "PAN-TOC",
    count: 70,
    target: 70,
    percentage: 9.9,
    color: "#38bdf8",
    expectedPerPig: 1,
    status: "optimal",
  },
];

const HOURLY_DESPOSTE = [
  { hour: "06:00", produced: 45, target: 80, speed: 30, eppViolations: 0, status: "OK" },
  { hour: "07:00", produced: 85, target: 85, speed: 45, eppViolations: 0, status: "OK" },
  { hour: "08:00", produced: 92, target: 85, speed: 48, eppViolations: 1, status: "Atasco 8m" },
  { hour: "09:00", produced: 105, target: 90, speed: 52, eppViolations: 1, status: "Pico" },
  { hour: "10:00", produced: 110, target: 90, speed: 54, eppViolations: 0, status: "Pico" },
  { hour: "11:00", produced: 88, target: 85, speed: 44, eppViolations: 1, status: "Afilado 10m" },
  { hour: "12:00", produced: 98, target: 85, speed: 49, eppViolations: 0, status: "OK" },
  { hour: "13:00", produced: 78, target: 50, speed: 38, eppViolations: 0, status: "Cierre" },
];

const EPP_WORKERS = [
  {
    id: "OP-01",
    name: "Carlos Mendoza (Despostador Principal)",
    position: "Mesa 1 · Cabecera",
    meshGlove: 100,
    mask: 98.4,
    cap: 100,
    apronId: true,
    piecesCut: 125,
    status: "optimal",
  },
  {
    id: "OP-02",
    name: "Javier Rodríguez (Jamones & Muslos)",
    position: "Mesa 2 · Cuartos Traseros",
    meshGlove: 99.2,
    mask: 97.1,
    cap: 100,
    apronId: true,
    piecesCut: 118,
    status: "optimal",
  },
  {
    id: "OP-03",
    name: "Marcos Vaca (Paletas & Brazuelos)",
    position: "Mesa 3 · Delanteros",
    meshGlove: 98.5,
    mask: 95.8,
    cap: 98.2,
    apronId: true,
    piecesCut: 110,
    status: "optimal",
  },
  {
    id: "OP-04",
    name: "Héctor Soliz (Costillares & Pechitos)",
    position: "Mesa 4 · Costillar",
    meshGlove: 100,
    mask: 96.5,
    cap: 100,
    apronId: true,
    piecesCut: 105,
    status: "optimal",
  },
  {
    id: "OP-05",
    name: "Ramiro Chávez (Lomos & Carré)",
    position: "Mesa 5 · Lomo",
    meshGlove: 99.1,
    mask: 98.0,
    cap: 100,
    apronId: true,
    piecesCut: 98,
    status: "optimal",
  },
  {
    id: "OP-06",
    name: "Gonzalo Pinto (Cabezas & Menudencias)",
    position: "Mesa 6 · Despiece Menor",
    meshGlove: 100,
    mask: 96.0,
    cap: 99.0,
    apronId: true,
    piecesCut: 72,
    status: "optimal",
  },
  {
    id: "OP-07",
    name: "Rubén Arnez (Cuchillero de Apoyo)",
    position: "Mesa 2-3 · Apoyo Línea",
    meshGlove: 94.2,
    mask: 93.8,
    cap: 100,
    apronId: true,
    piecesCut: 45,
    status: "warning",
  },
  {
    id: "OP-08",
    name: "Fernando Siles (Inspección & Salida)",
    position: "Cinta Final · Control Calidad",
    meshGlove: 98.8,
    mask: 98.2,
    cap: 100,
    apronId: true,
    piecesCut: 28,
    status: "optimal",
  },
];

const DOWNTIME_LOG = [
  {
    id: "dt-1",
    time: "08:42 – 08:50",
    durationMinutes: 8,
    type: "Atasco en Transfer de Cinta",
    reason:
      "Acumulación > 3 piezas cárnicas en curva de acero. Detección automática por IA y parada preventiva de cinta.",
    severity: "minor",
    color: "#fbbf24",
  },
  {
    id: "dt-2",
    time: "11:15 – 11:25",
    durationMinutes: 10,
    type: "Afilado Preventivo & Sanitización",
    reason:
      "Pausa programada según protocolo SOP para afilado de cuchillería y desinfección de tablas de corte.",
    severity: "scheduled",
    color: "#38bdf8",
  },
];

const RECENT_ALERTS = [
  {
    id: "alt-1",
    time: "11:22:14",
    title: "Alerta Inocuidad · Barbijo Desplazado",
    desc: "Operario #07 detectado con barbijo bajo durante manipulación en mesa 2. Supervisor notificado en app.",
    severity: "medium",
    color: "#f59e0b",
  },
  {
    id: "alt-2",
    time: "09:14:08",
    title: "Alerta Seguridad · Cuchillo sin Guante Anticorte",
    desc: "Operario #07 manipulando cuchillo sin guante de malla de acero reglamentario. Alarma en puesto activada (resuelta en 45s).",
    severity: "critical",
    color: "#f87171",
  },
  {
    id: "alt-3",
    time: "08:42:30",
    title: "Parada de Cinta · Congestión de Piezas",
    desc: "Cámara 03 detectó congestión de costillares en transfer hacia empaque. Despejado y reactivado en 8 min.",
    severity: "info",
    color: "#38bdf8",
  },
  {
    id: "alt-4",
    time: "06:12:00",
    title: "Puntualidad en Puesto · Inicio de Turno",
    desc: "8 de 8 operarios identificados por código en mandil ocuparon sus mesas de desposte dentro de horario estándar.",
    severity: "success",
    color: "#34d399",
  },
];

export default function DesposteScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isDesktop } = useBreakpoint();

  const [activeTab, setActiveTab] = useState<DesposteTab>("all");
  const [period, setPeriod] = useState<Period>("today");
  const [selectedCut, setSelectedCut] = useState<string | null>(null);

  const totalCuts = PORK_CUTS.reduce((acc, c) => acc + c.count, 0);

  return (
    <PageContainer>
      <View flex={1} backgroundColor={colors.bg}>
        {/* TOP HEADER */}
        <View
          backgroundColor={colors.card}
          borderBottomWidth={1}
          borderBottomColor={colors.borderSoft}
          paddingTop={Math.max(insets.top, 14)}
          paddingBottom={14}
          paddingHorizontal={isDesktop ? 28 : 16}
        >
          <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={12}>
            {/* Breadcrumb & Title */}
            <XStack alignItems="center" gap={12}>
              <TouchableOpacity
                onPress={() => {
                  if (router.canGoBack()) {
                    router.back();
                  } else {
                    router.push("/(tabs)/reports" as any);
                  }
                }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: colors.borderSoft,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ArrowLeft size={18} color={colors.text} />
              </TouchableOpacity>

              <YStack gap={2}>
                <XStack alignItems="center" gap={8}>
                  <Text fontSize={18} fontWeight="800" color={colors.text} fontFamily="$body">
                    Sala de Desposte · Frigorífico Porcino
                  </Text>
                  <View
                    backgroundColor="rgba(16, 185, 129, 0.15)"
                    borderWidth={1}
                    borderColor="rgba(16, 185, 129, 0.35)"
                    paddingHorizontal={8}
                    paddingVertical={3}
                    borderRadius={6}
                    flexDirection="row"
                    alignItems="center"
                    gap={5}
                  >
                    <View width={6} height={6} borderRadius={3} backgroundColor="#10b981" />
                    <Text fontSize={10} fontWeight="700" color="#34d399" fontFamily="$mono">
                      6 CÁMARAS ACTIVAS
                    </Text>
                  </View>
                </XStack>
                <Text fontSize={11.5} color={colors.textSec} fontFamily="$body">
                  CAM-03 (Cinta Central) · CAM-04 (Mesa Jamón/Muslo) · CAM-05 (Mesa Paletas/Cabeza)
                  · CAM-01 (EPP & Acceso)
                </Text>
              </YStack>
            </XStack>

            {/* Controls Right */}
            <XStack alignItems="center" gap={10}>
              {/* Period Switcher */}
              <XStack
                backgroundColor={colors.bg}
                borderRadius={8}
                padding={2}
                borderWidth={1}
                borderColor={colors.borderSoft}
              >
                {(
                  [
                    { id: "today", label: "Hoy" },
                    { id: "7d", label: "7 días" },
                    { id: "30d", label: "30 días" },
                  ] as { id: Period; label: string }[]
                ).map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    onPress={() => setPeriod(p.id)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 6,
                      backgroundColor: period === p.id ? colors.card : "transparent",
                    }}
                  >
                    <Text
                      fontSize={11}
                      fontWeight={period === p.id ? "700" : "500"}
                      color={period === p.id ? colors.text : colors.textLabel}
                    >
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </XStack>

              {/* Interactive Demo Link */}
              {Platform.OS === "web" && (
                <TouchableOpacity
                  onPress={() => {
                    if (typeof window !== "undefined") {
                      window.open("/cotizaciones/demo_desposte_cerdos.html", "_blank");
                    }
                  }}
                  style={{
                    backgroundColor: "rgba(33, 152, 244, 0.12)",
                    borderWidth: 1,
                    borderColor: "rgba(33, 152, 244, 0.35)",
                    paddingHorizontal: 12,
                    paddingVertical: 7,
                    borderRadius: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Eye size={14} color="#38bdf8" />
                  <Text fontSize={11} fontWeight="700" color="#38bdf8">
                    Simulador en Vivo
                  </Text>
                </TouchableOpacity>
              )}
            </XStack>
          </XStack>

          {/* SUB-TABS NAVIGATION */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingTop: 14 }}
          >
            {[
              { id: "all", label: "Vista Integral", Icon: Layers },
              { id: "cuts", label: "Conteo & Cortes", Icon: Beef },
              { id: "epp", label: "EPP & Inocuidad", Icon: ShieldCheck },
              { id: "downtime", label: "Cinta & Tiempos", Icon: Clock },
              { id: "workers", label: "Operarios & Puestos", Icon: Users },
            ].map((tab) => {
              const Icon = tab.Icon;
              const isSel = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id as DesposteTab)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 8,
                    backgroundColor: isSel ? "rgba(10, 76, 232, 0.15)" : colors.card,
                    borderWidth: 1,
                    borderColor: isSel ? "#0A4CE8" : colors.borderSoft,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Icon size={14} color={isSel ? "#38bdf8" : colors.textLabel} />
                  <Text
                    fontSize={12}
                    fontWeight={isSel ? "700" : "500"}
                    color={isSel ? "#38bdf8" : colors.textLabel}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* BODY SCROLL */}
        <ScrollView contentContainerStyle={{ padding: isDesktop ? 24 : 14, gap: 16 }}>
          {/* TOP KPI CARDS */}
          <XStack flexWrap="wrap" gap={12}>
            {/* KPI 1: Piezas Producidas */}
            <View
              flex={1}
              minWidth={150}
              backgroundColor={colors.card}
              borderRadius={12}
              borderWidth={1}
              borderColor={colors.borderSoft}
              borderTopWidth={3}
              borderTopColor="#0A4CE8"
              padding={14}
              gap={6}
            >
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize={11} color={colors.textLabel} fontWeight="600">
                  Cortes Producidos
                </Text>
                <View
                  backgroundColor="rgba(10, 76, 232, 0.12)"
                  paddingHorizontal={6}
                  paddingVertical={2}
                  borderRadius={4}
                >
                  <Text fontSize={9} fontWeight="700" color="#38bdf8">
                    +7.8% vs Meta
                  </Text>
                </View>
              </XStack>
              <Text fontSize={24} fontWeight="800" color={colors.text} fontFamily="$mono">
                {totalCuts} pzas
              </Text>
              <Text fontSize={10.5} color={colors.textSec}>
                Meta turno: 650 · 71 cerdos faenados
              </Text>
            </View>

            {/* KPI 2: Conciliación / Balance */}
            <View
              flex={1}
              minWidth={150}
              backgroundColor={colors.card}
              borderRadius={12}
              borderWidth={1}
              borderColor={colors.borderSoft}
              borderTopWidth={3}
              borderTopColor="#10b981"
              padding={14}
              gap={6}
            >
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize={11} color={colors.textLabel} fontWeight="600">
                  Balance Cárnico
                </Text>
                <View
                  backgroundColor="rgba(16, 185, 129, 0.12)"
                  paddingHorizontal={6}
                  paddingVertical={2}
                  borderRadius={4}
                >
                  <Text fontSize={9} fontWeight="700" color="#34d399">
                    100% Conciliado
                  </Text>
                </View>
              </XStack>
              <Text fontSize={24} fontWeight="800" color="#34d399" fontFamily="$mono">
                71 / 71 Cerdos
              </Text>
              <Text fontSize={10.5} color={colors.textSec}>
                142 piernas esperadas vs 142 detectadas
              </Text>
            </View>

            {/* KPI 3: Precisión IA */}
            <View
              flex={1}
              minWidth={150}
              backgroundColor={colors.card}
              borderRadius={12}
              borderWidth={1}
              borderColor={colors.borderSoft}
              borderTopWidth={3}
              borderTopColor="#2198f4"
              padding={14}
              gap={6}
            >
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize={11} color={colors.textLabel} fontWeight="600">
                  Precisión IA F1-Score
                </Text>
                <View
                  backgroundColor="rgba(33, 152, 244, 0.12)"
                  paddingHorizontal={6}
                  paddingVertical={2}
                  borderRadius={4}
                >
                  <Text fontSize={9} fontWeight="700" color="#38bdf8">
                    PorkNet v2.4
                  </Text>
                </View>
              </XStack>
              <Text fontSize={24} fontWeight="800" color={colors.text} fontFamily="$mono">
                98.8%
              </Text>
              <Text fontSize={10.5} color={colors.textSec}>
                Inferencia: 15.2 ms · 6 tipos de corte
              </Text>
            </View>

            {/* KPI 4: EPP Anticorte */}
            <View
              flex={1}
              minWidth={150}
              backgroundColor={colors.card}
              borderRadius={12}
              borderWidth={1}
              borderColor={colors.borderSoft}
              borderTopWidth={3}
              borderTopColor="#8b5cf6"
              padding={14}
              gap={6}
            >
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize={11} color={colors.textLabel} fontWeight="600">
                  Guante Malla Anticorte
                </Text>
                <View
                  backgroundColor="rgba(139, 92, 246, 0.12)"
                  paddingHorizontal={6}
                  paddingVertical={2}
                  borderRadius={4}
                >
                  <Text fontSize={9} fontWeight="700" color="#a78bfa">
                    0 Accidentes
                  </Text>
                </View>
              </XStack>
              <Text fontSize={24} fontWeight="800" color="#a78bfa" fontFamily="$mono">
                98.6%
              </Text>
              <Text fontSize={10.5} color={colors.textSec}>
                Auditoría en 8 mesas de corte activas
              </Text>
            </View>

            {/* KPI 5: Disponibilidad de Cinta */}
            <View
              flex={1}
              minWidth={150}
              backgroundColor={colors.card}
              borderRadius={12}
              borderWidth={1}
              borderColor={colors.borderSoft}
              borderTopWidth={3}
              borderTopColor="#f59e0b"
              padding={14}
              gap={6}
            >
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize={11} color={colors.textLabel} fontWeight="600">
                  Disponibilidad Cinta (OEE)
                </Text>
                <View
                  backgroundColor="rgba(245, 158, 11, 0.12)"
                  paddingHorizontal={6}
                  paddingVertical={2}
                  borderRadius={4}
                >
                  <Text fontSize={9} fontWeight="700" color="#fbbf24">
                    18 min parada
                  </Text>
                </View>
              </XStack>
              <Text fontSize={24} fontWeight="800" color={colors.text} fontFamily="$mono">
                95.8%
              </Text>
              <Text fontSize={10.5} color={colors.textSec}>
                Velocidad promedio: 48 cortes/min
              </Text>
            </View>
          </XStack>

          {/* SECTION 1: CONTEO & CLASIFICACIÓN DE CORTES */}
          {(activeTab === "all" || activeTab === "cuts") && (
            <YStack gap={14}>
              <XStack justifyContent="space-between" alignItems="center">
                <XStack alignItems="center" gap={8}>
                  <Beef size={18} color="#0A4CE8" />
                  <Text fontSize={14} fontWeight="800" color={colors.text} fontFamily="$body">
                    CLASIFICACIÓN Y CONTEO DE CORTES CÁRNICOS (EN VIVO)
                  </Text>
                </XStack>
                <Text fontSize={11} color={colors.textSec}>
                  Total: {totalCuts} piezas clasificadas
                </Text>
              </XStack>

              {/* Grid of Pork Cuts Cards */}
              <XStack flexWrap="wrap" gap={12}>
                {PORK_CUTS.map((cut) => {
                  const isSelected = selectedCut === cut.id;
                  return (
                    <TouchableOpacity
                      key={cut.id}
                      onPress={() => setSelectedCut(isSelected ? null : cut.id)}
                      style={{
                        flex: 1,
                        minWidth: isDesktop ? 180 : "46%",
                        backgroundColor: isSelected ? "rgba(10, 76, 232, 0.15)" : colors.card,
                        borderWidth: isSelected ? 2 : 1,
                        borderColor: isSelected ? cut.color : colors.borderSoft,
                        borderRadius: 12,
                        padding: 12,
                      }}
                    >
                      <XStack justifyContent="space-between" alignItems="center" marginBottom={6}>
                        <View width={10} height={10} borderRadius={5} backgroundColor={cut.color} />
                        <Text
                          fontSize={10}
                          fontWeight="700"
                          color={colors.textLabel}
                          fontFamily="$mono"
                        >
                          {cut.code}
                        </Text>
                      </XStack>
                      <Text fontSize={12} fontWeight="700" color={colors.text} numberOfLines={1}>
                        {cut.name}
                      </Text>
                      <Text
                        fontSize={20}
                        fontWeight="900"
                        color={cut.color}
                        fontFamily="$mono"
                        marginVertical={4}
                      >
                        {cut.count}{" "}
                        <Text fontSize={11} color={colors.textLabel}>
                          pzas
                        </Text>
                      </Text>
                      <XStack justifyContent="space-between" alignItems="center">
                        <Text fontSize={10} color={colors.textSec}>
                          {cut.percentage}% del total
                        </Text>
                        <Text fontSize={10} color="#34d399" fontWeight="700">
                          Meta {cut.target} ✓
                        </Text>
                      </XStack>

                      {/* Progress Bar */}
                      <View
                        height={4}
                        backgroundColor={colors.borderSoft}
                        borderRadius={2}
                        marginTop={8}
                        overflow="hidden"
                      >
                        <View
                          height="100%"
                          width={`${Math.min(100, (cut.count / cut.target) * 100)}%`}
                          backgroundColor={cut.color}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </XStack>

              {/* Throughput Chart */}
              <View
                backgroundColor={colors.card}
                borderRadius={14}
                borderWidth={1}
                borderColor={colors.borderSoft}
                padding={16}
              >
                <XStack justifyContent="space-between" alignItems="center" marginBottom={12}>
                  <YStack gap={2}>
                    <Text fontSize={13} fontWeight="800" color={colors.text}>
                      Ritmo Horario de Desposte en Cinta (06:00 – 14:00)
                    </Text>
                    <Text fontSize={11} color={colors.textSec}>
                      Cortes individuales contabilizados por hora vs. meta de rendimiento de planta
                    </Text>
                  </YStack>
                  <View
                    backgroundColor="rgba(33, 152, 244, 0.12)"
                    paddingHorizontal={8}
                    paddingVertical={4}
                    borderRadius={6}
                  >
                    <Text fontSize={11} fontWeight="700" color="#38bdf8" fontFamily="$mono">
                      Pico: 110 pzas/h (10:00)
                    </Text>
                  </View>
                </XStack>

                <SvgBarChart
                  data={HOURLY_DESPOSTE.map((h) => ({
                    hour: h.hour,
                    produced: h.produced,
                  }))}
                  xKey="hour"
                  yKey="produced"
                  color="#0A4CE8"
                  height={180}
                  labelColor={colors.textLabel}
                  gridColor={colors.borderSoft}
                />
              </View>
            </YStack>
          )}

          {/* SECTION 2: AUDITORÍA DE EPP E INOCUIDAD */}
          {(activeTab === "all" || activeTab === "epp") && (
            <YStack gap={14}>
              <XStack justifyContent="space-between" alignItems="center">
                <XStack alignItems="center" gap={8}>
                  <ShieldCheck size={18} color="#10b981" />
                  <Text fontSize={14} fontWeight="800" color={colors.text} fontFamily="$body">
                    AUDITORÍA CONTINUA DE EPP E INOCUIDAD (SALA FRIGORÍFICA)
                  </Text>
                </XStack>
                <Text fontSize={11} color="#34d399" fontWeight="700">
                  Cumplimiento Global: 97.4%
                </Text>
              </XStack>

              {/* 4 EPP Pillars Cards */}
              <XStack flexWrap="wrap" gap={12}>
                <View
                  flex={1}
                  minWidth={160}
                  backgroundColor={colors.card}
                  borderRadius={12}
                  borderWidth={1}
                  borderColor={colors.borderSoft}
                  padding={14}
                  gap={4}
                >
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize={11} color={colors.textLabel} fontWeight="700">
                      GUANTE DE MALLA
                    </Text>
                    <Shield size={16} color="#10b981" />
                  </XStack>
                  <Text fontSize={22} fontWeight="900" color="#10b981" fontFamily="$mono">
                    98.6%
                  </Text>
                  <Text fontSize={10.5} color={colors.textSec}>
                    Anticorte · Obligatorio con cuchillo activo
                  </Text>
                </View>

                <View
                  flex={1}
                  minWidth={160}
                  backgroundColor={colors.card}
                  borderRadius={12}
                  borderWidth={1}
                  borderColor={colors.borderSoft}
                  padding={14}
                  gap={4}
                >
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize={11} color={colors.textLabel} fontWeight="700">
                      BARBIJO SANITARIO
                    </Text>
                    <ShieldCheck size={16} color="#2198f4" />
                  </XStack>
                  <Text fontSize={22} fontWeight="900" color="#2198f4" fontFamily="$mono">
                    96.2%
                  </Text>
                  <Text fontSize={10.5} color={colors.textSec}>
                    Inocuidad alimentaria en sala fría
                  </Text>
                </View>

                <View
                  flex={1}
                  minWidth={160}
                  backgroundColor={colors.card}
                  borderRadius={12}
                  borderWidth={1}
                  borderColor={colors.borderSoft}
                  padding={14}
                  gap={4}
                >
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize={11} color={colors.textLabel} fontWeight="700">
                      COFIA / CAPUCHA
                    </Text>
                    <Shield size={16} color="#8b5cf6" />
                  </XStack>
                  <Text fontSize={22} fontWeight="900" color="#8b5cf6" fontFamily="$mono">
                    99.1%
                  </Text>
                  <Text fontSize={10.5} color={colors.textSec}>
                    Contención capilar en desposte
                  </Text>
                </View>

                <View
                  flex={1}
                  minWidth={160}
                  backgroundColor={colors.card}
                  borderRadius={12}
                  borderWidth={1}
                  borderColor={colors.borderSoft}
                  padding={14}
                  gap={4}
                >
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize={11} color={colors.textLabel} fontWeight="700">
                      MANDIL CON CÓDIGO ID
                    </Text>
                    <UserCheck size={16} color="#34d399" />
                  </XStack>
                  <Text fontSize={22} fontWeight="900" color="#34d399" fontFamily="$mono">
                    100.0%
                  </Text>
                  <Text fontSize={10.5} color={colors.textSec}>
                    Trazabilidad de operario por puesto
                  </Text>
                </View>
              </XStack>
            </YStack>
          )}

          {/* SECTION 3: OPERARIOS & PUESTOS DE TRABAJO */}
          {(activeTab === "all" || activeTab === "workers") && (
            <View
              backgroundColor={colors.card}
              borderRadius={14}
              borderWidth={1}
              borderColor={colors.borderSoft}
              padding={16}
            >
              <XStack justifyContent="space-between" alignItems="center" marginBottom={12}>
                <YStack gap={2}>
                  <Text fontSize={13} fontWeight="800" color={colors.text}>
                    Desempeño y Cumplimiento EPP por Operario (Códigos en Mandil)
                  </Text>
                  <Text fontSize={11} color={colors.textSec}>
                    Identificación no invasiva mediante código numérico de alto contraste en
                    mandiles y cascos
                  </Text>
                </YStack>
                <View
                  backgroundColor="rgba(16, 185, 129, 0.12)"
                  paddingHorizontal={8}
                  paddingVertical={4}
                  borderRadius={6}
                >
                  <Text fontSize={10} fontWeight="700" color="#34d399">
                    8 OPERARIOS REGISTRADOS
                  </Text>
                </View>
              </XStack>

              <YStack gap={8}>
                {EPP_WORKERS.map((w) => (
                  <XStack
                    key={w.id}
                    backgroundColor={colors.bg}
                    borderRadius={10}
                    borderWidth={1}
                    borderColor={
                      w.status === "warning" ? "rgba(245, 158, 11, 0.3)" : colors.borderSoft
                    }
                    padding={12}
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={8}
                  >
                    <XStack alignItems="center" gap={10}>
                      <View
                        width={32}
                        height={32}
                        borderRadius={6}
                        backgroundColor="rgba(10, 76, 232, 0.15)"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text fontSize={12} fontWeight="800" color="#38bdf8" fontFamily="$mono">
                          {w.id.replace("OP-", "#")}
                        </Text>
                      </View>
                      <YStack>
                        <Text fontSize={12} fontWeight="700" color={colors.text}>
                          {w.name}
                        </Text>
                        <Text fontSize={10.5} color={colors.textSec}>
                          {w.position} · {w.piecesCut} cortes realizados
                        </Text>
                      </YStack>
                    </XStack>

                    <XStack alignItems="center" gap={16}>
                      <YStack alignItems="center">
                        <Text fontSize={9.5} color={colors.textLabel}>
                          Malla Acero
                        </Text>
                        <Text
                          fontSize={12}
                          fontWeight="800"
                          fontFamily="$mono"
                          color={w.meshGlove < 96 ? "#f59e0b" : "#10b981"}
                        >
                          {w.meshGlove}%
                        </Text>
                      </YStack>

                      <YStack alignItems="center">
                        <Text fontSize={9.5} color={colors.textLabel}>
                          Barbijo
                        </Text>
                        <Text
                          fontSize={12}
                          fontWeight="800"
                          fontFamily="$mono"
                          color={w.mask < 95 ? "#f59e0b" : "#38bdf8"}
                        >
                          {w.mask}%
                        </Text>
                      </YStack>

                      <YStack alignItems="center">
                        <Text fontSize={9.5} color={colors.textLabel}>
                          Cofia
                        </Text>
                        <Text fontSize={12} fontWeight="800" fontFamily="$mono" color="#a78bfa">
                          {w.cap}%
                        </Text>
                      </YStack>

                      <View
                        backgroundColor={
                          w.status === "warning"
                            ? "rgba(245, 158, 11, 0.15)"
                            : "rgba(16, 185, 129, 0.15)"
                        }
                        paddingHorizontal={8}
                        paddingVertical={3}
                        borderRadius={4}
                      >
                        <Text
                          fontSize={9.5}
                          fontWeight="700"
                          color={w.status === "warning" ? "#fbbf24" : "#34d399"}
                        >
                          {w.status === "warning" ? "Revisión" : "Conforme"}
                        </Text>
                      </View>
                    </XStack>
                  </XStack>
                ))}
              </YStack>
            </View>
          )}

          {/* SECTION 4: PARADAS DE CINTA & BITÁCORA EN VIVO */}
          {(activeTab === "all" || activeTab === "downtime") && (
            <XStack gap={14} flexDirection={isDesktop ? "row" : "column"} alignItems="stretch">
              {/* Downtime log */}
              <View
                flex={1}
                backgroundColor={colors.card}
                borderRadius={14}
                borderWidth={1}
                borderColor={colors.borderSoft}
                padding={16}
                gap={12}
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <XStack alignItems="center" gap={8}>
                    <Clock size={16} color="#fbbf24" />
                    <Text fontSize={13} fontWeight="800" color={colors.text}>
                      Bitácora de Paradas de Cinta (OEE)
                    </Text>
                  </XStack>
                  <Text fontSize={11} color={colors.textSec}>
                    18 min totales
                  </Text>
                </XStack>

                <YStack gap={10}>
                  {DOWNTIME_LOG.map((dt) => (
                    <View
                      key={dt.id}
                      backgroundColor={colors.bg}
                      borderRadius={8}
                      borderLeftWidth={3}
                      borderLeftColor={dt.color}
                      padding={10}
                      gap={4}
                    >
                      <XStack justifyContent="space-between" alignItems="center">
                        <Text fontSize={11.5} fontWeight="700" color={colors.text}>
                          {dt.type}
                        </Text>
                        <Text fontSize={11} fontWeight="800" color={dt.color} fontFamily="$mono">
                          {dt.durationMinutes} min ({dt.time})
                        </Text>
                      </XStack>
                      <Text fontSize={10.5} color={colors.textSec} lineHeight={14}>
                        {dt.reason}
                      </Text>
                    </View>
                  ))}
                </YStack>
              </View>

              {/* Live Alerts Feed */}
              <View
                flex={1}
                backgroundColor={colors.card}
                borderRadius={14}
                borderWidth={1}
                borderColor={colors.borderSoft}
                padding={16}
                gap={12}
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <XStack alignItems="center" gap={8}>
                    <Bell size={16} color="#38bdf8" />
                    <Text fontSize={13} fontWeight="800" color={colors.text}>
                      Feed de Alertas e Incidentes en Vivo
                    </Text>
                  </XStack>
                  <View
                    backgroundColor="rgba(56, 189, 248, 0.12)"
                    paddingHorizontal={6}
                    paddingVertical={2}
                    borderRadius={4}
                  >
                    <Text fontSize={9} fontWeight="700" color="#38bdf8">
                      TELEMETRÍA
                    </Text>
                  </View>
                </XStack>

                <YStack gap={8}>
                  {RECENT_ALERTS.map((alt) => (
                    <View
                      key={alt.id}
                      backgroundColor={colors.bg}
                      borderRadius={8}
                      padding={10}
                      borderWidth={1}
                      borderColor={colors.borderSoft}
                      gap={3}
                    >
                      <XStack justifyContent="space-between" alignItems="center">
                        <XStack alignItems="center" gap={6}>
                          <View width={6} height={6} borderRadius={3} backgroundColor={alt.color} />
                          <Text fontSize={11} fontWeight="700" color={colors.text}>
                            {alt.title}
                          </Text>
                        </XStack>
                        <Text fontSize={10} color={colors.textLabel} fontFamily="$mono">
                          {alt.time}
                        </Text>
                      </XStack>
                      <Text fontSize={10.5} color={colors.textSec} lineHeight={14}>
                        {alt.desc}
                      </Text>
                    </View>
                  ))}
                </YStack>
              </View>
            </XStack>
          )}
        </ScrollView>
      </View>
    </PageContainer>
  );
}
