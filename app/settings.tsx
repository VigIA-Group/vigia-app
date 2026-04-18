import {
    CAMERAS,
    MODULE_SCHEDULES,
    ModuleSchedule,
    getCameraById,
    getModuleById,
} from "@/src/data/mock";
import { useColors } from "@/src/hooks/use-colors";
import { router } from "expo-router";
import {
    Camera,
    ChevronDown,
    ChevronRight,
    Clock,
    PackageX,
    PersonStanding,
    ScanLine,
    Settings,
    ShieldAlert,
    Users,
    X,
} from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Switch } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View, XStack, YStack } from "tamagui";

const MODULE_ICONS: Record<string, React.ElementType> = {
  ScanLine,
  Users,
  ShieldAlert,
  PackageX,
  PersonStanding,
  Camera,
};

const DAY_LABELS = ["D", "L", "M", "X", "J", "V", "S"];

function padHour(h: number): string {
  return String(h).padStart(2, "0") + ":00";
}

function ScheduleRow({ schedule }: { schedule: ModuleSchedule }) {
  const colors = useColors();
  const [enabled, setEnabled] = useState(schedule.enabled);
  const module = getModuleById(schedule.moduleId);
  const IconComponent = MODULE_ICONS[module.icon] ?? ShieldAlert;

  return (
    <YStack paddingHorizontal={14} paddingVertical={12} gap={10} opacity={enabled ? 1 : 0.5}>
      <XStack alignItems="center" justifyContent="space-between">
        <XStack gap={10} alignItems="center" flex={1}>
          <View
            width={32}
            height={32}
            borderRadius={8}
            backgroundColor={module.color + "22"}
            alignItems="center"
            justifyContent="center"
          >
            <IconComponent size={14} color={module.color} />
          </View>
          <YStack flex={1}>
            <Text fontSize={13} fontWeight="600" color={colors.text} fontFamily="$body">
              {module.name}
            </Text>
            <XStack gap={4} alignItems="center" marginTop={2}>
              <Clock size={11} color={colors.textLabel} />
              <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
                {padHour(schedule.startHour)} – {padHour(schedule.endHour)}
              </Text>
            </XStack>
          </YStack>
        </XStack>
        <Switch
          value={enabled}
          onValueChange={setEnabled}
          trackColor={{ false: colors.border, true: "rgba(59,130,246,0.5)" }}
          thumbColor={enabled ? "#3b82f6" : colors.textLabel}
        />
      </XStack>

      {/* Active days */}
      <XStack gap={5}>
        {DAY_LABELS.map((label, idx) => {
          const active = schedule.activeDays.includes(idx);
          return (
            <View
              key={idx}
              width={26}
              height={26}
              borderRadius={6}
              alignItems="center"
              justifyContent="center"
              backgroundColor={active ? module.color + "22" : colors.cardAlt}
              borderWidth={1}
              borderColor={active ? module.color + "55" : colors.border}
            >
              <Text
                fontSize={10}
                fontWeight="700"
                color={active ? module.color : colors.textLabel}
                fontFamily="$mono"
              >
                {label}
              </Text>
            </View>
          );
        })}
      </XStack>
    </YStack>
  );
}

function CameraSection({ cameraId }: { cameraId: string }) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);
  const camera = getCameraById(cameraId);
  if (!camera) return null;

  const schedules = MODULE_SCHEDULES.filter((s) => s.cameraId === cameraId);
  if (schedules.length === 0) return null;

  return (
    <View
      backgroundColor={colors.card}
      borderRadius={14}
      borderWidth={1}
      borderColor={colors.borderSoft}
      marginBottom={12}
      overflow="hidden"
    >
      {/* Header */}
      <XStack
        padding={14}
        alignItems="center"
        justifyContent="space-between"
        pressStyle={{ opacity: 0.7 }}
        onPress={() => setExpanded((v) => !v)}
      >
        <XStack gap={10} alignItems="center" flex={1}>
          <View
            width={36}
            height={36}
            borderRadius={10}
            backgroundColor={colors.cardAlt}
            alignItems="center"
            justifyContent="center"
          >
            <Camera size={16} color="#3b82f6" />
          </View>
          <YStack flex={1}>
            <Text fontSize={14} fontWeight="700" color={colors.text} fontFamily="$body">
              {camera.name}
            </Text>
            <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
              {camera.room} · {schedules.length} horario{schedules.length !== 1 ? "s" : ""}
            </Text>
          </YStack>
        </XStack>
        {expanded ? (
          <ChevronDown size={16} color={colors.textLabel} />
        ) : (
          <ChevronRight size={16} color={colors.textLabel} />
        )}
      </XStack>

      {/* Schedules */}
      {expanded && (
        <>
          <View height={1} backgroundColor={colors.borderSoft} />
          {schedules.map((sch, i) => (
            <View key={sch.id}>
              <ScheduleRow schedule={sch} />
              {i < schedules.length - 1 && (
                <View height={1} backgroundColor={colors.borderSoft} marginHorizontal={14} />
              )}
            </View>
          ))}
        </>
      )}
    </View>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();

  // Only show cameras that have schedules
  const camerasWithSchedules = [...new Set(MODULE_SCHEDULES.map((s) => s.cameraId))];

  return (
    <View flex={1} backgroundColor={colors.bg}>
      {/* Header */}
      <XStack
        paddingTop={insets.top + 12}
        paddingHorizontal={20}
        paddingBottom={16}
        alignItems="center"
        justifyContent="space-between"
        borderBottomWidth={1}
        borderBottomColor={colors.borderSoft}
        backgroundColor={colors.bg}
      >
        <XStack gap={10} alignItems="center">
          <Settings size={20} color="#3b82f6" />
          <Text fontSize={20} fontWeight="700" color={colors.text} fontFamily="$body">
            Configuración
          </Text>
        </XStack>
        <View
          width={34}
          height={34}
          borderRadius={10}
          backgroundColor={colors.card}
          alignItems="center"
          justifyContent="center"
          borderWidth={1}
          borderColor={colors.border}
          pressStyle={{ opacity: 0.6 }}
          onPress={() => router.back()}
        >
          <X size={16} color={colors.textTer} />
        </View>
      </XStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
      >
        {/* Section: Module Schedules */}
        <Text
          fontSize={11}
          fontWeight="700"
          color={colors.textLabel}
          fontFamily="$body"
          letterSpacing={1.2}
          marginBottom={12}
          marginLeft={2}
        >
          HORARIOS DE MÓDULOS POR CÁMARA
        </Text>
        <Text
          fontSize={12}
          color={colors.textTer}
          fontFamily="$body"
          marginBottom={16}
          marginLeft={2}
          lineHeight={18}
        >
          Activa o desactiva módulos de IA para cada cámara según su horario de operación. Los
          cambios se aplican en el próximo ciclo de análisis.
        </Text>

        {camerasWithSchedules.map((cameraId) => (
          <CameraSection key={cameraId} cameraId={cameraId} />
        ))}

        {/* Cameras without schedules notice */}
        <View
          backgroundColor={colors.card}
          borderRadius={14}
          borderWidth={1}
          borderColor={colors.borderSoft}
          padding={16}
          marginTop={4}
        >
          <Text
            fontSize={11}
            fontWeight="700"
            color={colors.textLabel}
            fontFamily="$body"
            letterSpacing={1.2}
            marginBottom={8}
          >
            OTRAS CÁMARAS
          </Text>
          <Text fontSize={12} color={colors.textTer} fontFamily="$body" lineHeight={18}>
            Las cámaras sin horarios configurados ejecutan todos sus módulos activos de forma
            continua durante las 24 horas.
          </Text>
          <YStack marginTop={12} gap={8}>
            {CAMERAS.filter((c) => !camerasWithSchedules.includes(c.id)).map((cam) => (
              <XStack key={cam.id} alignItems="center" gap={10}>
                <View
                  width={6}
                  height={6}
                  borderRadius={3}
                  backgroundColor={cam.status === "offline" ? colors.textLabel : "#34d399"}
                />
                <Text fontSize={12} color={colors.textSec} fontFamily="$body">
                  {cam.name}
                </Text>
                <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
                  — {cam.room}
                </Text>
              </XStack>
            ))}
          </YStack>
        </View>
      </ScrollView>
    </View>
  );
}
