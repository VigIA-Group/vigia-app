import { getIndustryById } from "@/src/data/industries";
import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { useColors } from "@/src/hooks/use-colors";
import { useLocalSearchParams } from "expo-router";
import {
  AlertTriangle,
  Car,
  CheckCircle2,
  Lock,
  ScanLine,
  Shield,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react-native";
import React from "react";
import { ScrollView } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";

export default function IndustrySecurityScreen() {
  const { industry } = useLocalSearchParams<{ industry: string }>();
  const colors = useColors();
  const { isDesktop } = useBreakpoint();

  const ind = industry ? getIndustryById(industry) : undefined;
  if (!ind) return null;

  const sec = ind.security;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        padding: isDesktop ? 28 : 14,
        paddingBottom: 90,
        gap: 20,
      }}
    >
      {/* HEADER EXPLANATION */}
      <YStack gap={6}>
        <XStack alignItems="center" gap={8}>
          <ShieldCheck size={20} color="#10b981" />
          <Text fontSize={20} fontWeight="800" color={colors.text} fontFamily="$body">
            VERTICAL D: SEGURIDAD VISUAL & ACCESOS
          </Text>
        </XStack>
        <Text fontSize={12.5} color={colors.textSec} fontFamily="$body" lineHeight={18}>
          Supervisión de zonas restringidas, cruce de líneas virtuales perimetrales, movimiento
          fuera de horario e inspección de equipo de protección personal en {ind.name}.
        </Text>
      </YStack>

      {/* SECURITY KPIS */}
      <XStack flexWrap="wrap" gap={12}>
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
          <Text fontSize={11} color={colors.textLabel} fontWeight="600">
            Zonas Delimitadas
          </Text>
          <Text fontSize={24} fontWeight="800" color={colors.text} fontFamily="$mono">
            {sec.activeZones}
          </Text>
          <Text fontSize={10.5} color="#34d399" fontWeight="700">
            Todas operativas
          </Text>
        </View>

        <View
          flex={1}
          minWidth={150}
          backgroundColor={colors.card}
          borderRadius={12}
          borderWidth={1}
          borderColor={colors.borderSoft}
          borderTopWidth={3}
          borderTopColor={sec.perimeterEventsToday > 0 ? "#f59e0b" : "#10b981"}
          padding={14}
          gap={6}
        >
          <Text fontSize={11} color={colors.textLabel} fontWeight="600">
            Eventos Perimetrales Hoy
          </Text>
          <Text
            fontSize={24}
            fontWeight="800"
            color={sec.perimeterEventsToday > 0 ? "#fbbf24" : "#34d399"}
            fontFamily="$mono"
          >
            {sec.perimeterEventsToday}
          </Text>
          <Text fontSize={10.5} color={colors.textSec}>
            {sec.perimeterEventsToday === 0 ? "Perímetro seguro" : "Atendido por guardia"}
          </Text>
        </View>

        {sec.anprOrAccess && (
          <View
            flex={1}
            minWidth={150}
            backgroundColor={colors.card}
            borderRadius={12}
            borderWidth={1}
            borderColor={colors.borderSoft}
            borderTopWidth={3}
            borderTopColor="#2198F4"
            padding={14}
            gap={6}
          >
            <Text fontSize={11} color={colors.textLabel} fontWeight="600">
              Control ANPR / Accesos
            </Text>
            <Text fontSize={24} fontWeight="800" color="#38bdf8" fontFamily="$mono">
              {sec.anprOrAccess.platesOrBadgesScanned}
            </Text>
            <Text fontSize={10.5} color={colors.textSec}>
              Ingreso promedio: {sec.anprOrAccess.avgEntrySeconds}s
            </Text>
          </View>
        )}
      </XStack>

      {/* RESTRICTED ZONES & ALERTS */}
      <XStack gap={16} flexDirection={isDesktop ? "row" : "column"} alignItems="stretch">
        {/* Restricted Zones */}
        <View
          flex={1}
          backgroundColor={colors.card}
          borderRadius={14}
          borderWidth={1}
          borderColor={colors.borderSoft}
          padding={16}
          gap={12}
        >
          <XStack alignItems="center" gap={8}>
            <Lock size={16} color="#0A4CE8" />
            <Text fontSize={13} fontWeight="800" color={colors.text} fontFamily="$body">
              Polígonos & Zonas Restringidas Configuradas
            </Text>
          </XStack>

          <YStack gap={8}>
            {sec.restrictedZones.map((rz) => (
              <View
                key={rz.zone}
                backgroundColor={colors.bg}
                borderRadius={8}
                padding={12}
                borderWidth={1}
                borderColor={colors.borderSoft}
                gap={4}
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <Text fontSize={12} fontWeight="700" color={colors.text}>
                    {rz.zone}
                  </Text>
                  <View
                    backgroundColor={
                      rz.riskLevel === "Alto"
                        ? "rgba(248, 113, 113, 0.12)"
                        : "rgba(33, 152, 244, 0.12)"
                    }
                    paddingHorizontal={6}
                    paddingVertical={2}
                    borderRadius={4}
                  >
                    <Text
                      fontSize={9.5}
                      fontWeight="700"
                      color={rz.riskLevel === "Alto" ? "#f87171" : "#38bdf8"}
                    >
                      Riesgo {rz.riskLevel}
                    </Text>
                  </View>
                </XStack>
                <Text fontSize={11} color={colors.textSec}>
                  Horario de activación: {rz.schedule} · Incidentes hoy: {rz.incidentsToday}
                </Text>
              </View>
            ))}
          </YStack>
        </View>

        {/* Security Alerts Log */}
        <View
          flex={1}
          backgroundColor={colors.card}
          borderRadius={14}
          borderWidth={1}
          borderColor={colors.borderSoft}
          padding={16}
          gap={12}
        >
          <XStack alignItems="center" gap={8}>
            <ShieldAlert size={16} color="#f59e0b" />
            <Text fontSize={13} fontWeight="800" color={colors.text} fontFamily="$body">
              Eventos de Seguridad Visual Registrados
            </Text>
          </XStack>

          {sec.securityAlerts.length === 0 ? (
            <YStack
              backgroundColor={colors.bg}
              borderRadius={8}
              padding={20}
              alignItems="center"
              justifyContent="center"
              gap={6}
            >
              <CheckCircle2 size={24} color="#34d399" />
              <Text fontSize={12} fontWeight="700" color={colors.text}>
                Sin incidentes de seguridad registrados hoy
              </Text>
              <Text fontSize={11} color={colors.textLabel} textAlign="center">
                Todos los perímetros y áreas restringidas se mantienen estables.
              </Text>
            </YStack>
          ) : (
            <YStack gap={8}>
              {sec.securityAlerts.map((sa, idx) => (
                <View
                  key={idx}
                  backgroundColor={colors.bg}
                  borderRadius={8}
                  padding={12}
                  borderLeftWidth={3}
                  borderLeftColor={sa.severity === "ALTA" ? "#f87171" : "#f59e0b"}
                  borderWidth={1}
                  borderColor={colors.borderSoft}
                  gap={4}
                >
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize={12} fontWeight="700" color={colors.text}>
                      {sa.zone}
                    </Text>
                    <Text fontSize={10} color={colors.textLabel} fontFamily="$mono">
                      {sa.time}
                    </Text>
                  </XStack>
                  <Text fontSize={11} color={colors.textSec}>
                    {sa.event}
                  </Text>
                  <Text fontSize={10} fontWeight="700" color="#34d399">
                    Estado: {sa.status}
                  </Text>
                </View>
              ))}
            </YStack>
          )}
        </View>
      </XStack>
    </ScrollView>
  );
}
