import { SvgBarChart } from "@/src/components/charts/svg-bar-chart";
import { getIndustryById } from "@/src/data/industries";
import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { useColors } from "@/src/hooks/use-colors";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Beef,
  Bell,
  Boxes,
  Camera,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  Flame,
  Layers,
  LucideIcon,
  PackageCheck,
  ScanLine,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Truck,
  Users,
  Utensils,
} from "lucide-react-native";
import React from "react";
import { Platform, ScrollView, TouchableOpacity } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";

const ICON_MAP: Record<string, LucideIcon> = {
  Utensils,
  TrendingUp,
  Timer: Clock,
  Clock,
  Users,
  AlertTriangle,
  PackageCheck,
  Boxes,
  CheckCircle2,
  Beef,
  ScanLine,
  Truck,
  Activity,
  ShieldCheck,
  ShieldAlert,
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
}

export default function IndustryHomeScreen() {
  const { industry } = useLocalSearchParams<{ industry: string }>();
  const colors = useColors();
  const { isDesktop, isWide } = useBreakpoint();

  const ind = industry ? getIndustryById(industry) : undefined;
  if (!ind) return null;

  const totalCutsOrUnits = ind.production.totalProduced;
  const targetUnits = ind.production.productionTarget;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        padding: isDesktop ? 28 : 14,
        paddingBottom: 90,
        gap: 20,
      }}
    >
      {/* GREETING & CONTEXT HEADER */}
      <XStack justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={12}>
        <YStack gap={4}>
          <XStack alignItems="center" gap={8}>
            <Text
              fontSize={isDesktop ? 26 : 22}
              fontWeight="800"
              color={colors.text}
              fontFamily="$body"
            >
              {getGreeting()},{" "}
              <Text
                fontSize={isDesktop ? 26 : 22}
                fontWeight="800"
                color={ind.accentColor}
                fontFamily="$body"
              >
                {ind.assignedUser.name}
              </Text>
            </Text>
            <View
              backgroundColor="rgba(33, 152, 244, 0.12)"
              borderWidth={1}
              borderColor="rgba(33, 152, 244, 0.3)"
              paddingHorizontal={8}
              paddingVertical={2}
              borderRadius={6}
            >
              <Text fontSize={9.5} fontWeight="700" color="#38bdf8" fontFamily="$mono">
                {ind.assignedUser.role}
              </Text>
            </View>
          </XStack>

          <Text fontSize={12} color={colors.textSec} fontFamily="$body">
            {ind.assignedUser.organization} · {ind.assignedUser.location}
          </Text>
        </YStack>

        {/* Simulation Disclaimer Badge */}
        <XStack
          backgroundColor="rgba(255, 255, 255, 0.05)"
          borderWidth={1}
          borderColor={colors.borderSoft}
          paddingHorizontal={10}
          paddingVertical={6}
          borderRadius={8}
          alignItems="center"
          gap={6}
        >
          <View width={6} height={6} borderRadius={3} backgroundColor="#34d399" />
          <Text fontSize={10.5} fontWeight="600" color={colors.textLabel} fontFamily="$mono">
            DATOS SIMULADOS · MODELO IA ENTRENADO
          </Text>
        </XStack>
      </XStack>

      {/* SPECIAL BANNER FOR DESPOSTE PORCINO */}
      {ind.id === "desposte-porcino" && (
        <View
          backgroundColor="rgba(239, 68, 68, 0.1)"
          borderWidth={1.5}
          borderColor="rgba(239, 68, 68, 0.35)"
          borderRadius={14}
          padding={16}
        >
          <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={12}>
            <XStack gap={12} alignItems="center" flex={1} minWidth={240}>
              <View
                width={42}
                height={42}
                borderRadius={10}
                backgroundColor="rgba(239, 68, 68, 0.2)"
                alignItems="center"
                justifyContent="center"
              >
                <Beef size={22} color="#f87171" />
              </View>
              <YStack gap={2} flex={1}>
                <Text fontSize={14} fontWeight="800" color={colors.text} fontFamily="$body">
                  Sala de Despiece & Clasificación Cárnica PorkNet v2.4
                </Text>
                <Text fontSize={11.5} color={colors.textSec} fontFamily="$body">
                  Conteo en tiempo real de jamones, costillares, lomos y paletas. Balance 71/71
                  cerdos y auditoría de guante de malla anticorte.
                </Text>
              </YStack>
            </XStack>

            <XStack gap={10} alignItems="center">
              {Platform.OS === "web" && (
                <TouchableOpacity
                  onPress={() => {
                    if (typeof window !== "undefined") {
                      window.open("/cotizaciones/demo_desposte_cerdos.html", "_blank");
                    }
                  }}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    borderWidth: 1,
                    borderColor: "rgba(255, 255, 255, 0.15)",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Eye size={14} color="#ffffff" />
                  <Text fontSize={11} fontWeight="700" color="#ffffff">
                    Simulador en Vivo
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => router.push("/desposte" as any)}
                style={{
                  backgroundColor: "#ef4444",
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Text fontSize={11} fontWeight="700" color="#ffffff">
                  Vista Especializada Frigorífico
                </Text>
                <ArrowRight size={14} color="#ffffff" />
              </TouchableOpacity>
            </XStack>
          </XStack>
        </View>
      )}

      {/* TOP KPI CARDS */}
      <XStack flexWrap="wrap" gap={12}>
        {ind.kpis.map((kpi, idx) => {
          const IconComp = ICON_MAP[kpi.icon] ?? TrendingUp;
          return (
            <View
              key={kpi.id}
              flex={1}
              minWidth={155}
              backgroundColor={colors.card}
              borderRadius={12}
              borderWidth={1}
              borderColor={colors.borderSoft}
              borderTopWidth={3}
              borderTopColor={kpi.accentColor}
              padding={14}
              gap={6}
            >
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize={11} color={colors.textLabel} fontWeight="600" numberOfLines={1}>
                  {kpi.label}
                </Text>
                <IconComp size={15} color={kpi.accentColor} />
              </XStack>

              <Text fontSize={22} fontWeight="800" color={colors.text} fontFamily="$mono">
                {kpi.value}
              </Text>

              <XStack justifyContent="space-between" alignItems="center">
                <Text
                  fontSize={10.5}
                  color={kpi.changePositive ? "#34d399" : "#f87171"}
                  fontWeight="700"
                  fontFamily="$mono"
                >
                  {kpi.change}
                </Text>
                <Text fontSize={9.5} color={colors.textLabel} numberOfLines={1}>
                  {kpi.period}
                </Text>
              </XStack>
            </View>
          );
        })}
      </XStack>

      {/* 4 PRODUCT VERTICALS SHORTCUTS */}
      <YStack gap={10}>
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize={14} fontWeight="800" color={colors.text} fontFamily="$body">
            LAS 4 VERTICALES DE VIGIA EN ESTE SECTOR
          </Text>
          <Text fontSize={11} color={colors.textLabel}>
            Haz clic para profundizar en cada vertical
          </Text>
        </XStack>

        <XStack flexWrap="wrap" gap={12}>
          {/* Vertical A: Producción */}
          <TouchableOpacity
            onPress={() => router.push(`/${ind.id}/produccion` as any)}
            style={{
              flex: 1,
              minWidth: isDesktop ? 220 : "47%",
              backgroundColor: colors.card,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.borderSoft,
              padding: 14,
              gap: 8,
            }}
          >
            <XStack justifyContent="space-between" alignItems="center">
              <View
                width={32}
                height={32}
                borderRadius={8}
                backgroundColor={ind.accentColor + "18"}
                alignItems="center"
                justifyContent="center"
              >
                <TrendingUp size={16} color={ind.accentColor} />
              </View>
              <ArrowRight size={14} color={colors.textLabel} />
            </XStack>
            <YStack gap={2}>
              <Text fontSize={12.5} fontWeight="800" color={colors.text} fontFamily="$body">
                A. Producción & Flujo
              </Text>
              <Text fontSize={11} color={colors.textSec} fontFamily="$body" numberOfLines={2}>
                {ind.production.unitName}: {totalCutsOrUnits} vs meta {targetUnits}
              </Text>
            </YStack>
          </TouchableOpacity>

          {/* Vertical B: Operaciones */}
          <TouchableOpacity
            onPress={() => router.push(`/${ind.id}/operaciones` as any)}
            style={{
              flex: 1,
              minWidth: isDesktop ? 220 : "47%",
              backgroundColor: colors.card,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.borderSoft,
              padding: 14,
              gap: 8,
            }}
          >
            <XStack justifyContent="space-between" alignItems="center">
              <View
                width={32}
                height={32}
                borderRadius={8}
                backgroundColor="rgba(245, 158, 11, 0.15)"
                alignItems="center"
                justifyContent="center"
              >
                <Clock size={16} color="#f59e0b" />
              </View>
              <ArrowRight size={14} color={colors.textLabel} />
            </XStack>
            <YStack gap={2}>
              <Text fontSize={12.5} fontWeight="800" color={colors.text} fontFamily="$body">
                B. Operaciones & Procesos
              </Text>
              <Text fontSize={11} color={colors.textSec} fontFamily="$body" numberOfLines={2}>
                Permanencia en zonas, cuellos de botella y bitácora de paradas
              </Text>
            </YStack>
          </TouchableOpacity>

          {/* Vertical C: Personas */}
          <TouchableOpacity
            onPress={() => router.push(`/${ind.id}/personas` as any)}
            style={{
              flex: 1,
              minWidth: isDesktop ? 220 : "47%",
              backgroundColor: colors.card,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.borderSoft,
              padding: 14,
              gap: 8,
            }}
          >
            <XStack justifyContent="space-between" alignItems="center">
              <View
                width={32}
                height={32}
                borderRadius={8}
                backgroundColor="rgba(33, 152, 244, 0.15)"
                alignItems="center"
                justifyContent="center"
              >
                <Users size={16} color="#2198F4" />
              </View>
              <ArrowRight size={14} color={colors.textLabel} />
            </XStack>
            <YStack gap={2}>
              <Text fontSize={12.5} fontWeight="800" color={colors.text} fontFamily="$body">
                C. Personas & Experiencia
              </Text>
              <Text fontSize={11} color={colors.textSec} fontFamily="$body" numberOfLines={2}>
                Aforo actual: {ind.people.trafficToday.currentOccupancy} · Pico:{" "}
                {ind.people.trafficToday.peakHour}
              </Text>
            </YStack>
          </TouchableOpacity>

          {/* Vertical D: Seguridad */}
          <TouchableOpacity
            onPress={() => router.push(`/${ind.id}/seguridad` as any)}
            style={{
              flex: 1,
              minWidth: isDesktop ? 220 : "47%",
              backgroundColor: colors.card,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.borderSoft,
              padding: 14,
              gap: 8,
            }}
          >
            <XStack justifyContent="space-between" alignItems="center">
              <View
                width={32}
                height={32}
                borderRadius={8}
                backgroundColor="rgba(16, 185, 129, 0.15)"
                alignItems="center"
                justifyContent="center"
              >
                <ShieldCheck size={16} color="#10b981" />
              </View>
              <ArrowRight size={14} color={colors.textLabel} />
            </XStack>
            <YStack gap={2}>
              <Text fontSize={12.5} fontWeight="800" color={colors.text} fontFamily="$body">
                D. Seguridad & EPP
              </Text>
              <Text fontSize={11} color={colors.textSec} fontFamily="$body" numberOfLines={2}>
                {ind.security.restrictedZones.length} zonas delimitadas · 0 eventos críticos
              </Text>
            </YStack>
          </TouchableOpacity>
        </XStack>
      </YStack>

      {/* TWO COLUMNS ON DESKTOP: PRODUCTION CHART & RECENT ALERTS */}
      <XStack gap={16} flexDirection={isDesktop ? "row" : "column"} alignItems="stretch">
        {/* Left: Production Hourly Bar Chart */}
        <View
          flex={3}
          backgroundColor={colors.card}
          borderRadius={14}
          borderWidth={1}
          borderColor={colors.borderSoft}
          padding={16}
          gap={12}
        >
          <XStack justifyContent="space-between" alignItems="center">
            <YStack gap={2}>
              <Text fontSize={13} fontWeight="800" color={colors.text} fontFamily="$body">
                Ritmo Horario de Producción / Flujo
              </Text>
              <Text fontSize={11} color={colors.textSec}>
                {ind.production.unitName} contabilizadas por intervalo
              </Text>
            </YStack>
            <TouchableOpacity onPress={() => router.push(`/${ind.id}/produccion` as any)}>
              <Text fontSize={11} fontWeight="700" color={ind.accentColor}>
                Ver Detalle ›
              </Text>
            </TouchableOpacity>
          </XStack>

          <SvgBarChart
            data={ind.production.hourlyProduction.map((h) => ({
              hour: h.hour,
              produced: h.produced,
            }))}
            xKey="hour"
            yKey="produced"
            color={ind.accentColor}
            height={160}
            labelColor={colors.textLabel}
            gridColor={colors.borderSoft}
          />
        </View>

        {/* Right: Recent Alerts Feed */}
        <View
          flex={2}
          backgroundColor={colors.card}
          borderRadius={14}
          borderWidth={1}
          borderColor={colors.borderSoft}
          padding={16}
          gap={12}
        >
          <XStack justifyContent="space-between" alignItems="center">
            <XStack alignItems="center" gap={8}>
              <Bell size={16} color={ind.accentColor} />
              <Text fontSize={13} fontWeight="800" color={colors.text} fontFamily="$body">
                Alertas Recientes ({ind.alerts.length})
              </Text>
            </XStack>
            <TouchableOpacity onPress={() => router.push(`/${ind.id}/alerts` as any)}>
              <Text fontSize={11} fontWeight="700" color={ind.accentColor}>
                Ver todas ›
              </Text>
            </TouchableOpacity>
          </XStack>

          <YStack gap={8}>
            {ind.alerts.slice(0, 3).map((alt) => (
              <TouchableOpacity
                key={alt.id}
                onPress={() => router.push(`/${ind.id}/alerts/${alt.id}` as any)}
                style={{
                  backgroundColor: colors.bg,
                  borderRadius: 8,
                  padding: 10,
                  borderWidth: 1,
                  borderColor: colors.borderSoft,
                  gap: 4,
                }}
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <XStack alignItems="center" gap={6}>
                    <View
                      width={6}
                      height={6}
                      borderRadius={3}
                      backgroundColor={
                        alt.severity === "ALTA"
                          ? "#f87171"
                          : alt.severity === "MEDIA"
                            ? "#f59e0b"
                            : "#38bdf8"
                      }
                    />
                    <Text fontSize={11.5} fontWeight="700" color={colors.text} numberOfLines={1}>
                      {alt.title}
                    </Text>
                  </XStack>
                  <Text fontSize={10} color={colors.textLabel} fontFamily="$mono">
                    {alt.timestamp}
                  </Text>
                </XStack>
                <Text fontSize={10.5} color={colors.textSec} numberOfLines={2}>
                  {alt.desc}
                </Text>
              </TouchableOpacity>
            ))}
          </YStack>
        </View>
      </XStack>

      {/* CAMERAS SHOWCASE */}
      <YStack gap={10}>
        <XStack justifyContent="space-between" alignItems="center">
          <XStack alignItems="center" gap={8}>
            <Camera size={16} color={ind.accentColor} />
            <Text fontSize={14} fontWeight="800" color={colors.text} fontFamily="$body">
              CÁMARAS DEL SECTOR ({ind.cameras.length} ACTIVAS)
            </Text>
          </XStack>
          <TouchableOpacity onPress={() => router.push(`/${ind.id}/cameras` as any)}>
            <Text fontSize={11} fontWeight="700" color={ind.accentColor}>
              Ver todas las cámaras ›
            </Text>
          </TouchableOpacity>
        </XStack>

        <XStack flexWrap="wrap" gap={12}>
          {ind.cameras.map((cam) => (
            <TouchableOpacity
              key={cam.id}
              onPress={() => router.push(`/${ind.id}/cameras/${cam.id}` as any)}
              style={{
                flex: 1,
                minWidth: isDesktop ? 220 : "47%",
                backgroundColor: colors.card,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.borderSoft,
                padding: 12,
                gap: 8,
              }}
            >
              <XStack justifyContent="space-between" alignItems="center">
                <XStack alignItems="center" gap={6}>
                  <View
                    width={8}
                    height={8}
                    borderRadius={4}
                    backgroundColor={cam.status === "online" ? "#10b981" : "#f59e0b"}
                  />
                  <Text fontSize={10} fontWeight="700" color={colors.textLabel} fontFamily="$mono">
                    {cam.status.toUpperCase()}
                  </Text>
                </XStack>
                <Text fontSize={10} color={colors.textLabel}>
                  {cam.floor}
                </Text>
              </XStack>

              <Text fontSize={12.5} fontWeight="700" color={colors.text} numberOfLines={1}>
                {cam.name}
              </Text>

              <Text fontSize={10.5} color={colors.textSec} numberOfLines={2}>
                {cam.description}
              </Text>

              <XStack justifyContent="space-between" alignItems="center" marginTop={4}>
                <Text fontSize={10} color={colors.textLabel}>
                  {cam.room}
                </Text>
                <Text fontSize={10.5} fontWeight="700" color={ind.accentColor}>
                  Abrir feed ›
                </Text>
              </XStack>
            </TouchableOpacity>
          ))}
        </XStack>
      </YStack>

      {/* OPERATIONAL INSIGHTS */}
      {ind.insights.length > 0 && (
        <YStack
          backgroundColor={colors.card}
          borderRadius={14}
          borderWidth={1}
          borderColor={colors.borderSoft}
          padding={16}
          gap={12}
        >
          <XStack alignItems="center" gap={8}>
            <Sparkles size={16} color="#38bdf8" />
            <Text fontSize={13} fontWeight="800" color={colors.text} fontFamily="$body">
              INSIGHTS OPERATIVOS GENERADOS POR IA
            </Text>
          </XStack>

          <XStack flexWrap="wrap" gap={12}>
            {ind.insights.map((ins) => (
              <View
                key={ins.id}
                flex={1}
                minWidth={isDesktop ? 240 : "100%"}
                backgroundColor={colors.bg}
                borderRadius={10}
                padding={12}
                borderWidth={1}
                borderColor={colors.borderSoft}
                gap={6}
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize={12} fontWeight="700" color={colors.text}>
                    {ins.title}
                  </Text>
                  <Text fontSize={11} fontWeight="800" color="#34d399" fontFamily="$mono">
                    {ins.change}
                  </Text>
                </XStack>
                <Text fontSize={11} color={colors.textSec} lineHeight={15}>
                  {ins.desc}
                </Text>
                <Text fontSize={10} fontWeight="700" color="#38bdf8" marginTop={2}>
                  Acción sugerida: {ins.actionLabel}
                </Text>
              </View>
            ))}
          </XStack>
        </YStack>
      )}
    </ScrollView>
  );
}
