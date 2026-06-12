import { useSupabaseAuth } from "@/src/hooks/use-supabase-auth";
import { useColors } from "@/src/hooks/use-colors";
import { router } from "expo-router";
import {
  Camera,
  ChevronDown,
  ChevronRight,
  PackageX,
  PersonStanding,
  ScanLine,
  Settings,
  ShieldAlert,
  Users,
  X,
} from "lucide-react-native";
import { useEffect, useState } from "react";
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

const SERVICE_TO_ICON: Record<string, string> = {
  people_analytics: "Users",
  person_detection: "Users",
  vehicle_plates: "ScanLine",
  theft_detection: "PackageX",
  heat_map: "Users",
  intrusion_detection: "ShieldAlert",
  fall_detection: "PersonStanding",
  tampering_detection: "Camera",
};

const SERVICE_TO_COLOR: Record<string, string> = {
  people_analytics: "#3b82f6",
  person_detection: "#3b82f6",
  vehicle_plates: "#3b82f6",
  theft_detection: "#f87171",
  heat_map: "#3b82f6",
  intrusion_detection: "#fbbf24",
  fall_detection: "#fb923c",
  tampering_detection: "#a78bfa",
};

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { supabase, ready } = useSupabaseAuth();
  const [cameras, setCameras] = useState<any[]>([]);
  const [cameraServices, setCameraServices] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;

    async function load() {
      try {
        const [{ data: cams }, { data: svcMap }, { data: svcCatalog }] = await Promise.all([
          supabase
            .from("cameras")
            .select("id, name, status, is_active")
            .eq("is_active", true)
            .order("created_at"),
          supabase
            .from("camera_services")
            .select("camera_id, service_id, is_enabled, service_catalog(key, name)")
            .eq("is_enabled", true),
          supabase.from("service_catalog").select("id, key, name"),
        ]);
        if (cancelled) return;
        setCameras(cams ?? []);
        setCameraServices(svcMap ?? []);
        setServices(svcCatalog ?? []);
      } catch (err: any) {
        console.error("[settings] error:", err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [supabase, ready]);

  // Map services by camera
  const servicesByCamera = (cameraId: string) => {
    const serviceIds = cameraServices
      .filter((cs) => cs.camera_id === cameraId)
      .map((cs) => cs.service_id);
    return services.filter((s) => serviceIds.includes(s.id));
  };

  const camerasWithServices = cameras.filter((c) => servicesByCamera(c.id).length > 0);
  const camerasWithoutServices = cameras.filter((c) => servicesByCamera(c.id).length === 0);

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
        {/* Section: Active modules per camera */}
        <Text
          fontSize={11}
          fontWeight="700"
          color={colors.textLabel}
          fontFamily="$body"
          letterSpacing={1.2}
          marginBottom={12}
          marginLeft={2}
        >
          MÓDULOS ACTIVOS POR CÁMARA
        </Text>
        <Text
          fontSize={12}
          color={colors.textTer}
          fontFamily="$body"
          marginBottom={16}
          marginLeft={2}
          lineHeight={18}
        >
          Módulos de IA habilitados para cada cámara. Los cambios se aplican en el próximo ciclo de
          análisis.
        </Text>

        {loading ? (
          <Text fontSize={14} color={colors.textLabel} textAlign="center" marginTop={40}>
            Cargando…
          </Text>
        ) : (
          <>
            {camerasWithServices.map((cam) => (
              <CameraSection key={cam.id} camera={cam} services={servicesByCamera(cam.id)} />
            ))}

            {/* Cameras without services notice */}
            {camerasWithoutServices.length > 0 && (
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
                  CÁMARAS SIN MÓDULOS ACTIVOS
                </Text>
                <Text fontSize={12} color={colors.textTer} fontFamily="$body" lineHeight={18}>
                  Estas cámaras no tienen módulos de análisis habilitados.
                </Text>
                <YStack marginTop={12} gap={8}>
                  {camerasWithoutServices.map((cam) => (
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
                    </XStack>
                  ))}
                </YStack>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function CameraSection({ camera, services }: { camera: any; services: any[] }) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);

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
              {services.length} módulo{services.length !== 1 ? "s" : ""} activo
              {services.length !== 1 ? "s" : ""}
            </Text>
          </YStack>
        </XStack>
        {expanded ? (
          <ChevronDown size={16} color={colors.textLabel} />
        ) : (
          <ChevronRight size={16} color={colors.textLabel} />
        )}
      </XStack>

      {/* Services */}
      {expanded && (
        <>
          <View height={1} backgroundColor={colors.borderSoft} />
          {services.map((svc, i) => {
            const iconName = SERVICE_TO_ICON[svc.key] ?? "ShieldAlert";
            const IconComponent = MODULE_ICONS[iconName] ?? ShieldAlert;
            const color = SERVICE_TO_COLOR[svc.key] ?? "#3b82f6";
            return (
              <View key={svc.id}>
                <XStack paddingHorizontal={14} paddingVertical={12} alignItems="center" gap={10}>
                  <View
                    width={32}
                    height={32}
                    borderRadius={8}
                    backgroundColor={color + "22"}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <IconComponent size={14} color={color} />
                  </View>
                  <YStack flex={1}>
                    <Text fontSize={13} fontWeight="600" color={colors.text} fontFamily="$body">
                      {svc.name}
                    </Text>
                    <Text fontSize={11} color={colors.textLabel} fontFamily="$body">
                      Activo 24 horas
                    </Text>
                  </YStack>
                  <Switch
                    value={true}
                    disabled
                    trackColor={{ false: colors.border, true: "rgba(59,130,246,0.5)" }}
                    thumbColor="#3b82f6"
                  />
                </XStack>
                {i < services.length - 1 && (
                  <View height={1} backgroundColor={colors.borderSoft} marginHorizontal={14} />
                )}
              </View>
            );
          })}
        </>
      )}
    </View>
  );
}
