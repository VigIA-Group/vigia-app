import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { useColors } from "@/src/hooks/use-colors";
import { VideoView, useVideoPlayer } from "expo-video";
import {
  Activity,
  AlertTriangle,
  Camera as CameraIcon,
  CheckCircle2,
  Clock,
  Eye,
  Maximize2,
  RefreshCw,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react-native";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View, XStack, YStack } from "tamagui";

const VIDEO_SOURCES = [
  "https://firebasestorage.googleapis.com/v0/b/desarrollo-en-la-nube-7e9ff.firebasestorage.app/o/vigia%2Fvideo.mp4?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/desarrollo-en-la-nube-7e9ff.firebasestorage.app/o/vigia%2Fvideo2.mp4?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/desarrollo-en-la-nube-7e9ff.firebasestorage.app/o/vigia%2Fvideo3.mp4?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/desarrollo-en-la-nube-7e9ff.firebasestorage.app/o/vigia%2Fvideo4.mp4?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/desarrollo-en-la-nube-7e9ff.firebasestorage.app/o/vigia%2Fvideo5.mp4?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/desarrollo-en-la-nube-7e9ff.firebasestorage.app/o/vigia%2Fvideo6.mp4?alt=media",
];

export interface BoundingBoxDetection {
  id: string;
  label: string;
  sublabel?: string;
  status: "ok" | "warning" | "alert" | "info";
  dwellTime?: string;
  confidence: number;
  top: string;
  left: string;
  width: string;
  height: string;
  zonePolygon?: boolean;
}

export interface CameraFeedConfig {
  id: string;
  name: string;
  location: string;
  fps: number;
  status: "live" | "alert" | "standby";
  videoIndex: number;
  detections: BoundingBoxDetection[];
  recentEvents: { time: string; text: string; severity: "ok" | "warning" | "alert" }[];
}

interface LiveCameraOverlayProps {
  industryId?: string;
  feeds?: CameraFeedConfig[];
  accentColor?: string;
}

export function LiveCameraOverlay({
  industryId = "restaurantes",
  feeds,
  accentColor = "#2198F4",
}: LiveCameraOverlayProps) {
  const colors = useColors();
  const { isDesktop } = useBreakpoint();

  const getIndustryFeeds = (indId: string): CameraFeedConfig[] => {
    const id = indId.toLowerCase();

    // RETAIL / TIENDAS / SUPERMERCADOS
    if (
      id.includes("retail") ||
      id.includes("tienda") ||
      id.includes("comercio") ||
      id.includes("supermercado")
    ) {
      return [
        {
          id: "cam-cajas",
          name: "Línea de Cajas 1–6",
          location: "Zona Frontal Cajas",
          fps: 30,
          status: "alert",
          videoIndex: 1,
          detections: [
            {
              id: "ret-1",
              label: "Fila Caja 03 · 5 Personas",
              sublabel: "Fila superior a 4 clientes",
              status: "alert",
              dwellTime: "04:45 min (Alerta de espera)",
              confidence: 98.7,
              top: "20%",
              left: "15%",
              width: "36%",
              height: "45%",
              zonePolygon: true,
            },
            {
              id: "ret-2",
              label: "Caja 01 y 02 · Atendiendo",
              sublabel: "Velocidad 45s por ticket",
              status: "ok",
              dwellTime: "Flujo continuo",
              confidence: 99.2,
              top: "22%",
              left: "56%",
              width: "32%",
              height: "42%",
            },
          ],
          recentEvents: [
            {
              time: "15:44:02",
              text: "Caja 03: Fila supera 4 clientes · Sugerir apertura de Caja 04",
              severity: "alert",
            },
            {
              time: "15:40:15",
              text: "Tiempo medio de cobro en 52 segundos (Dentro de meta)",
              severity: "ok",
            },
          ],
        },
        {
          id: "cam-pasillo",
          name: "Pasillo Central & Góndolas",
          location: "Sector Pasillos 3–7",
          fps: 28,
          status: "live",
          videoIndex: 0,
          detections: [
            {
              id: "ret-3",
              label: "Góndola Promocional · 8 personas",
              sublabel: "Alta atracción en cabecera",
              status: "ok",
              dwellTime: "Dwell promedio 02:18 min",
              confidence: 97.8,
              top: "22%",
              left: "20%",
              width: "38%",
              height: "46%",
            },
            {
              id: "ret-4",
              label: "Pasillo Central Tránsito",
              sublabel: "Afluencia 22 pers/min",
              status: "ok",
              dwellTime: "Circulación fluida",
              confidence: 99.1,
              top: "60%",
              left: "28%",
              width: "44%",
              height: "30%",
              zonePolygon: true,
            },
          ],
          recentEvents: [
            {
              time: "15:42:30",
              text: "Cabecera de snacks registra +38% de permanencia vs promedio",
              severity: "ok",
            },
          ],
        },
        {
          id: "cam-entrada",
          name: "Acceso Principal & Puertas",
          location: "Hall Entrada Norte",
          fps: 30,
          status: "live",
          videoIndex: 3,
          detections: [
            {
              id: "ret-5",
              label: "Torniquete Entrada · Flujo",
              sublabel: "Conteo bidireccional",
              status: "ok",
              dwellTime: "1,420 ingresos hoy",
              confidence: 99.6,
              top: "24%",
              left: "25%",
              width: "40%",
              height: "50%",
            },
          ],
          recentEvents: [
            {
              time: "15:43:50",
              text: "Aforo total de la tienda al 68% (184/270 max)",
              severity: "ok",
            },
          ],
        },
      ];
    }

    // DESPOSTE Y PROCESAMIENTO CÁRNICO / ALIMENTOS
    if (
      id.includes("desposte") ||
      id.includes("porcino") ||
      id.includes("carne") ||
      id.includes("alimento")
    ) {
      return [
        {
          id: "cam-desposte-cinta",
          name: "Cinta de Clasificación PorkNet",
          location: "Sala de Despiece · Línea 01",
          fps: 30,
          status: "live",
          videoIndex: 4,
          detections: [
            {
              id: "pork-1",
              label: "Lomo Deshuesado · Conteo",
              sublabel: "Corte estándar validado",
              status: "ok",
              dwellTime: "Pieza #142 de 142 (100% balance)",
              confidence: 99.4,
              top: "20%",
              left: "15%",
              width: "35%",
              height: "45%",
              zonePolygon: true,
            },
            {
              id: "pork-2",
              label: "Costillar St. Louis",
              sublabel: "Calidad de perfilado grado A",
              status: "ok",
              dwellTime: "Ritmo: 18 piezas/min",
              confidence: 98.9,
              top: "22%",
              left: "55%",
              width: "32%",
              height: "44%",
            },
          ],
          recentEvents: [
            {
              time: "15:44:20",
              text: "Balance cárnico 71/71 cerdos cuadre exacto de piezas",
              severity: "ok",
            },
            {
              time: "15:39:10",
              text: "Cinta transportadora a velocidad constante 0.45 m/s",
              severity: "ok",
            },
          ],
        },
        {
          id: "cam-epp-guante",
          name: "Auditoría EPP & Guante Malla",
          location: "Mesa de Cuchillos · Puesto 3",
          fps: 28,
          status: "live",
          videoIndex: 1,
          detections: [
            {
              id: "pork-3",
              label: "Guante Malla Acero · 6 Operarios",
              sublabel: "Protección anticorte verificada",
              status: "ok",
              dwellTime: "Cumplimiento 100% norma ISO",
              confidence: 99.5,
              top: "18%",
              left: "20%",
              width: "55%",
              height: "50%",
            },
          ],
          recentEvents: [
            {
              time: "15:41:00",
              text: "Auditoría visual de EPP: 0 infracciones en el turno",
              severity: "ok",
            },
          ],
        },
      ];
    }

    // MANUFACTURA / INDUSTRIA / CONSTRUCCIÓN
    if (id.includes("manufactura") || id.includes("industria") || id.includes("construccion")) {
      return [
        {
          id: "cam-linea-ind",
          name: "Línea de Ensamble Automatizada",
          location: "Nave Central · Celda 02",
          fps: 30,
          status: "live",
          videoIndex: 4,
          detections: [
            {
              id: "ind-1",
              label: "Pieza Mecánica #812",
              sublabel: "Control de ciclo en tiempo",
              status: "ok",
              dwellTime: "Ciclo: 38s (Meta: 42s)",
              confidence: 99.2,
              top: "20%",
              left: "20%",
              width: "36%",
              height: "46%",
              zonePolygon: true,
            },
            {
              id: "ind-2",
              label: "Perímetro de Seguridad Celda",
              sublabel: "Barrera óptica virtual",
              status: "ok",
              dwellTime: "Zona despejada",
              confidence: 99.8,
              top: "15%",
              left: "60%",
              width: "28%",
              height: "55%",
            },
          ],
          recentEvents: [
            {
              time: "15:43:00",
              text: "Eficiencia de celda robótica OEE al 94.2%",
              severity: "ok",
            },
          ],
        },
      ];
    }

    // LOGÍSTICA / ESTACIONAMIENTOS / PARQUEOS
    if (
      id.includes("logistica") ||
      id.includes("estacionamiento") ||
      id.includes("parqueo")
    ) {
      return [
        {
          id: "cam-muelle",
          name: "Muelle de Carga & OCR Placas",
          location: "Patio de Maniobras · Muelle 04",
          fps: 28,
          status: "live",
          videoIndex: 5,
          detections: [
            {
              id: "log-1",
              label: "Trailer Freightliner · Placa 4821-KLP",
              sublabel: "Vehículo en descarga autorizada",
              status: "ok",
              dwellTime: "Tiempo en muelle: 28 min",
              confidence: 99.1,
              top: "20%",
              left: "15%",
              width: "45%",
              height: "48%",
              zonePolygon: true,
            },
            {
              id: "log-2",
              label: "Montacargas #02",
              sublabel: "Velocidad controlada 6.5 km/h",
              status: "ok",
              dwellTime: "Operación segura",
              confidence: 98.4,
              top: "30%",
              left: "64%",
              width: "26%",
              height: "38%",
            },
          ],
          recentEvents: [
            {
              time: "15:42:15",
              text: "OCR Placa 4821-KLP cotejada contra orden de despacho #8902",
              severity: "ok",
            },
          ],
        },
      ];
    }

    // DEFAULT RESTAURANTES & COCINAS PROFESIONALES
    return [
      {
        id: "cam-pase",
        name: "Pase de Cocina & Despacho",
        location: "Cocina Caliente · Estación 01",
        fps: 28,
        status: "alert",
        videoIndex: 1,
        detections: [
          {
            id: "det-1",
            label: "Pase Caliente · 4 Platos",
            sublabel: "Espera excesiva en mostrador",
            status: "alert",
            dwellTime: "07:18 min (>5m umbral)",
            confidence: 98.4,
            top: "22%",
            left: "14%",
            width: "36%",
            height: "44%",
            zonePolygon: true,
          },
          {
            id: "det-2",
            label: "Estación de Emplatado",
            sublabel: "Chef en producción",
            status: "ok",
            dwellTime: "01:45 min",
            confidence: 99.1,
            top: "18%",
            left: "58%",
            width: "32%",
            height: "48%",
          },
        ],
        recentEvents: [
          {
            time: "15:44:12",
            text: "Pase Caliente: 4 platos en espera superan 7 min sin retiro",
            severity: "alert",
          },
          {
            time: "15:41:05",
            text: "Mesa 04: Comanda servida con éxito tras 14 min de preparación",
            severity: "ok",
          },
          {
            time: "15:38:50",
            text: "Cocina Fría: Tiempo medio de salida 6.2 min (Ritmo Óptimo)",
            severity: "ok",
          },
        ],
      },
      {
        id: "cam-salon",
        name: "Salón Principal (Mesas 1–12)",
        location: "Área Central · Salón",
        fps: 30,
        status: "live",
        videoIndex: 0,
        detections: [
          {
            id: "det-3",
            label: "Mesa 04 · 4 Personas",
            sublabel: "Consumo finalizado · Esperando cuenta",
            status: "warning",
            dwellTime: "46:20 min (Rotación lenta)",
            confidence: 97.9,
            top: "20%",
            left: "10%",
            width: "32%",
            height: "38%",
          },
          {
            id: "det-4",
            label: "Mesa 08 · 2 Personas",
            sublabel: "Comensales almorzando",
            status: "ok",
            dwellTime: "21:10 min",
            confidence: 98.8,
            top: "18%",
            left: "52%",
            width: "34%",
            height: "40%",
          },
          {
            id: "det-5",
            label: "Pasillo Central Mozos",
            sublabel: "Flujo de servicio fluido",
            status: "ok",
            dwellTime: "Tránsito continuo",
            confidence: 99.4,
            top: "64%",
            left: "25%",
            width: "48%",
            height: "26%",
            zonePolygon: true,
          },
        ],
        recentEvents: [
          {
            time: "15:43:20",
            text: "Mesa 04: Tiempo en mesa supera 45 min · Sugerir cuenta",
            severity: "warning",
          },
          {
            time: "15:40:11",
            text: "Mesa 11: Mesa desocupada · Requiere limpieza para reasignar",
            severity: "warning",
          },
          {
            time: "15:36:04",
            text: "Rotación de mesa completada en Mesa 07 (39 min total)",
            severity: "ok",
          },
        ],
      },
      {
        id: "cam-barra",
        name: "Barra & Coctelería",
        location: "Área Frontal · Barra",
        fps: 25,
        status: "live",
        videoIndex: 2,
        detections: [
          {
            id: "det-6",
            label: "Barra Clientes · 3 personas",
            sublabel: "Tiempo de espera en orden",
            status: "ok",
            dwellTime: "03:10 min",
            confidence: 97.2,
            top: "24%",
            left: "18%",
            width: "38%",
            height: "48%",
          },
          {
            id: "det-7",
            label: "Estación Bartender",
            sublabel: "Preparación de cocteles en curso",
            status: "ok",
            dwellTime: "Activo",
            confidence: 99.0,
            top: "20%",
            left: "62%",
            width: "28%",
            height: "45%",
          },
        ],
        recentEvents: [
          {
            time: "15:42:00",
            text: "Barra: Tiempo de atención promedio 2.4 min por trago",
            severity: "ok",
          },
          {
            time: "15:35:18",
            text: "Ocupación de taburetes de barra al 60% (6/10)",
            severity: "ok",
          },
        ],
      },
      {
        id: "cam-acceso",
        name: "Entrada & Fila de Espera",
        location: "Recepción / Hostess",
        fps: 30,
        status: "live",
        videoIndex: 3,
        detections: [
          {
            id: "det-8",
            label: "Fila de Espera · 5 personas",
            sublabel: "Tiempo en fila dentro de límite",
            status: "ok",
            dwellTime: "04:30 min (Límite: 10m)",
            confidence: 98.5,
            top: "25%",
            left: "22%",
            width: "34%",
            height: "50%",
          },
          {
            id: "det-9",
            label: "Estación Hostess",
            sublabel: "Atención activa de ingresos",
            status: "ok",
            dwellTime: "Asignando mesas",
            confidence: 99.2,
            top: "20%",
            left: "64%",
            width: "26%",
            height: "45%",
          },
        ],
        recentEvents: [
          {
            time: "15:43:55",
            text: "Aforo total del restaurante: 76% (48/64 comensales)",
            severity: "ok",
          },
          {
            time: "15:39:10",
            text: "Fila de espera: 2 grupos atendidos en menos de 5 min",
            severity: "ok",
          },
        ],
      },
    ];
  };

  const activeFeeds = feeds && feeds.length > 0 ? feeds : getIndustryFeeds(industryId);
  const [selectedFeedIdx, setSelectedFeedIdx] = useState<number>(0);
  const currentFeed = activeFeeds[selectedFeedIdx] || activeFeeds[0];

  // AI Overlay Toggles
  const [showBoxes, setShowBoxes] = useState<boolean>(true);
  const [showDwell, setShowDwell] = useState<boolean>(true);
  const [showConfidence, setShowConfidence] = useState<boolean>(true);
  const [showPolygons, setShowPolygons] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  // Video player loop
  const player = useVideoPlayer(
    VIDEO_SOURCES[currentFeed.videoIndex % VIDEO_SOURCES.length],
    (p) => {
      p.loop = true;
      p.muted = isMuted;
      p.play();
    }
  );

  const getStatusColor = (status: BoundingBoxDetection["status"]) => {
    switch (status) {
      case "alert":
        return "#ef4444";
      case "warning":
        return "#f59e0b";
      case "info":
        return "#38bdf8";
      case "ok":
      default:
        return "#10b981";
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
      {/* 1. TOP HEADER & CAMERA TABS */}
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
              backgroundColor="rgba(33, 152, 244, 0.15)"
              alignItems="center"
              justifyContent="center"
              borderWidth={1}
              borderColor="rgba(33, 152, 244, 0.3)"
            >
              <CameraIcon size={18} color="#38bdf8" />
            </View>
            <YStack gap={1}>
              <XStack alignItems="center" gap={8}>
                <Text fontSize={14} fontWeight="800" color="#ffffff" fontFamily="$body">
                  MONITOR DE VIDEOANALÍTICA EN VIVO
                </Text>
                <View
                  backgroundColor="rgba(16, 185, 129, 0.15)"
                  paddingHorizontal={6}
                  paddingVertical={2}
                  borderRadius={4}
                  borderWidth={1}
                  borderColor="rgba(16, 185, 129, 0.3)"
                >
                  <Text fontSize={9.5} fontWeight="700" color="#34d399" fontFamily="$mono">
                    LIVE RTSP
                  </Text>
                </View>
              </XStack>
              <Text fontSize={11} color="#94a3b8" fontFamily="$body">
                Modelos de IA activos: Dwell Time · Ocupación · Conteo · Detección de Cuellos de
                Botella
              </Text>
            </YStack>
          </XStack>

          {/* Quick Metrics Badge */}
          <XStack alignItems="center" gap={12}>
            <XStack alignItems="center" gap={6}>
              <Zap size={14} color="#f59e0b" />
              <Text fontSize={11} fontWeight="700" color="#ffffff" fontFamily="$mono">
                {currentFeed.fps} FPS · 1080p
              </Text>
            </XStack>
            <XStack alignItems="center" gap={6}>
              <View
                width={7}
                height={7}
                borderRadius={4}
                backgroundColor={currentFeed.status === "alert" ? "#ef4444" : "#10b981"}
              />
              <Text fontSize={11} fontWeight="700" color="#ffffff" fontFamily="$mono">
                INFERENCIA IA 28ms
              </Text>
            </XStack>
          </XStack>
        </XStack>

        {/* CAMERA SELECTOR TABS */}
        <XStack gap={8} marginTop={12} flexWrap="wrap">
          {activeFeeds.map((feed, idx) => {
            const isSelected = idx === selectedFeedIdx;
            const hasAlert = feed.status === "alert";
            return (
              <TouchableOpacity
                key={feed.id}
                onPress={() => setSelectedFeedIdx(idx)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                  borderRadius: 8,
                  backgroundColor: isSelected
                    ? "rgba(33, 152, 244, 0.25)"
                    : "rgba(255, 255, 255, 0.05)",
                  borderWidth: 1,
                  borderColor: isSelected
                    ? "#38bdf8"
                    : hasAlert
                      ? "rgba(239, 68, 68, 0.4)"
                      : "rgba(255, 255, 255, 0.1)",
                }}
              >
                <View
                  width={6}
                  height={6}
                  borderRadius={3}
                  backgroundColor={
                    hasAlert ? "#ef4444" : isSelected ? "#38bdf8" : "rgba(255, 255, 255, 0.4)"
                  }
                />
                <Text
                  fontSize={11.5}
                  fontWeight={isSelected ? "800" : "600"}
                  color={isSelected ? "#ffffff" : "#94a3b8"}
                  fontFamily="$body"
                >
                  {feed.name}
                </Text>
                {hasAlert && (
                  <View
                    backgroundColor="#ef4444"
                    width={16}
                    height={16}
                    borderRadius={8}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize={9} fontWeight="900" color="#ffffff">
                      !
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </XStack>
      </View>

      {/* 2. VIDEO CANVAS WITH HUD BOUNDING BOXES */}
      <View
        height={isDesktop ? 440 : 280}
        backgroundColor="#000000"
        position="relative"
        overflow="hidden"
      >
        {/* Background Looping Video */}
        <VideoView
          style={StyleSheet.absoluteFillObject}
          player={player}
          contentFit="cover"
          allowsFullscreen={false}
        />

        {/* Vignette & scanline subtle overlay */}
        <View
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundColor="rgba(5, 14, 29, 0.15)"
          pointerEvents="none"
        />

        {/* HUD Grid Reticle Top & Bottom */}
        <View
          position="absolute"
          top={10}
          left={12}
          backgroundColor="rgba(0, 0, 0, 0.65)"
          paddingHorizontal={8}
          paddingVertical={4}
          borderRadius={6}
          borderWidth={1}
          borderColor="rgba(255, 255, 255, 0.15)"
          pointerEvents="none"
        >
          <Text fontSize={10} color="#38bdf8" fontWeight="700" fontFamily="$mono">
            REC ● {currentFeed.location.toUpperCase()}
          </Text>
        </View>

        <View
          position="absolute"
          top={10}
          right={12}
          backgroundColor="rgba(0, 0, 0, 0.65)"
          paddingHorizontal={8}
          paddingVertical={4}
          borderRadius={6}
          borderWidth={1}
          borderColor="rgba(255, 255, 255, 0.15)"
          pointerEvents="none"
        >
          <Text fontSize={10} color="#34d399" fontWeight="700" fontFamily="$mono">
            YOLOv11-VigIA · DETECCIÓN ACTIVA
          </Text>
        </View>

        {/* 3. BOUNDING BOXES & ZONES OVERLAY */}
        {showBoxes &&
          currentFeed.detections.map((det) => {
            const color = getStatusColor(det.status);
            const isAlert = det.status === "alert";

            return (
              <View
                key={det.id}
                position="absolute"
                top={det.top as any}
                left={det.left as any}
                width={det.width as any}
                height={det.height as any}
                borderWidth={2}
                borderColor={color}
                backgroundColor={
                  det.zonePolygon
                    ? isAlert
                      ? "rgba(239, 68, 68, 0.15)"
                      : "rgba(33, 152, 244, 0.1)"
                    : "transparent"
                }
                borderRadius={6}
                pointerEvents="none"
              >
                {/* HUD Corner Reticles */}
                <View
                  position="absolute"
                  top={-2}
                  left={-2}
                  width={8}
                  height={8}
                  borderTopWidth={3}
                  borderLeftWidth={3}
                  borderColor={color}
                />
                <View
                  position="absolute"
                  top={-2}
                  right={-2}
                  width={8}
                  height={8}
                  borderTopWidth={3}
                  borderRightWidth={3}
                  borderColor={color}
                />
                <View
                  position="absolute"
                  bottom={-2}
                  left={-2}
                  width={8}
                  height={8}
                  borderBottomWidth={3}
                  borderLeftWidth={3}
                  borderColor={color}
                />
                <View
                  position="absolute"
                  bottom={-2}
                  right={-2}
                  width={8}
                  height={8}
                  borderBottomWidth={3}
                  borderRightWidth={3}
                  borderColor={color}
                />

                {/* AI Detection Label Chip */}
                <View
                  position="absolute"
                  top={-24}
                  left={-2}
                  backgroundColor={color}
                  paddingHorizontal={6}
                  paddingVertical={2}
                  borderRadius={4}
                  flexDirection="row"
                  alignItems="center"
                  gap={4}
                >
                  <Text fontSize={10} fontWeight="800" color="#ffffff" fontFamily="$mono">
                    {det.label}
                  </Text>
                  {showConfidence && (
                    <Text
                      fontSize={9}
                      fontWeight="600"
                      color="rgba(255, 255, 255, 0.85)"
                      fontFamily="$mono"
                    >
                      {det.confidence}%
                    </Text>
                  )}
                </View>

                {/* Dwell Time & Status Sublabel */}
                {showDwell && det.dwellTime && (
                  <View
                    position="absolute"
                    bottom={4}
                    left={4}
                    right={4}
                    backgroundColor="rgba(5, 14, 29, 0.85)"
                    borderWidth={1}
                    borderColor={color}
                    paddingHorizontal={6}
                    paddingVertical={3}
                    borderRadius={4}
                  >
                    <XStack justifyContent="space-between" alignItems="center">
                      <XStack alignItems="center" gap={4}>
                        <Clock size={10} color={color} />
                        <Text fontSize={9.5} fontWeight="700" color="#ffffff" fontFamily="$mono">
                          {det.dwellTime}
                        </Text>
                      </XStack>
                      {det.sublabel && (
                        <Text
                          fontSize={9}
                          color="#cbd5e1"
                          fontFamily="$body"
                          numberOfLines={1}
                          flex={1}
                          textAlign="right"
                          marginLeft={4}
                        >
                          {det.sublabel}
                        </Text>
                      )}
                    </XStack>
                  </View>
                )}
              </View>
            );
          })}
      </View>

      {/* 4. AI CONTROLS BAR & LAYER TOGGLES */}
      <View
        backgroundColor="rgba(5, 14, 29, 0.95)"
        paddingHorizontal={16}
        paddingVertical={10}
        borderTopWidth={1}
        borderTopColor={colors.borderSoft}
      >
        <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={10}>
          {/* Layer toggles */}
          <XStack alignItems="center" gap={6} flexWrap="wrap">
            <XStack alignItems="center" gap={4} marginRight={6}>
              <SlidersHorizontal size={14} color="#94a3b8" />
              <Text fontSize={11} fontWeight="700" color="#94a3b8" fontFamily="$body">
                Capas de IA:
              </Text>
            </XStack>

            <TouchableOpacity
              onPress={() => setShowBoxes(!showBoxes)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                paddingHorizontal: 9,
                paddingVertical: 5,
                borderRadius: 6,
                backgroundColor: showBoxes
                  ? "rgba(33, 152, 244, 0.2)"
                  : "rgba(255, 255, 255, 0.05)",
                borderWidth: 1,
                borderColor: showBoxes ? "#38bdf8" : "rgba(255, 255, 255, 0.1)",
              }}
            >
              <View
                width={6}
                height={6}
                borderRadius={3}
                backgroundColor={showBoxes ? "#38bdf8" : "#64748b"}
              />
              <Text
                fontSize={10.5}
                fontWeight="700"
                color={showBoxes ? "#ffffff" : "#64748b"}
                fontFamily="$mono"
              >
                Cajas Detección
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowDwell(!showDwell)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                paddingHorizontal: 9,
                paddingVertical: 5,
                borderRadius: 6,
                backgroundColor: showDwell
                  ? "rgba(16, 185, 129, 0.2)"
                  : "rgba(255, 255, 255, 0.05)",
                borderWidth: 1,
                borderColor: showDwell ? "#34d399" : "rgba(255, 255, 255, 0.1)",
              }}
            >
              <View
                width={6}
                height={6}
                borderRadius={3}
                backgroundColor={showDwell ? "#34d399" : "#64748b"}
              />
              <Text
                fontSize={10.5}
                fontWeight="700"
                color={showDwell ? "#ffffff" : "#64748b"}
                fontFamily="$mono"
              >
                Dwell Time (Espera)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowConfidence(!showConfidence)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                paddingHorizontal: 9,
                paddingVertical: 5,
                borderRadius: 6,
                backgroundColor: showConfidence
                  ? "rgba(245, 158, 11, 0.2)"
                  : "rgba(255, 255, 255, 0.05)",
                borderWidth: 1,
                borderColor: showConfidence ? "#f59e0b" : "rgba(255, 255, 255, 0.1)",
              }}
            >
              <View
                width={6}
                height={6}
                borderRadius={3}
                backgroundColor={showConfidence ? "#f59e0b" : "#64748b"}
              />
              <Text
                fontSize={10.5}
                fontWeight="700"
                color={showConfidence ? "#ffffff" : "#64748b"}
                fontFamily="$mono"
              >
                Score Confianza %
              </Text>
            </TouchableOpacity>
          </XStack>

          {/* Audio toggle */}
          <XStack alignItems="center" gap={8}>
            <TouchableOpacity
              onPress={() => {
                const nextMuted = !isMuted;
                setIsMuted(nextMuted);
                player.muted = nextMuted;
              }}
              style={{
                padding: 6,
                borderRadius: 6,
                backgroundColor: "rgba(255, 255, 255, 0.06)",
              }}
            >
              {isMuted ? (
                <VolumeX size={15} color="#94a3b8" />
              ) : (
                <Volume2 size={15} color="#38bdf8" />
              )}
            </TouchableOpacity>
          </XStack>
        </XStack>

        {/* 5. LIVE EVENT TICKER STREAM */}
        <View
          marginTop={10}
          paddingTop={8}
          borderTopWidth={1}
          borderTopColor="rgba(255, 255, 255, 0.08)"
        >
          <XStack alignItems="center" gap={8}>
            <View
              backgroundColor="rgba(239, 68, 68, 0.2)"
              paddingHorizontal={6}
              paddingVertical={2}
              borderRadius={4}
              borderWidth={1}
              borderColor="rgba(239, 68, 68, 0.4)"
            >
              <Text fontSize={9.5} fontWeight="800" color="#f87171" fontFamily="$mono">
                FEED DE EVENTOS EN VIVO
              </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <XStack gap={14} alignItems="center">
                {currentFeed.recentEvents.map((evt, idx) => (
                  <XStack key={idx} alignItems="center" gap={6}>
                    <Text fontSize={10} color="#64748b" fontFamily="$mono">
                      [{evt.time}]
                    </Text>
                    <View
                      width={5}
                      height={5}
                      borderRadius={2.5}
                      backgroundColor={
                        evt.severity === "alert"
                          ? "#ef4444"
                          : evt.severity === "warning"
                            ? "#f59e0b"
                            : "#34d399"
                      }
                    />
                    <Text
                      fontSize={11}
                      color={
                        evt.severity === "alert"
                          ? "#fca5a5"
                          : evt.severity === "warning"
                            ? "#fde68a"
                            : "#e2e8f0"
                      }
                      fontFamily="$body"
                      fontWeight="600"
                    >
                      {evt.text}
                    </Text>
                  </XStack>
                ))}
              </XStack>
            </ScrollView>
          </XStack>
        </View>
      </View>
    </View>
  );
}

