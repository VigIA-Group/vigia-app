import { PageContainer } from "@/src/components/page-container";
import { VigIALogoText } from "@/src/components/vigia-logo-text";
import { INDUSTRIES, IndustryConfig } from "@/src/data/industries";
import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { useColors } from "@/src/hooks/use-colors";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
    Activity,
    ArrowRight,
    Beef,
    BookOpen,
    Boxes,
    Building,
    Building2,
    Car,
    ChevronRight,
    Clock,
    Compass,
    Cpu,
    Croissant,
    Dumbbell,
    Eye,
    Factory,
    Flame,
    GraduationCap,
    HardHat,
    Hotel,
    LayoutDashboard,
    LucideIcon,
    PackageCheck,
    Pill,
    ScanLine,
    ShieldAlert,
    ShieldCheck,
    ShoppingBag,
    ShoppingCart,
    Sparkles,
    TrendingUp,
    Truck,
    Users,
    Utensils,
    UtensilsCrossed
} from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View, XStack, YStack } from "tamagui";

const ICON_MAP: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Flame,
  ShoppingBag,
  ShoppingCart,
  Croissant,
  Factory,
  Beef,
  Cpu,
  Truck,
  Car,
  Building2,
  Hotel,
  Activity,
  HardHat,
  ShieldAlert,
  ShieldCheck,
  Dumbbell,
  Pill,
  GraduationCap,
  BookOpen,
  Boxes,
  Users,
  Clock,
  PackageCheck,
  ScanLine,
  TrendingUp,
  Utensils,
};

const CATEGORIES = [
  "Todas (18)",
  "HORECA & Alimentos",
  "Retail & Comercio",
  "Industria & Obras",
  "Servicios & Espacios",
] as const;

type CategoryFilter = (typeof CATEGORIES)[number];

const UPCOMING_SECTORS = [
  { name: "Transporte & Terminales", desc: "Andenes, flujo de pasajeros y equipaje", icon: Truck },
  {
    name: "Agroindustria & Ganadería",
    desc: "Conteo de ganado y monitoreo de tolvas",
    icon: Boxes,
  },
  {
    name: "Minería & Faenas Remotas",
    desc: "Control perimetral y polvos en suspensión",
    icon: Factory,
  },
  {
    name: "Franquicias Multi-Sucursal",
    desc: "Consolidación y auditoría multi-sitio",
    icon: Building,
  },
];

export default function IndustryMenuScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { isDesktop, isWide } = useBreakpoint();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("Todas (18)");

  const filteredIndustries = INDUSTRIES.filter((ind) => {
    if (selectedCategory === "Todas (18)") return true;
    if (selectedCategory === "HORECA & Alimentos") {
      return (
        ind.id === "restaurantes" ||
        ind.id === "cocinas-profesionales" ||
        ind.id === "panaderias" ||
        ind.id === "alimentos" ||
        ind.id === "desposte-porcino"
      );
    }
    if (selectedCategory === "Retail & Comercio") {
      return (
        ind.id === "retail" ||
        ind.id === "supermercados" ||
        ind.id === "centros-comerciales" ||
        ind.id === "farmacias"
      );
    }
    if (selectedCategory === "Industria & Obras") {
      return (
        ind.id === "manufactura" ||
        ind.id === "logistica" ||
        ind.id === "construccion" ||
        ind.id === "seguridad-industrial"
      );
    }
    if (selectedCategory === "Servicios & Espacios") {
      return (
        ind.id === "estacionamientos" ||
        ind.id === "hoteles" ||
        ind.id === "clinicas" ||
        ind.id === "gimnasios" ||
        ind.id === "educacion"
      );
    }
    return true;
  });

  return (
    <PageContainer>
      <View flex={1} backgroundColor={colors.bg}>
        {/* TOP HEADER */}
        <View
          backgroundColor={colors.card}
          borderBottomWidth={1}
          borderBottomColor={colors.borderSoft}
          paddingTop={Math.max(insets.top, 14)}
          paddingBottom={16}
          paddingHorizontal={isDesktop ? 32 : 16}
        >
          <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={12}>
            <XStack alignItems="center" gap={12}>
              <VigIALogoText height={32} />
              <View
                height={20}
                width={1}
                backgroundColor={colors.borderSoft}
                display={isWide ? "flex" : "none"}
              />
              <XStack
                display={isWide ? "flex" : "none"}
                backgroundColor="rgba(10, 76, 232, 0.12)"
                borderWidth={1}
                borderColor="rgba(33, 152, 244, 0.35)"
                paddingHorizontal={10}
                paddingVertical={4}
                borderRadius={6}
                alignItems="center"
                gap={6}
              >
                <Sparkles size={13} color="#38bdf8" />
                <Text fontSize={11} fontWeight="700" color="#38bdf8" fontFamily="$mono">
                  DEMOS MULTIINDUSTRIA
                </Text>
              </XStack>
            </XStack>

            {/* Quick Access to General Demo */}
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/home" as any)}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                borderWidth: 1,
                borderColor: colors.borderSoft,
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <LayoutDashboard size={15} color="#38bdf8" />
              <Text fontSize={12} fontWeight="700" color={colors.text} fontFamily="$body">
                Ir a Demo General VigIA
              </Text>
              <ChevronRight size={14} color={colors.textLabel} />
            </TouchableOpacity>
          </XStack>
        </View>

        {/* BODY SCROLL */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: isDesktop ? 32 : 16,
            paddingBottom: 80,
            gap: 28,
          }}
        >
          {/* HERO BANNER */}
          <View
            borderRadius={20}
            overflow="hidden"
            borderWidth={1}
            borderColor="rgba(33, 152, 244, 0.3)"
          >
            <LinearGradient
              colors={["#050E1D", "#02209A", "#0A4CE8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: isDesktop ? 32 : 20 }}
            >
              <YStack gap={10} maxWidth={860}>
                <XStack alignItems="center" gap={8}>
                  <View
                    backgroundColor="rgba(33, 152, 244, 0.25)"
                    paddingHorizontal={10}
                    paddingVertical={4}
                    borderRadius={20}
                  >
                    <Text fontSize={11} fontWeight="800" color="#38bdf8" letterSpacing={1}>
                      PROPUESTA DE VALOR VIGIA
                    </Text>
                  </View>
                  <Text fontSize={11} color="rgba(255, 255, 255, 0.7)" fontFamily="$mono">
                    • 18 Sectores Comerciales en Vivo
                  </Text>
                </XStack>

                <Text
                  fontSize={isDesktop ? 28 : 22}
                  fontWeight="900"
                  color="#ffffff"
                  fontFamily="$body"
                  lineHeight={isDesktop ? 36 : 28}
                >
                  Videoanalítica con IA que aprende a detectar lo que le importa a cada cliente.
                </Text>

                <Text
                  fontSize={isDesktop ? 15 : 13}
                  color="rgba(255, 255, 255, 0.85)"
                  fontFamily="$body"
                  lineHeight={20}
                >
                  VigIA aprovecha la infraestructura de cámaras IP existente sin necesidad de nuevo
                  hardware. Selecciona el sector de tu negocio para explorar indicadores, cámaras,
                  alertas en tiempo real y reportes analíticos adaptados a tus operaciones reales.
                </Text>

                {/* Vertical Badges */}
                <XStack flexWrap="wrap" gap={8} marginTop={8}>
                  {[
                    { label: "A. Producción & Flujo", icon: TrendingUp },
                    { label: "B. Operaciones & Procesos", icon: Clock },
                    { label: "C. Personas & Experiencia", icon: Users },
                    { label: "D. Seguridad & EPP", icon: ShieldCheck },
                  ].map((v) => {
                    const Icon = v.icon;
                    return (
                      <XStack
                        key={v.label}
                        backgroundColor="rgba(0, 0, 0, 0.35)"
                        borderWidth={1}
                        borderColor="rgba(255, 255, 255, 0.15)"
                        paddingHorizontal={10}
                        paddingVertical={5}
                        borderRadius={8}
                        alignItems="center"
                        gap={6}
                      >
                        <Icon size={12} color="#38bdf8" />
                        <Text fontSize={11} fontWeight="600" color="#ffffff" fontFamily="$body">
                          {v.label}
                        </Text>
                      </XStack>
                    );
                  })}
                </XStack>
              </YStack>
            </LinearGradient>
          </View>

          {/* CATEGORY FILTER PILLS */}
          <YStack gap={12}>
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize={18} fontWeight="800" color={colors.text} fontFamily="$body">
                Selecciona una Industria
              </Text>
              <Text fontSize={12} color={colors.textLabel} fontFamily="$mono">
                {filteredIndustries.length} de {INDUSTRIES.length} industrias
              </Text>
            </XStack>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <XStack gap={8}>
                {CATEGORIES.map((cat) => {
                  const isSel = selectedCategory === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setSelectedCategory(cat)}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 10,
                        backgroundColor: isSel ? "rgba(10, 76, 232, 0.18)" : colors.card,
                        borderWidth: 1,
                        borderColor: isSel ? "#0A4CE8" : colors.borderSoft,
                      }}
                    >
                      <Text
                        fontSize={12}
                        fontWeight={isSel ? "700" : "500"}
                        color={isSel ? "#38bdf8" : colors.textLabel}
                        fontFamily="$body"
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </XStack>
            </ScrollView>
          </YStack>

          {/* INDUSTRY CARDS GRID */}
          <XStack flexWrap="wrap" gap={16}>
            {filteredIndustries.map((ind) => (
              <IndustryCard key={ind.id} industry={ind} />
            ))}
          </XStack>

          {/* UPCOMING INDUSTRIES SECTION */}
          <YStack
            backgroundColor={colors.card}
            borderRadius={16}
            borderWidth={1}
            borderColor={colors.borderSoft}
            padding={20}
            gap={14}
          >
            <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={10}>
              <YStack gap={2}>
                <XStack alignItems="center" gap={8}>
                  <Compass size={18} color="#38bdf8" />
                  <Text fontSize={15} fontWeight="800" color={colors.text} fontFamily="$body">
                    Próximas Industrias en Preparación
                  </Text>
                </XStack>
                <Text fontSize={12} color={colors.textSec} fontFamily="$body">
                  La arquitectura extensible de VigIA permite entrenar modelos para cualquier
                  proceso observable.
                </Text>
              </YStack>
              <View
                backgroundColor="rgba(56, 189, 248, 0.1)"
                paddingHorizontal={8}
                paddingVertical={4}
                borderRadius={6}
              >
                <Text fontSize={10} fontWeight="700" color="#38bdf8" fontFamily="$mono">
                  ROADMAP 2026
                </Text>
              </View>
            </XStack>

            <XStack flexWrap="wrap" gap={10}>
              {UPCOMING_SECTORS.map((sec) => {
                const Icon = sec.icon;
                return (
                  <View
                    key={sec.name}
                    flex={1}
                    minWidth={isDesktop ? 220 : "47%"}
                    backgroundColor={colors.bg}
                    borderRadius={10}
                    borderWidth={1}
                    borderColor={colors.borderSoft}
                    padding={12}
                    gap={4}
                  >
                    <XStack alignItems="center" gap={8}>
                      <Icon size={14} color="#60a5fa" />
                      <Text fontSize={12} fontWeight="700" color={colors.text} fontFamily="$body">
                        {sec.name}
                      </Text>
                    </XStack>
                    <Text
                      fontSize={10.5}
                      color={colors.textLabel}
                      fontFamily="$body"
                      numberOfLines={2}
                    >
                      {sec.desc}
                    </Text>
                  </View>
                );
              })}
            </XStack>
          </YStack>

          {/* SIMULATION DISCLAIMER */}
          <View
            backgroundColor="rgba(255, 255, 255, 0.03)"
            borderRadius={12}
            borderWidth={1}
            borderColor={colors.borderSoft}
            padding={16}
          >
            <Text
              fontSize={11}
              color={colors.textLabel}
              fontFamily="$body"
              textAlign="center"
              lineHeight={16}
            >
              Aviso legal de demostración: Todos los nombres comerciales, métricas de producción,
              placas vehiculares y registros de personal presentados en este entorno son datos
              simulados con fines de presentación técnica y comercial de VigIA. Ningún dato proviene
              de clientes reales ni implica certificación sanitaria o diagnósticos médicos.
            </Text>
          </View>
        </ScrollView>
      </View>
    </PageContainer>
  );
}

function IndustryCard({ industry }: { industry: IndustryConfig }) {
  const colors = useColors();
  const { isDesktop } = useBreakpoint();
  const IconComponent = ICON_MAP[industry.iconName] ?? Factory;

  const handleOpenDemo = () => {
    router.push(`/${industry.id}/home` as any);
  };

  return (
    <View
      flex={1}
      minWidth={isDesktop ? 340 : "100%"}
      maxWidth={isDesktop ? "49%" : "100%"}
      backgroundColor={colors.card}
      borderRadius={16}
      borderWidth={1}
      borderColor={colors.borderSoft}
      overflow="hidden"
      gap={0}
      pressStyle={{ opacity: 0.95 }}
    >
      {/* Top Accent Strip */}
      <View height={4} backgroundColor={industry.accentColor} />

      <YStack padding={18} gap={14} flex={1} justifyContent="space-between">
        {/* Header: Icon, Badge, Name */}
        <YStack gap={10}>
          <XStack justifyContent="space-between" alignItems="flex-start">
            <XStack gap={12} alignItems="center" flex={1}>
              <View
                width={44}
                height={44}
                borderRadius={12}
                backgroundColor={industry.accentColor + "18"}
                borderWidth={1}
                borderColor={industry.accentColor + "33"}
                alignItems="center"
                justifyContent="center"
              >
                <IconComponent size={22} color={industry.accentColor} />
              </View>

              <YStack flex={1} gap={2}>
                <Text fontSize={16} fontWeight="800" color={colors.text} fontFamily="$body">
                  {industry.name}
                </Text>
                <Text fontSize={11} color={colors.textLabel} fontFamily="$mono">
                  {industry.category}
                </Text>
              </YStack>
            </XStack>

            <View
              backgroundColor="rgba(255, 255, 255, 0.06)"
              paddingHorizontal={8}
              paddingVertical={3}
              borderRadius={6}
            >
              <Text fontSize={9.5} fontWeight="700" color={industry.accentColor} fontFamily="$mono">
                {industry.cameras.length} CÁMARAS
              </Text>
            </View>
          </XStack>

          <Text fontSize={12} color={colors.textSec} fontFamily="$body" lineHeight={17}>
            {industry.description}
          </Text>
        </YStack>

        {/* Key Problems VigIA Solves */}
        <YStack
          backgroundColor={colors.bg}
          borderRadius={10}
          padding={12}
          borderWidth={1}
          borderColor={colors.borderSoft}
          gap={6}
        >
          <Text fontSize={10} fontWeight="700" color={colors.textLabel} fontFamily="$mono">
            PROBLEMAS QUE VIGIA ANALIZA
          </Text>
          {industry.keyProblems.slice(0, 3).map((prob, idx) => (
            <XStack key={idx} alignItems="flex-start" gap={6}>
              <View
                width={5}
                height={5}
                borderRadius={2.5}
                backgroundColor={industry.accentColor}
                marginTop={5}
              />
              <Text fontSize={11} color={colors.text} fontFamily="$body" flex={1} lineHeight={15}>
                {prob}
              </Text>
            </XStack>
          ))}
        </YStack>

        {/* Relevant Modules Chips */}
        <XStack flexWrap="wrap" gap={6}>
          {industry.relevantModules.map((mod) => (
            <XStack
              key={mod.name}
              backgroundColor="rgba(255, 255, 255, 0.05)"
              borderWidth={1}
              borderColor={colors.borderSoft}
              paddingHorizontal={8}
              paddingVertical={4}
              borderRadius={6}
              alignItems="center"
              gap={5}
            >
              <Text fontSize={10} fontWeight="700" color={colors.text} fontFamily="$body">
                {mod.name}:
              </Text>
              <Text fontSize={10} fontWeight="800" color={mod.color} fontFamily="$mono">
                {mod.stat}
              </Text>
            </XStack>
          ))}
        </XStack>

        {/* Action Button */}
        <TouchableOpacity
          onPress={handleOpenDemo}
          style={{
            backgroundColor: industry.accentColor,
            borderRadius: 10,
            paddingVertical: 11,
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Eye size={15} color="#ffffff" />
          <Text fontSize={12.5} fontWeight="700" color="#ffffff" fontFamily="$body">
            Explorar Demo {industry.shortName}
          </Text>
          <ArrowRight size={14} color="#ffffff" />
        </TouchableOpacity>
      </YStack>
    </View>
  );
}
