import { EventItemCard } from "@/src/components/event-item-card";
import { InsightCard } from "@/src/components/insight-card";
import { KPICard } from "@/src/components/kpi-card";
import { ModuleCard } from "@/src/components/module-card";
import { PageContainer } from "@/src/components/page-container";
import { VigIALogoText } from "@/src/components/vigia-logo-text";
import {
  CONVERSION_KPI,
  DAILY_PEOPLE_7D,
  EVENTS,
  INSIGHTS,
  KPIs,
  MODULES,
  USER,
  getUnreviewedCount,
  getWeeklyChangePercent,
} from "@/src/data/mock";
import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { useColors } from "@/src/hooks/use-colors";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { BarChart2, Bell } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView, Text, View, XStack, YStack } from "tamagui";

const TODAY = new Date("2026-09-09");
const DAY_NAMES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MONTH_NAMES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { isDesktop } = useBreakpoint();
  const unreviewedCount = getUnreviewedCount();
  const recentEvents = EVENTS.slice(0, 5);
  const activeModules = MODULES.slice(0, 4);
  const maxPeople = Math.max(...DAILY_PEOPLE_7D.map((d) => d.count));
  const allKPIs = [...KPIs, CONVERSION_KPI];

  // ── Shared section components ─────────────────────────────────────

  const greeting = (
    <YStack paddingHorizontal={20} paddingTop={4} marginBottom={24}>
      <Text fontSize={isDesktop ? 32 : 26} fontWeight="700" color={colors.text} fontFamily="$body">
        {getGreeting()},{" "}
        <Text fontSize={isDesktop ? 32 : 26} fontWeight="700" fontFamily="$body" color="#60a5fa">
          {USER.name.split(" ")[0]}
        </Text>
      </Text>
      <Text
        fontSize={isDesktop ? 16 : 14}
        color={colors.textLabel}
        fontFamily="$body"
        marginTop={4}
      >
        {DAY_NAMES[TODAY.getDay()]}, {TODAY.getDate()} de {MONTH_NAMES[TODAY.getMonth()]}{" "}
        {TODAY.getFullYear()}
      </Text>
    </YStack>
  );

  const kpiCards = (
    <YStack marginBottom={28}>
      {isDesktop ? (
        <XStack paddingHorizontal={20} gap={10} flexWrap="wrap">
          {allKPIs.map((kpi, i) => (
            <View key={kpi.id} flex={1} minWidth={140}>
              <KPICard kpi={kpi} index={i} />
            </View>
          ))}
        </XStack>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
        >
          {allKPIs.map((kpi, i) => (
            <KPICard key={kpi.id} kpi={kpi} index={i} />
          ))}
        </ScrollView>
      )}
    </YStack>
  );

  const recentActivity = (
    <YStack marginBottom={28} paddingHorizontal={20}>
      <XStack justifyContent="space-between" alignItems="center" marginBottom={14}>
        <Text
          fontSize={isDesktop ? 20 : 17}
          fontWeight="700"
          color={colors.text}
          fontFamily="$body"
        >
          Actividad reciente
        </Text>
        <View pressStyle={{ opacity: 0.7 }} onPress={() => router.push("/(tabs)/alerts")}>
          <Text fontSize={isDesktop ? 14 : 13} color="#3b82f6" fontFamily="$body" fontWeight="600">
            Ver todo
          </Text>
        </View>
      </XStack>
      <View
        backgroundColor={colors.card}
        borderRadius={14}
        borderWidth={1}
        borderColor={colors.borderSoft}
        overflow="hidden"
      >
        {recentEvents.map((event, i) => (
          <View key={event.id}>
            {i > 0 && <View height={1} backgroundColor={colors.borderSoft} marginHorizontal={12} />}
            <EventItemCard
              event={event}
              onPress={() => router.push(`/(tabs)/alerts/${event.id}`)}
            />
          </View>
        ))}
      </View>
    </YStack>
  );

  const activeModulesSection = (
    <YStack marginBottom={28} paddingHorizontal={20}>
      <XStack justifyContent="space-between" alignItems="center" marginBottom={14}>
        <Text
          fontSize={isDesktop ? 20 : 17}
          fontWeight="700"
          color={colors.text}
          fontFamily="$body"
        >
          Módulos activos
        </Text>
        <View pressStyle={{ opacity: 0.7 }} onPress={() => router.push("/(tabs)/home/modules")}>
          <Text fontSize={isDesktop ? 14 : 13} color="#3b82f6" fontFamily="$body" fontWeight="600">
            Ver todos
          </Text>
        </View>
      </XStack>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack gap={12}>
          {activeModules.map((mod) => (
            <View key={mod.id} width={150} minHeight={185}>
              <ModuleCard module={mod} />
            </View>
          ))}
        </XStack>
      </ScrollView>
    </YStack>
  );

  const weekReport = (
    <YStack paddingHorizontal={20} marginBottom={28}>
      <XStack justifyContent="space-between" alignItems="center" marginBottom={14}>
        <Text
          fontSize={isDesktop ? 20 : 17}
          fontWeight="700"
          color={colors.text}
          fontFamily="$body"
        >
          Reporte de la semana
        </Text>
        <View pressStyle={{ opacity: 0.7 }} onPress={() => router.push("/(tabs)/reports")}>
          <Text fontSize={isDesktop ? 14 : 13} color="#3b82f6" fontFamily="$body" fontWeight="600">
            Ver reportes
          </Text>
        </View>
      </XStack>
      <View
        backgroundColor={colors.card}
        borderRadius={14}
        borderWidth={1}
        borderColor={colors.borderSoft}
        padding={16}
      >
        <XStack justifyContent="space-between" alignItems="center" marginBottom={24}>
          <Text
            fontSize={isDesktop ? 14 : 13}
            color={colors.textLabel}
            fontFamily="$body"
          >
            Personas detectadas — últimos 7 días
          </Text>
          <Text
            fontSize={11}
            fontWeight="700"
            color={getWeeklyChangePercent() >= 0 ? "#34d399" : "#f87171"}
            fontFamily="$mono"
          >
            {getWeeklyChangePercent() >= 0 ? "+" : ""}{getWeeklyChangePercent()}% vs. semana anterior
          </Text>
        </XStack>
        <XStack alignItems="flex-end" gap={6} height={64}>
          {DAILY_PEOPLE_7D.map((point) => {
            const barH = Math.max(4, (point.count / maxPeople) * 64);
            const isToday = point.day === "Mar";
            return (
              <YStack key={point.day} flex={1} alignItems="center" gap={4}>
                <View
                  height={barH}
                  borderRadius={4}
                  width="100%"
                  overflow="hidden"
                  style={{ marginTop: 64 - barH }}
                >
                  {isToday ? (
                    <LinearGradient
                      colors={["#02209A", "#0A4CE8", "#056EFA"]}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 0, y: 0 }}
                      style={{ flex: 1 }}
                    />
                  ) : (
                    <View flex={1} backgroundColor={colors.cardAlt} />
                  )}
                </View>
                <Text
                  fontSize={10}
                  color={isToday ? "#3b82f6" : colors.textLabel}
                  fontFamily="$mono"
                >
                  {point.day}
                </Text>
              </YStack>
            );
          })}
        </XStack>
      </View>
    </YStack>
  );

  const insights = (
    <YStack paddingHorizontal={20} marginBottom={28}>
      <XStack justifyContent="space-between" alignItems="center" marginBottom={14}>
        <Text
          fontSize={isDesktop ? 20 : 17}
          fontWeight="700"
          color={colors.text}
          fontFamily="$body"
        >
          Insights
        </Text>
        <View pressStyle={{ opacity: 0.7 }} onPress={() => router.push("/(tabs)/alerts")}>
          <Text fontSize={isDesktop ? 14 : 13} color="#3b82f6" fontFamily="$body" fontWeight="600">
            Ver todos
          </Text>
        </View>
      </XStack>
      {INSIGHTS.slice(0, 3).map((ins) => (
        <InsightCard key={ins.id} insight={ins} compact />
      ))}
    </YStack>
  );

  const heatmap = (
    <YStack paddingHorizontal={20} marginBottom={28}>
      <Text
        fontSize={isDesktop ? 20 : 17}
        fontWeight="700"
        color={colors.text}
        fontFamily="$body"
        marginBottom={14}
      >
        Mapa de calor
      </Text>
      <View
        backgroundColor={colors.card}
        borderRadius={14}
        borderWidth={1}
        borderColor={colors.borderSoft}
        overflow="hidden"
        height={200}
      >
        <Image source={require("@/assets/heatmap.png")} style={{ flex: 1 }} contentFit="cover" />
      </View>
    </YStack>
  );

  const quickLink = (
    <View paddingHorizontal={20} marginBottom={28}>
      <View
        borderRadius={14}
        overflow="hidden"
        pressStyle={{ opacity: 0.8 }}
        onPress={() => router.push("/(tabs)/reports")}
      >
        <LinearGradient
          colors={["#1e3a8a", "#2563eb", "#3b82f6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ padding: 16 }}
        >
          <XStack alignItems="center" gap={12}>
            <View
              width={48}
              height={48}
              borderRadius={12}
              backgroundColor="rgba(255,255,255,0.15)"
              alignItems="center"
              justifyContent="center"
            >
              <BarChart2 size={24} color="#ffffff" />
            </View>
            <YStack flex={1}>
              <Text
                fontSize={isDesktop ? 16 : 15}
                fontWeight="700"
                color="#ffffff"
                fontFamily="$body"
              >
                Reportes completos
              </Text>
              <Text
                fontSize={isDesktop ? 13 : 12}
                color="rgba(255,255,255,0.75)"
                fontFamily="$body"
                marginTop={2}
              >
                Gráficos por día, hora, módulo y comparativas
              </Text>
            </YStack>
            <Text fontSize={20} color="rgba(255,255,255,0.8)">
              ›
            </Text>
          </XStack>
        </LinearGradient>
      </View>
    </View>
  );

  // ── Layout ────────────────────────────────────────────────────────

  return (
    <PageContainer>
      <View flex={1} backgroundColor={colors.bg}>
        {/* Fixed Header */}
        <XStack
          paddingTop={insets.top + 8}
          paddingHorizontal={20}
          paddingBottom={12}
          justifyContent="space-between"
          alignItems="center"
          backgroundColor={colors.bg}
        >
          <VigIALogoText height={30} />
          <View pressStyle={{ opacity: 0.7 }} onPress={() => router.push("/(tabs)/alerts")}>
            <View>
              <Bell size={22} color={colors.textTer} />
              {unreviewedCount > 0 && (
                <View
                  position="absolute"
                  top={-4}
                  right={-4}
                  width={16}
                  height={16}
                  borderRadius={8}
                  backgroundColor="#f87171"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontSize={9} fontWeight="700" color="#ffffff" fontFamily="$body">
                    {unreviewedCount > 9 ? "9+" : unreviewedCount}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </XStack>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {isDesktop ? (
            /* ── Desktop: 2-column grid ── */
            <>
              <XStack gap={0} alignItems="flex-start" paddingTop={4}>
                {/* Left column — main content */}
                <YStack flex={3} minWidth={0}>
                  {greeting}
                  {kpiCards}
                  {recentActivity}
                  {heatmap}
                </YStack>

                {/* Right column — secondary */}
                <YStack flex={2} minWidth={0} paddingTop={4}>
                  {activeModulesSection}
                  {weekReport}
                  {insights}
                  {quickLink}
                </YStack>
              </XStack>
            </>
          ) : (
            /* ── Mobile: single column ── */
            <>
              {greeting}
              {kpiCards}
              {recentActivity}
              {activeModulesSection}
              {weekReport}
              {insights}
              {heatmap}
              {quickLink}
            </>
          )}
        </ScrollView>
      </View>
    </PageContainer>
  );
}
