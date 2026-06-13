import { useSupabaseAuth } from "@/src/hooks/use-supabase-auth";
import { useColors } from "@/src/hooks/use-colors";
import { router } from "expo-router";
import { ArrowLeft, Camera, MapPin, Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View, XStack, YStack } from "tamagui";

export default function CameraRegistrationScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { supabase, ready } = useSupabaseAuth();

  const [locations, setLocations] = useState<any[]>([]);
  const [cameras, setCameras] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newLocationName, setNewLocationName] = useState("");
  const [newCameraName, setNewCameraName] = useState("");
  const [newCameraPath, setNewCameraPath] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [selectedServiceKeys, setSelectedServiceKeys] = useState<string[]>([]);

  useEffect(() => {
    if (!ready) return;

    async function load() {
      const [{ data: locs }, { data: cams }, { data: svcs }] = await Promise.all([
        supabase.from("locations").select("*"),
        supabase
          .from("cameras")
          .select("*, camera_services(is_enabled, service_catalog(key, name))"),
        supabase.from("service_catalog").select("*"),
      ]);
      setLocations(locs ?? []);
      setCameras(cams ?? []);
      setServices(svcs ?? []);
      setLoading(false);
    }

    load();
  }, [supabase, ready]);

  const addLocation = async () => {
    if (!newLocationName.trim()) return;
    const { data, error } = await supabase
      .from("locations")
      .insert({ name: newLocationName.trim() })
      .select()
      .single();
    if (!error && data) {
      setLocations((prev) => [...prev, data]);
      setNewLocationName("");
    } else {
      console.error("[camera-reg] location error:", error?.message);
    }
  };

  const addCamera = async () => {
    if (!newCameraName.trim() || !selectedLocationId || !newCameraPath.trim()) return;

    const { data: cam, error: camErr } = await supabase
      .from("cameras")
      .insert({
        name: newCameraName.trim(),
        location_id: selectedLocationId,
        mediamtx_path: newCameraPath.trim(),
        stream_mode: "push",
        is_active: true,
        fps_config: 1,
      })
      .select()
      .single();

    if (camErr || !cam) {
      console.error("[camera-reg] camera error:", camErr?.message);
      return;
    }

    // Assign selected services
    for (const svcKey of selectedServiceKeys) {
      const svc = services.find((s) => s.key === svcKey);
      if (!svc) continue;
      await supabase.from("camera_services").insert({
        camera_id: cam.id,
        service_id: svc.id,
        is_enabled: true,
      });
    }

    setCameras((prev) => [...prev, cam]);
    setNewCameraName("");
    setNewCameraPath("");
    setSelectedServiceKeys([]);
  };

  return (
    <View flex={1} backgroundColor={colors.bg}>
      <XStack
        paddingTop={insets.top + 12}
        paddingHorizontal={20}
        paddingBottom={16}
        alignItems="center"
        gap={12}
        borderBottomWidth={1}
        borderBottomColor={colors.borderSoft}
      >
        <View
          width={36}
          height={36}
          borderRadius={10}
          backgroundColor={colors.card}
          alignItems="center"
          justifyContent="center"
          borderWidth={1}
          borderColor={colors.border}
          pressStyle={{ opacity: 0.6 }}
          onPress={() => router.back()}
        >
          <ArrowLeft size={16} color={colors.textTer} />
        </View>
        <Text fontSize={20} fontWeight="700" color={colors.text} fontFamily="$body">
          Registrar cámaras
        </Text>
      </XStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 60, gap: 20 }}
      >
        {loading ? (
          <Text color={colors.textLabel} textAlign="center" marginTop={40}>
            Cargando…
          </Text>
        ) : (
          <>
            {/* Locations */}
            <YStack gap={12}>
              <Text fontSize={16} fontWeight="700" color={colors.text} fontFamily="$body">
                Sucursales / Ubicaciones
              </Text>
              {locations.map((loc) => (
                <XStack
                  key={loc.id}
                  padding={12}
                  backgroundColor={colors.card}
                  borderRadius={12}
                  borderWidth={1}
                  borderColor={colors.borderSoft}
                  alignItems="center"
                  gap={10}
                >
                  <MapPin size={16} color="#3b82f6" />
                  <Text fontSize={14} color={colors.text} fontFamily="$body">
                    {loc.name}
                  </Text>
                </XStack>
              ))}
              <XStack gap={8}>
                <TextInput
                  style={{
                    flex: 1,
                    backgroundColor: colors.card,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: colors.borderSoft,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    color: colors.text,
                    fontSize: 14,
                  }}
                  placeholder="Nueva ubicación"
                  placeholderTextColor={colors.textLabel}
                  value={newLocationName}
                  onChangeText={setNewLocationName}
                />
                <View
                  width={44}
                  height={44}
                  borderRadius={10}
                  backgroundColor="#3b82f6"
                  alignItems="center"
                  justifyContent="center"
                  pressStyle={{ opacity: 0.8 }}
                  onPress={addLocation}
                >
                  <Plus size={20} color="#fff" />
                </View>
              </XStack>
            </YStack>

            {/* Cameras */}
            <YStack gap={12}>
              <Text fontSize={16} fontWeight="700" color={colors.text} fontFamily="$body">
                Cámaras registradas
              </Text>
              {cameras.map((cam) => (
                <View
                  key={cam.id}
                  padding={12}
                  backgroundColor={colors.card}
                  borderRadius={12}
                  borderWidth={1}
                  borderColor={colors.borderSoft}
                  gap={4}
                >
                  <XStack alignItems="center" gap={10}>
                    <Camera size={16} color="#34d399" />
                    <Text fontSize={14} fontWeight="600" color={colors.text} fontFamily="$body">
                      {cam.name}
                    </Text>
                    <View
                      paddingHorizontal={8}
                      paddingVertical={2}
                      borderRadius={100}
                      backgroundColor={
                        cam.is_active ? "rgba(52,211,153,0.15)" : "rgba(100,116,139,0.15)"
                      }
                    >
                      <Text
                        fontSize={10}
                        fontWeight="700"
                        color={cam.is_active ? "#34d399" : "#64748b"}
                        fontFamily="$body"
                      >
                        {cam.is_active ? "Activa" : "Inactiva"}
                      </Text>
                    </View>
                  </XStack>
                  <Text fontSize={12} color={colors.textLabel} fontFamily="$body">
                    Path: {cam.mediamtx_path}
                  </Text>
                </View>
              ))}
            </YStack>

            {/* Add camera form */}
            <YStack gap={12}>
              <Text fontSize={16} fontWeight="700" color={colors.text} fontFamily="$body">
                Nueva cámara
              </Text>
              <TextInput
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: colors.borderSoft,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: colors.text,
                  fontSize: 14,
                }}
                placeholder="Nombre de cámara (ej: Cámara entrada)"
                placeholderTextColor={colors.textLabel}
                value={newCameraName}
                onChangeText={setNewCameraName}
              />
              <TextInput
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: colors.borderSoft,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: colors.text,
                  fontSize: 14,
                }}
                placeholder="MediaMTX path (ej: mi-cam-01)"
                placeholderTextColor={colors.textLabel}
                value={newCameraPath}
                onChangeText={setNewCameraPath}
              />

              {/* Location selector */}
              <Text fontSize={12} color={colors.textLabel} fontFamily="$body">
                Ubicación
              </Text>
              <XStack gap={8} flexWrap="wrap">
                {locations.map((loc) => {
                  const selected = selectedLocationId === loc.id;
                  return (
                    <View
                      key={loc.id}
                      paddingHorizontal={12}
                      paddingVertical={6}
                      borderRadius={100}
                      backgroundColor={selected ? "rgba(59,130,246,0.15)" : colors.card}
                      borderWidth={1}
                      borderColor={selected ? "#3b82f6" : colors.borderSoft}
                      pressStyle={{ opacity: 0.7 }}
                      onPress={() => setSelectedLocationId(loc.id)}
                    >
                      <Text
                        fontSize={12}
                        fontWeight="600"
                        color={selected ? "#3b82f6" : colors.textLabel}
                        fontFamily="$body"
                      >
                        {loc.name}
                      </Text>
                    </View>
                  );
                })}
              </XStack>

              {/* Service selector */}
              <Text fontSize={12} color={colors.textLabel} fontFamily="$body">
                Módulos de análisis
              </Text>
              <XStack gap={8} flexWrap="wrap">
                {services.map((svc) => {
                  const selected = selectedServiceKeys.includes(svc.key);
                  return (
                    <View
                      key={svc.key}
                      paddingHorizontal={12}
                      paddingVertical={6}
                      borderRadius={100}
                      backgroundColor={selected ? "rgba(59,130,246,0.15)" : colors.card}
                      borderWidth={1}
                      borderColor={selected ? "#3b82f6" : colors.borderSoft}
                      pressStyle={{ opacity: 0.7 }}
                      onPress={() =>
                        setSelectedServiceKeys((prev) =>
                          selected ? prev.filter((k) => k !== svc.key) : [...prev, svc.key]
                        )
                      }
                    >
                      <Text
                        fontSize={12}
                        fontWeight="600"
                        color={selected ? "#3b82f6" : colors.textLabel}
                        fontFamily="$body"
                      >
                        {svc.name}
                      </Text>
                    </View>
                  );
                })}
              </XStack>

              <View
                height={48}
                borderRadius={12}
                backgroundColor="#3b82f6"
                alignItems="center"
                justifyContent="center"
                pressStyle={{ opacity: 0.85 }}
                onPress={addCamera}
              >
                <Text fontSize={15} fontWeight="700" color="#ffffff" fontFamily="$body">
                  Crear cámara
                </Text>
              </View>
            </YStack>
          </>
        )}
      </ScrollView>
    </View>
  );
}
