import { SeverityBadge } from "@/src/components/event-item-card";
import { ModuleChip } from "@/src/components/module-chip";
import { PageContainer } from "@/src/components/page-container";
import { EVENTS, formatTimestamp } from "@/src/data/mock";
import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { useColors } from "@/src/hooks/use-colors";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  Clock,
  Download,
  MapPin,
  PackageX,
  PersonStanding,
  ScanLine,
  ShieldAlert,
  Users,
} from "lucide-react-native";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View, XStack, YStack } from "tamagui";

const ALERT_IMAGES = [
  require("@/assets/alert.png"),
  require("@/assets/alert2.png"),
  require("@/assets/alert3.png"),
];

const MODULE_ICONS: Record<string, React.ElementType> = {
  ocr: ScanLine,
  people: Users,
  intrusion: ShieldAlert,
  stolen: PackageX,
  fall: PersonStanding,
  tampering: Camera,
};

const MODULE_COLORS: Record<string, string> = {
  ocr: "#3b82f6",
  people: "#3b82f6",
  intrusion: "#fbbf24",
  stolen: "#f87171",
  fall: "#fb923c",
  tampering: "#a78bfa",
};

export default function AlertDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { isDesktop } = useBreakpoint();
  const event = EVENTS.find((e) => e.id === id);

  const player = useVideoPlayer(require("@/assets/alert.webm"), (p) => {
    p.loop = true;
    p.muted = false;
    p.play();
  });

  if (!event) {
    return (
      <View flex={1} backgroundColor={colors.bg} alignItems="center" justifyContent="center">
        <Text color={colors.textLabel} fontFamily="$body">
          Evento no encontrado
        </Text>
      </View>
    );
  }

  const IconComponent = MODULE_ICONS[event.module];
  const moduleColor = MODULE_COLORS[event.module];

  const videoSection = (
    <View borderRadius={16} overflow="hidden" borderWidth={1} borderColor={colors.borderSoft}>
      <View height={220} backgroundColor={colors.preview}>
        <VideoView style={{ flex: 1 }} player={player} contentFit="cover" allowsFullscreen />
      </View>
      <View backgroundColor={colors.card} padding={12}>
        <Text
          fontSize={11}
          color={colors.textLabel}
          fontFamily="$body"
          marginBottom={8}
          fontWeight="600"
          letterSpacing={0.8}
        >
          CAPTURAS DEL EVENTO
        </Text>
        <XStack gap={8}>
          {ALERT_IMAGES.map((src, n) => (
            <View
              key={n}
              flex={1}
              height={80}
              borderRadius={8}
              overflow="hidden"
              borderWidth={1}
              borderColor={colors.borderSoft}
            >
              <Image source={src} style={{ flex: 1 }} contentFit="cover" />
            </View>
          ))}
        </XStack>
      </View>
    </View>
  );

  const metaSection = (
    <YStack
      backgroundColor={colors.card}
      borderRadius={14}
      borderWidth={1}
      borderColor={colors.borderSoft}
      overflow="hidden"
    >
      <MetaRow label="Tipo de evento" value={event.type} />
      <MetaDivider />
      <MetaRow
        label="Cámara"
        value={event.cameraName}
        icon={<MapPin size={14} color="#64748b" />}
      />
      <MetaDivider />
      <MetaRow label="Módulo">
        <ModuleChip moduleId={event.module} />
      </MetaRow>
      <MetaDivider />
      <MetaRow label="Severidad">
        <SeverityBadge severity={event.severity} />
      </MetaRow>
      <MetaDivider />
      <MetaRow
        label="Fecha y hora"
        value={formatTimestamp(event.timestamp)}
        icon={<Clock size={14} color="#64748b" />}
      />
    </YStack>
  );

  const descriptionSection = (
    <YStack
      backgroundColor={colors.card}
      borderRadius={14}
      borderWidth={1}
      borderColor={colors.borderSoft}
      padding={16}
      gap={8}
    >
      <Text
        fontSize={11}
        fontWeight="700"
        color={colors.textLabel}
        fontFamily="$body"
        letterSpacing={1.2}
      >
        DESCRIPCIÓN DEL EVENTO
      </Text>
      <Text fontSize={13} color={colors.textSec} fontFamily="$body" lineHeight={20}>
        {event.description}
      </Text>
    </YStack>
  );

  const actionsSection = (
    <YStack gap={10}>
      <XStack
        height={48}
        borderRadius={12}
        borderWidth={1}
        borderColor={colors.border}
        alignItems="center"
        justifyContent="center"
        gap={10}
        pressStyle={{ opacity: 0.7 }}
      >
        <CheckCircle size={16} color="#34d399" />
        <Text fontSize={14} fontWeight="600" color="#34d399" fontFamily="$body">
          Marcar como revisado
        </Text>
      </XStack>
      <XStack
        height={48}
        borderRadius={12}
        borderWidth={1}
        borderColor={colors.border}
        alignItems="center"
        justifyContent="center"
        gap={10}
        pressStyle={{ opacity: 0.7 }}
      >
        <Download size={16} color={colors.textTer} />
        <Text fontSize={14} fontWeight="600" color={colors.textTer} fontFamily="$body">
          Exportar evidencia
        </Text>
      </XStack>
    </YStack>
  );

  return (
    <PageContainer>
      <View flex={1} backgroundColor={colors.bg}>
        {/* Header */}
        <XStack
          paddingTop={insets.top + 8}
          paddingHorizontal={20}
          paddingBottom={14}
          alignItems="center"
          gap={12}
          backgroundColor={colors.bg}
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
            pressStyle={{ opacity: 0.6 }}
            onPress={() => router.back()}
          >
            <ArrowLeft size={18} color={colors.textTer} />
          </View>
          <XStack flex={1} alignItems="center" gap={10}>
            {IconComponent && <IconComponent size={18} color={moduleColor} />}
            <Text
              fontSize={15}
              fontWeight="700"
              color={colors.text}
              fontFamily="$body"
              flex={1}
              numberOfLines={1}
            >
              {event.type}
            </Text>
          </XStack>
          <SeverityBadge severity={event.severity} />
        </XStack>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {isDesktop ? (
            /* Desktop: 2 columns */
            <XStack gap={20} padding={20} alignItems="flex-start">
              <YStack flex={3} gap={16}>
                {videoSection}
                {actionsSection}
              </YStack>
              <YStack flex={2} gap={16}>
                {metaSection}
                {descriptionSection}
              </YStack>
            </XStack>
          ) : (
            /* Mobile: single column */
            <YStack gap={14} padding={16}>
              {videoSection}
              {metaSection}
              {descriptionSection}
              {actionsSection}
            </YStack>
          )}
        </ScrollView>
      </View>
    </PageContainer>
  );
}

function MetaRow({
  label,
  value,
  icon,
  children,
}: {
  label: string;
  value?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const colors = useColors();
  return (
    <XStack padding={14} justifyContent="space-between" alignItems="center">
      <Text fontSize={12} color={colors.textLabel} fontFamily="$body">
        {label}
      </Text>
      {children ? (
        children
      ) : (
        <XStack alignItems="center" gap={6}>
          {icon}
          <Text
            fontSize={13}
            color={colors.textSec}
            fontFamily="$body"
            fontWeight="500"
            textAlign="right"
            maxWidth={200}
          >
            {value}
          </Text>
        </XStack>
      )}
    </XStack>
  );
}

function MetaDivider() {
  const colors = useColors();
  return <View height={1} backgroundColor={colors.borderSoft} />;
}
