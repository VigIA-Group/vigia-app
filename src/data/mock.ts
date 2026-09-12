// ============================================================
// VigIA — Mock Data
// Supermercado ficticio: "SuperFamilia Mercados S.A." — Cochabamba, Bolivia
// Snapshot simulado: martes 08 de septiembre de 2026, 15:45
// ============================================================

export type ModuleId = "ocr" | "people" | "intrusion" | "stolen" | "fall" | "tampering";

export type Severity = "ALTA" | "MEDIA" | "BAJA";

export type CameraStatus = "online" | "offline" | "alert";

export type UserRole = "Administrador" | "Operador" | "Solo lectura";

export type LicensePlan = "STARTER" | "PRO";

// ─────────────────────────────────────────────────────────────
// MÓDULOS
// ─────────────────────────────────────────────────────────────

export interface Module {
  id: ModuleId;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  color: string;
  stat: string;
  statLabel: string;
  whatItDetects: string[];
  howToUse: string;
  valueGenerated: string;
}

export const MODULES: Module[] = [
  {
    id: "ocr",
    name: "OCR y Placas",
    description: "Reconocimiento óptico de placas vehiculares y textos",
    icon: "ScanLine",
    color: "#6366f1",
    stat: "147",
    statLabel: "Placas hoy",
    whatItDetects: [
      "Placas vehiculares de vehículos en movimiento o estáticos",
      "Textos en carteles, embalajes y documentos",
      "Números de serie y códigos de barras visibles",
      "Vehículos no autorizados en zonas restringidas",
    ],
    howToUse:
      "Configura las zonas de detección en el mapa de la cámara. Edita la lista blanca de placas autorizadas en Ajustes > OCR. La alerta se dispara automáticamente cuando aparece una placa no registrada.",
    valueGenerated:
      "Reduce el tiempo de control vehicular en un 80%, elimina el registro manual de ingresos y genera reportes de tráfico automáticos para auditorías.",
  },
  {
    id: "people",
    name: "Análisis de Personas",
    description: "Conteo, seguimiento y análisis de flujo de clientes",
    icon: "Users",
    color: "#3b82f6",
    stat: "1,204",
    statLabel: "Personas hoy",
    whatItDetects: [
      "Conteo bidireccional de personas en entradas y salidas",
      "Densidad de clientes por zona y hora",
      "Tiempo de permanencia en pasillos o áreas específicas",
      "Colas de más de 3 personas en cajas",
    ],
    howToUse:
      "Define las líneas de conteo virtuales sobre la imagen de la cámara. Configura umbrales de densidad para recibir alertas antes de que se formen cuellos de botella.",
    valueGenerated:
      "Optimiza la distribución de personal según el flujo real, identifica las horas pico con precisión y mejora la experiencia del cliente reduciendo tiempos de espera.",
  },
  {
    id: "intrusion",
    name: "Intrusión y Perímetros",
    description: "Detección de acceso a zonas restringidas y perímetros",
    icon: "ShieldAlert",
    color: "#fbbf24",
    stat: "2",
    statLabel: "Alertas hoy",
    whatItDetects: [
      "Personas cruzando líneas virtuales de perímetro",
      "Acceso a áreas restringidas fuera de horario",
      "Permanencia prolongada en zonas sensibles",
      "Merodeadores en perímetro del edificio",
    ],
    howToUse:
      "Dibuja los polígonos de zona restringida sobre el mapa de la cámara. Establece horarios de activación para cada zona (ej. solo nocturno para depósito).",
    valueGenerated:
      "Previene pérdidas por acceso no autorizado, elimina rondas nocturnas manuales y genera evidencia legal ante incidentes de seguridad.",
  },
  {
    id: "stolen",
    name: "Objetos Robados",
    description: "Detección de sustracción y manipulación de productos",
    icon: "PackageX",
    color: "#f87171",
    stat: "1",
    statLabel: "Incidentes hoy",
    whatItDetects: [
      "Productos retirados de estantes sin escanear",
      "Objetos ocultados en ropa o bolsos",
      "Artículos de alto valor manipulados sospechosamente",
      "Cambio de etiquetas de precio",
    ],
    howToUse:
      "Marca las zonas de alta rotación de merma en el mapa de piso. El sistema aprende los patrones de comportamiento normal y alerta ante desviaciones estadísticas.",
    valueGenerated:
      "Reduce la merma desconocida hasta un 65%, identifica patrones de robo sistemático y focaliza la atención del personal en las zonas críticas.",
  },
  {
    id: "fall",
    name: "Caídas y Movimiento",
    description: "Detección de caídas, desmayos y comportamientos anómalos",
    icon: "PersonStanding",
    color: "#fb923c",
    stat: "0",
    statLabel: "Eventos hoy",
    whatItDetects: [
      "Caídas de personas al suelo",
      "Personas que permanecen inmóviles en el piso por más de 10 segundos",
      "Comportamientos de movimiento anómalos",
      "Corridas o movimientos bruscos en tienda",
    ],
    howToUse:
      "Activa el módulo en las cámaras que cubren áreas peatonales. Configura el tiempo mínimo de inmovilidad antes de emitir alerta (recomendado: 8 segundos).",
    valueGenerated:
      "Reduce el tiempo de respuesta ante emergencias médicas, minimiza la responsabilidad legal por accidentes no atendidos y mejora la seguridad del cliente.",
  },
  {
    id: "tampering",
    name: "Clasificación y Tampering",
    description: "Clasificación de objetos y detección de manipulación de cámaras",
    icon: "Camera",
    color: "#a78bfa",
    stat: "12",
    statLabel: "Objetos hoy",
    whatItDetects: [
      "Manipulación física o bloqueo de cámaras",
      "Cambios bruscos en el ángulo de visión",
      "Clasificación de tipos de vehículos y objetos",
      "Abandono de paquetes o bolsas en zonas de paso",
    ],
    howToUse:
      "El módulo de tampering corre en segundo plano en todas las cámaras automáticamente. Para clasificación, define las categorías de objetos de interés en Ajustes > Clasificación.",
    valueGenerated:
      "Garantiza la integridad del sistema de videovigilancia, detecta intentos de sabotaje antes de que ocurra un incidente y provee clasificación automática de inventario.",
  },
];

// ─────────────────────────────────────────────────────────────
// CÁMARAS
// ─────────────────────────────────────────────────────────────

export interface Camera {
  id: string;
  name: string;
  zone: string;
  floor: "Planta baja" | "Planta alta" | "Exterior";
  room: string; // sector / habitación específica
  activeModules: ModuleId[];
  status: CameraStatus;
  metrics: {
    peopleDetected: number;
    alertsToday: number;
    uptimePercent: number;
  };
  description: string;
}

export const CAMERAS: Camera[] = [
  {
    id: "cam-001",
    name: "Entrada Principal",
    zone: "Acceso Norte",
    floor: "Planta baja",
    room: "Hall de Acceso",
    activeModules: ["ocr", "people", "intrusion"],
    status: "online",
    metrics: { peopleDetected: 412, alertsToday: 1, uptimePercent: 99.8 },
    description: "Cámara de entrada al supermercado, cobertura de puerta giratoria",
  },
  {
    id: "cam-002",
    name: "Caja Central",
    zone: "Área de Cajas",
    floor: "Planta baja",
    room: "Sector Cajas 1–12",
    activeModules: ["people", "stolen"],
    status: "online",
    metrics: { peopleDetected: 318, alertsToday: 0, uptimePercent: 100 },
    description: "Vista panorámica de las 12 cajas registradoras",
  },
  {
    id: "cam-003",
    name: "Bodega Principal",
    zone: "Almacén",
    floor: "Planta baja",
    room: "Bodega Fría y Seca",
    activeModules: ["intrusion", "fall"],
    status: "alert",
    metrics: { peopleDetected: 24, alertsToday: 2, uptimePercent: 98.5 },
    description: "Zona de almacenamiento fría y seca, acceso restringido",
  },
  {
    id: "cam-004",
    name: "Pasillos Centro",
    zone: "Área de Góndolas",
    floor: "Planta baja",
    room: "Pasillo Góndolas 3–8",
    activeModules: ["people", "stolen", "fall"],
    status: "online",
    metrics: { peopleDetected: 276, alertsToday: 1, uptimePercent: 100 },
    description: "Cobertura de pasillos 3 al 8, zona de mayor tráfico",
  },
  {
    id: "cam-005",
    name: "Parqueo Externo",
    zone: "Estacionamiento",
    floor: "Exterior",
    room: "Parqueo 80 vehículos",
    activeModules: ["ocr", "intrusion"],
    status: "online",
    metrics: { peopleDetected: 147, alertsToday: 0, uptimePercent: 97.2 },
    description: "Vista del parqueo para 80 vehículos, entrada y salida",
  },
  {
    id: "cam-006",
    name: "Sector Bebidas",
    zone: "Área de Góndolas",
    floor: "Planta baja",
    room: "Sector Bebidas y Snacks",
    activeModules: ["people", "tampering"],
    status: "online",
    metrics: { peopleDetected: 89, alertsToday: 0, uptimePercent: 100 },
    description: "Pasillo de bebidas, snacks y productos envasados",
  },
  {
    id: "cam-007",
    name: "Planta Alta — Oficinas",
    zone: "Administración",
    floor: "Planta alta",
    room: "Pasillo Oficinas",
    activeModules: ["intrusion", "tampering"],
    status: "offline",
    metrics: { peopleDetected: 0, alertsToday: 0, uptimePercent: 0 },
    description: "Pasillo de acceso a oficinas administrativas",
  },
  {
    id: "cam-008",
    name: "Salida de Emergencia",
    zone: "Acceso Sur",
    floor: "Planta baja",
    room: "Puerta Sur",
    activeModules: ["intrusion"],
    status: "online",
    metrics: { peopleDetected: 12, alertsToday: 0, uptimePercent: 99.1 },
    description: "Puerta de emergencia sur, solo salida autorizada",
  },
];

// ─────────────────────────────────────────────────────────────
// EVENTOS / ALERTAS
// ─────────────────────────────────────────────────────────────

export interface EventItem {
  id: string;
  type: string;
  module: ModuleId;
  cameraId: string;
  cameraName: string;
  severity: Severity;
  timestamp: string; // ISO string
  description: string;
  reviewed: boolean;
  hasVideoClip: boolean;
}

// "Ahora" simulado del dashboard. Todo timestamp relativo (hoursAgo/daysAgo)
// y todo texto relativo en la UI (getRelativeTime) debe basarse en este valor,
// NO en la fecha real del dispositivo — así el demo se ve igual de "vivo"
// sin importar qué día se presente.
const now = new Date("2026-09-08T15:45:00-04:00");

function hoursAgo(h: number): string {
  const d = new Date(now.getTime() - h * 60 * 60 * 1000);
  return d.toISOString();
}

function daysAgo(d: number, hour = "09:15"): string {
  const date = new Date(now);
  date.setDate(date.getDate() - d);
  const [h, m] = hour.split(":").map(Number);
  date.setHours(h, m, 0, 0);
  return date.toISOString();
}

export const EVENTS: EventItem[] = [
  {
    id: "evt-001",
    type: "Acceso no autorizado a bodega",
    module: "intrusion",
    cameraId: "cam-003",
    cameraName: "Bodega Principal",
    severity: "ALTA",
    timestamp: hoursAgo(0.5),
    description:
      "Persona detectada en zona restringida fuera de horario de acceso permitido (06:00–18:00). Permanencia de 4 minutos sin autorización.",
    reviewed: false,
    hasVideoClip: true,
  },
  {
    id: "evt-002",
    type: "Placa no registrada en parqueo",
    module: "ocr",
    cameraId: "cam-005",
    cameraName: "Parqueo Externo",
    severity: "MEDIA",
    timestamp: hoursAgo(1.2),
    description:
      "Vehículo con placa 3456-BLP no aparece en lista blanca de proveedores ni clientes VIP. Tercera visita en el día.",
    reviewed: false,
    hasVideoClip: false,
  },
  {
    id: "evt-003",
    type: "Comportamiento sospechoso en góndola",
    module: "stolen",
    cameraId: "cam-004",
    cameraName: "Pasillos Centro",
    severity: "ALTA",
    timestamp: hoursAgo(2.1),
    description:
      "Persona permanece 8 minutos frente a góndola de electrónicos con movimientos repetitivos. Posible intento de hurto de artículo de alta rotación.",
    reviewed: false,
    hasVideoClip: true,
  },
  {
    id: "evt-004",
    type: "Acceso a zona de carga",
    module: "intrusion",
    cameraId: "cam-003",
    cameraName: "Bodega Principal",
    severity: "MEDIA",
    timestamp: hoursAgo(3.5),
    description:
      "Empleado accedió a zona de carga refrigerada sin registrar la entrada en el sistema de control de acceso.",
    reviewed: true,
    hasVideoClip: false,
  },
  {
    id: "evt-005",
    type: "Cola excesiva en cajas",
    module: "people",
    cameraId: "cam-002",
    cameraName: "Caja Central",
    severity: "BAJA",
    timestamp: hoursAgo(4),
    description:
      "Se detectaron más de 8 personas en cola simultánea en cajas 4, 5 y 6. Tiempo de espera estimado superior a 12 minutos.",
    reviewed: true,
    hasVideoClip: false,
  },
  {
    id: "evt-006",
    type: "Persona en el suelo",
    module: "fall",
    cameraId: "cam-004",
    cameraName: "Pasillos Centro",
    severity: "ALTA",
    timestamp: daysAgo(1, "16:20"),
    description:
      "Cliente detectado inmóvil en el piso del pasillo 5 por más de 12 segundos. Personal de seguridad respondió en 2 minutos. Resultado: resbalón sin gravedad.",
    reviewed: true,
    hasVideoClip: true,
  },
  {
    id: "evt-007",
    type: "Intento de manipulación de cámara",
    module: "tampering",
    cameraId: "cam-007",
    cameraName: "Planta Alta — Oficinas",
    severity: "ALTA",
    timestamp: daysAgo(1, "23:47"),
    description:
      "Cambio brusco en el ángulo de la cámara detectado. La cámara quedó offline inmediatamente después. Se requiere revisión física del hardware.",
    reviewed: false,
    hasVideoClip: true,
  },
  {
    id: "evt-008",
    type: "Vehículo sospechoso en parqueo",
    module: "ocr",
    cameraId: "cam-005",
    cameraName: "Parqueo Externo",
    severity: "MEDIA",
    timestamp: daysAgo(1, "21:15"),
    description:
      "Vehículo estacionado fuera de horario de atención (22:30). Sin movimiento por más de 45 minutos. Placa: 7891-PAZ.",
    reviewed: true,
    hasVideoClip: false,
  },
  {
    id: "evt-009",
    type: "Merma detectada en bebidas",
    module: "stolen",
    cameraId: "cam-006",
    cameraName: "Sector Bebidas",
    severity: "BAJA",
    timestamp: daysAgo(1, "14:22"),
    description:
      "Producto retirado del sector de bebidas sin pasar por caja registradora. Item estimado: pack de cervezas, aprox. Bs. 85.",
    reviewed: true,
    hasVideoClip: true,
  },
  {
    id: "evt-010",
    type: "Alta densidad en entrada",
    module: "people",
    cameraId: "cam-001",
    cameraName: "Entrada Principal",
    severity: "BAJA",
    timestamp: daysAgo(1, "11:30"),
    description:
      "Más de 45 personas por minuto ingresando durante la hora pico del mediodía. Umbral configurado: 35 personas/min.",
    reviewed: true,
    hasVideoClip: false,
  },
  {
    id: "evt-011",
    type: "Persona en zona restringida nocturna",
    module: "intrusion",
    cameraId: "cam-008",
    cameraName: "Salida de Emergencia",
    severity: "ALTA",
    timestamp: daysAgo(2, "02:15"),
    description:
      "Silueta detectada intentando abrir la puerta de emergencia sur desde afuera. Alarma sonora activada. Sin acceso logrado.",
    reviewed: true,
    hasVideoClip: true,
  },
  {
    id: "evt-012",
    type: "Comportamiento anómalo detectado",
    module: "fall",
    cameraId: "cam-001",
    cameraName: "Entrada Principal",
    severity: "MEDIA",
    timestamp: daysAgo(2, "16:45"),
    description:
      "Persona corriendo dentro del supermercado detectada en la zona de entrada. Seguridad verificó sin incidente grave.",
    reviewed: true,
    hasVideoClip: false,
  },
  // NUEVO — se agregaron para que el insight "3 caídas en 7 días, todas en
  // Pasillos Centro entre 15:00–17:00" (ver INSIGHTS, ins-002) esté respaldado
  // por eventos reales y verificables, no solo por texto.
  {
    id: "evt-013",
    type: "Persona en el suelo",
    module: "fall",
    cameraId: "cam-004",
    cameraName: "Pasillos Centro",
    severity: "MEDIA",
    timestamp: daysAgo(3, "15:40"),
    description:
      "Cliente tropezó cerca de la góndola de lácteos y cayó sin lograr levantarse de inmediato. Personal de piso asistió en menos de 1 minuto.",
    reviewed: true,
    hasVideoClip: true,
  },
  {
    id: "evt-014",
    type: "Persona en el suelo",
    module: "fall",
    cameraId: "cam-004",
    cameraName: "Pasillos Centro",
    severity: "BAJA",
    timestamp: daysAgo(6, "16:05"),
    description:
      "Adulto mayor se sentó momentáneamente en el suelo del pasillo por fatiga. No requirió asistencia médica.",
    reviewed: true,
    hasVideoClip: false,
  },
];

// ─────────────────────────────────────────────────────────────
// USUARIO
// ─────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  location: string;
  activeCameras: number;
  initials: string;
}

export const USER: UserProfile = {
  id: "usr-001",
  name: "Fabián",
  email: "fabian@superfamilia.com.bo",
  role: "Administrador",
  organization: "SuperFamilia Mercados S.A.",
  location: "Av. Blanco Galindo N° 3450, Cochabamba, Bolivia",
  activeCameras: 7,
  initials: "AF",
};

// ─────────────────────────────────────────────────────────────
// LICENCIA
// ─────────────────────────────────────────────────────────────

export interface License {
  plan: LicensePlan;
  camerasUsed: number;
  camerasTotal: number;
  expiresAt: string; // ISO date string
  daysRemaining: number;
  startedAt: string;
  monthlyPrice: number;
  currency: string;
}

export const LICENSE: License = {
  plan: "PRO",
  camerasUsed: 8,
  camerasTotal: 30,
  expiresAt: "2026-11-15T00:00:00-04:00",
  daysRemaining: 68,
  startedAt: "2025-11-15T00:00:00-04:00",
  monthlyPrice: 349,
  currency: "USD",
};

// ─────────────────────────────────────────────────────────────
// KPIs (Dashboard)
// ─────────────────────────────────────────────────────────────

export interface KPI {
  id: string;
  label: string;
  value: string;
  change: string;
  changePositive: boolean;
  accentColor: string;
  icon: string;
}

export const KPIs: KPI[] = [
  {
    id: "kpi-traffic",
    label: "Personas hoy",
    value: "1,204",
    change: "+8.2%",
    changePositive: true,
    accentColor: "#3b82f6",
    icon: "Users",
  },
  {
    id: "kpi-alerts",
    label: "Alertas activas",
    value: "3",
    change: "+1",
    changePositive: false,
    accentColor: "#f87171",
    icon: "AlertTriangle",
  },
  {
    id: "kpi-dwell",
    label: "Permanencia prom.",
    value: "22 min",
    change: "+1.4 min",
    changePositive: true,
    accentColor: "#a78bfa",
    icon: "Timer",
  },
  {
    id: "kpi-uptime",
    label: "Cámaras activas",
    value: "7/8",
    change: "99.2%",
    changePositive: true,
    accentColor: "#34d399",
    icon: "Cctv",
  },
];

// ─────────────────────────────────────────────────────────────
// HEATMAP DATA (mini heatmap del dashboard — 12x4 grid)
// ─────────────────────────────────────────────────────────────

export const HEATMAP_DATA: number[][] = [
  [0.1, 0.2, 0.4, 0.6, 0.9, 1.0, 0.8, 0.7, 0.5, 0.4, 0.2, 0.1],
  [0.2, 0.3, 0.5, 0.8, 1.0, 1.0, 0.9, 0.8, 0.6, 0.5, 0.3, 0.2],
  [0.1, 0.2, 0.4, 0.7, 0.9, 1.0, 0.8, 0.7, 0.5, 0.3, 0.2, 0.1],
  [0.1, 0.1, 0.3, 0.5, 0.7, 0.8, 0.6, 0.5, 0.4, 0.2, 0.1, 0.1],
];

// ─────────────────────────────────────────────────────────────
// PLANES DE LICENCIA
// ─────────────────────────────────────────────────────────────

export const LICENSE_PLANS = [
  {
    id: "STARTER" as LicensePlan,
    price: 149,
    currency: "USD",
    maxCameras: 8,
    description: "Ideal para negocios medianos con hasta 8 puntos de control.",
    features: [
      "Hasta 8 cámaras",
      "Todos los módulos de IA incluidos",
      "Historial de 30 días",
      "Soporte por email",
    ],
  },
  {
    id: "PRO" as LicensePlan,
    price: 349,
    currency: "USD",
    maxCameras: 30,
    description: "Para grandes superficies y cadenas con múltiples sucursales.",
    features: [
      "Hasta 30 cámaras",
      "Todos los módulos de IA incluidos",
      "Historial de 90 días",
      "Soporte prioritario 24/7",
      "API de integración incluida",
      "Reportes automáticos PDF",
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

export function getModuleById(id: ModuleId): Module {
  return MODULES.find((m) => m.id === id)!;
}

export function getCameraById(id: string): Camera | undefined {
  return CAMERAS.find((c) => c.id === id);
}

export function getEventsByCameraId(cameraId: string): EventItem[] {
  return EVENTS.filter((e) => e.cameraId === cameraId);
}

export function getUnreviewedCount(): number {
  return EVENTS.filter((e) => !e.reviewed).length;
}

export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getRelativeTime(iso: string): string {
  // Usa el "ahora" simulado del dashboard (no la fecha real del dispositivo)
  // para que los tiempos relativos ("hace 2h") tengan sentido sin importar
  // qué día se ejecute o presente el demo.
  const reference = now;
  const date = new Date(iso);
  const diff = Math.floor((reference.getTime() - date.getTime()) / 1000);

  if (diff < 60) return "Ahora";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return formatTimestamp(iso);
}

export function groupEventsByDate(events: EventItem[]): { label: string; data: EventItem[] }[] {
  const groups: Record<string, EventItem[]> = {};

  events.forEach((event) => {
    const date = new Date(event.timestamp);
    const today = now;
    const yesterday = new Date(now);
    yesterday.setDate(today.getDate() - 1);

    let label: string;
    if (date.toDateString() === today.toDateString()) {
      label = "Hoy";
    } else if (date.toDateString() === yesterday.toDateString()) {
      label = "Ayer";
    } else {
      label = date.toLocaleDateString("es-BO", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
    }

    if (!groups[label]) groups[label] = [];
    groups[label].push(event);
  });

  return Object.entries(groups).map(([label, data]) => ({ label, data }));
}

// ─────────────────────────────────────────────────────────────
// DATOS DE REPORTES — Gráficos por día (últimos 7 días, hasta 08/09)
// ─────────────────────────────────────────────────────────────

export interface DailyPeoplePoint {
  [key: string]: unknown;
  day: string;
  date: string;
  count: number;
}

export interface DailyAlertsPoint {
  [key: string]: unknown;
  day: string;
  date: string;
  intrusion: number;
  stolen: number;
  fall: number;
  ocr: number;
  people: number;
  tampering: number;
}

export interface HourlyActivityPoint {
  [key: string]: unknown;
  hour: string;
  count: number;
}

export const DAILY_PEOPLE_7D: DailyPeoplePoint[] = [
  { day: "Mié", date: "02/09", count: 1087 },
  { day: "Jue", date: "03/09", count: 1143 },
  { day: "Vie", date: "04/09", count: 1389 },
  { day: "Sáb", date: "05/09", count: 1820 },
  { day: "Dom", date: "06/09", count: 1654 },
  { day: "Lun", date: "07/09", count: 978 },
  { day: "Mar", date: "08/09", count: 1204 },
];

// fall: redistribuido para coincidir exactamente con las fechas reales de
// los eventos de caída en EVENTS (evt-006, evt-013, evt-014, evt-012).
export const DAILY_ALERTS_7D: DailyAlertsPoint[] = [
  { day: "Mié", date: "02/09", intrusion: 1, stolen: 0, fall: 1, ocr: 2, people: 1, tampering: 0 },
  { day: "Jue", date: "03/09", intrusion: 0, stolen: 1, fall: 0, ocr: 1, people: 0, tampering: 0 },
  { day: "Vie", date: "04/09", intrusion: 2, stolen: 1, fall: 0, ocr: 3, people: 2, tampering: 0 },
  { day: "Sáb", date: "05/09", intrusion: 3, stolen: 2, fall: 1, ocr: 4, people: 3, tampering: 1 },
  { day: "Dom", date: "06/09", intrusion: 2, stolen: 1, fall: 1, ocr: 2, people: 1, tampering: 0 },
  { day: "Lun", date: "07/09", intrusion: 1, stolen: 0, fall: 1, ocr: 1, people: 0, tampering: 0 },
  { day: "Mar", date: "08/09", intrusion: 2, stolen: 1, fall: 0, ocr: 1, people: 1, tampering: 1 },
];

export const HOURLY_ACTIVITY_TODAY: HourlyActivityPoint[] = [
  { hour: "06", count: 30 },
  { hour: "07", count: 61 },
  { hour: "08", count: 94 },
  { hour: "09", count: 125 },
  { hour: "10", count: 148 },
  { hour: "11", count: 137 },
  { hour: "12", count: 62 },
  { hour: "13", count: 54 },
  { hour: "14", count: 100 },
  { hour: "15", count: 118 },
  { hour: "16", count: 102 },
  { hour: "17", count: 79 },
  { hour: "18", count: 48 },
  { hour: "19", count: 32 },
  { hour: "20", count: 10 },
  { hour: "21", count: 4 },
];
// Nota: la suma de este arreglo es exactamente 1,204 — coincide con
// KPIs["kpi-traffic"].value y con el último punto de DAILY_PEOPLE_7D.

// Alertas por módulo totalizadas (para donut / barra horizontal).
// Es la suma por columna de DAILY_ALERTS_7D — verificado, cuadra exacto.
export const ALERTS_BY_MODULE = [
  { moduleId: "intrusion" as ModuleId, label: "Intrusión", count: 11, color: "#fbbf24" },
  { moduleId: "ocr" as ModuleId, label: "OCR / Placas", count: 14, color: "#6366f1" },
  { moduleId: "stolen" as ModuleId, label: "Obj. Robados", count: 6, color: "#f87171" },
  { moduleId: "people" as ModuleId, label: "Personas", count: 8, color: "#3b82f6" },
  { moduleId: "fall" as ModuleId, label: "Caídas", count: 4, color: "#fb923c" },
  { moduleId: "tampering" as ModuleId, label: "Tampering", count: 2, color: "#a78bfa" },
];

// ─────────────────────────────────────────────────────────────
// CONFIGURACIÓN — Horarios de módulos por cámara
// ─────────────────────────────────────────────────────────────

export interface ModuleSchedule {
  id: string;
  cameraId: string;
  moduleId: ModuleId;
  startHour: number; // 0–23
  endHour: number; // 0–23
  activeDays: number[]; // 0=Dom, 1=Lun ... 6=Sáb
  enabled: boolean;
}

export const MODULE_SCHEDULES: ModuleSchedule[] = [
  {
    id: "sch-001",
    cameraId: "cam-001",
    moduleId: "people",
    startHour: 6,
    endHour: 22,
    activeDays: [0, 1, 2, 3, 4, 5, 6],
    enabled: true,
  },
  {
    id: "sch-002",
    cameraId: "cam-001",
    moduleId: "ocr",
    startHour: 6,
    endHour: 22,
    activeDays: [0, 1, 2, 3, 4, 5, 6],
    enabled: true,
  },
  {
    id: "sch-003",
    cameraId: "cam-001",
    moduleId: "intrusion",
    startHour: 22,
    endHour: 6,
    activeDays: [0, 1, 2, 3, 4, 5, 6],
    enabled: true,
  },
  {
    id: "sch-004",
    cameraId: "cam-003",
    moduleId: "intrusion",
    startHour: 18,
    endHour: 6,
    activeDays: [0, 1, 2, 3, 4, 5, 6],
    enabled: true,
  },
  {
    id: "sch-005",
    cameraId: "cam-003",
    moduleId: "fall",
    startHour: 6,
    endHour: 22,
    activeDays: [1, 2, 3, 4, 5],
    enabled: true,
  },
  {
    id: "sch-006",
    cameraId: "cam-005",
    moduleId: "ocr",
    startHour: 0,
    endHour: 24,
    activeDays: [0, 1, 2, 3, 4, 5, 6],
    enabled: true,
  },
  {
    id: "sch-007",
    cameraId: "cam-005",
    moduleId: "intrusion",
    startHour: 20,
    endHour: 7,
    activeDays: [0, 1, 2, 3, 4, 5, 6],
    enabled: false,
  },
];

export function getSchedulesByCameraId(cameraId: string): ModuleSchedule[] {
  return MODULE_SCHEDULES.filter((s) => s.cameraId === cameraId);
}

// ─────────────────────────────────────────────────────────────
// DATOS DE REPORTES — Últimos 31 días (09 ago – 08 sep 2026)
// ─────────────────────────────────────────────────────────────

export const DAILY_PEOPLE_30D: DailyPeoplePoint[] = [
  { day: "09/08", date: "09/08", count: 1567 },
  { day: "10/08", date: "10/08", count: 912 },
  { day: "11/08", date: "11/08", count: 1034 },
  { day: "12/08", date: "12/08", count: 1089 },
  { day: "13/08", date: "13/08", count: 1156 },
  { day: "14/08", date: "14/08", count: 1387 },
  { day: "15/08", date: "15/08", count: 1798 },
  { day: "16/08", date: "16/08", count: 1634 },
  { day: "17/08", date: "17/08", count: 934 },
  { day: "18/08", date: "18/08", count: 1067 },
  { day: "19/08", date: "19/08", count: 1102 },
  { day: "20/08", date: "20/08", count: 1178 },
  { day: "21/08", date: "21/08", count: 1421 },
  { day: "22/08", date: "22/08", count: 1756 },
  { day: "23/08", date: "23/08", count: 1589 },
  { day: "24/08", date: "24/08", count: 901 },
  { day: "25/08", date: "25/08", count: 1023 },
  { day: "26/08", date: "26/08", count: 1090 },
  { day: "27/08", date: "27/08", count: 1132 },
  { day: "28/08", date: "28/08", count: 1356 },
  { day: "29/08", date: "29/08", count: 1689 },
  { day: "30/08", date: "30/08", count: 1612 },
  { day: "31/08", date: "31/08", count: 945 },
  { day: "01/09", date: "01/09", count: 1056 },
  { day: "02/09", date: "02/09", count: 1087 },
  { day: "03/09", date: "03/09", count: 1143 },
  { day: "04/09", date: "04/09", count: 1389 },
  { day: "05/09", date: "05/09", count: 1820 },
  { day: "06/09", date: "06/09", count: 1654 },
  { day: "07/09", date: "07/09", count: 978 },
  { day: "08/09", date: "08/09", count: 1204 },
];

// Período anterior (7 días previos, para comparación)
export const DAILY_PEOPLE_7D_PREV: DailyPeoplePoint[] = [
  { day: "Mié", date: "26/08", count: 1090 },
  { day: "Jue", date: "27/08", count: 1132 },
  { day: "Vie", date: "28/08", count: 1356 },
  { day: "Sáb", date: "29/08", count: 1689 },
  { day: "Dom", date: "30/08", count: 1612 },
  { day: "Lun", date: "31/08", count: 945 },
  { day: "Mar", date: "01/09", count: 1056 },
];

// ─────────────────────────────────────────────────────────────
// NUEVO — CONVERSIÓN: personas contadas vs. transacciones registradas
// Esta es la métrica que el pitch de VigIA vende como el gran ausente en el
// retail boliviano: "sin conteo de personas no hay tasa de conversión".
// ─────────────────────────────────────────────────────────────

export interface ConversionPoint {
  [key: string]: unknown;
  day: string;
  date: string;
  visitors: number;
  transactions: number;
  conversionRate: number; // %
}

export const CONVERSION_7D: ConversionPoint[] = [
  { day: "Mié", date: "02/09", visitors: 1087, transactions: 890, conversionRate: 81.9 },
  { day: "Jue", date: "03/09", visitors: 1143, transactions: 945, conversionRate: 82.7 },
  { day: "Vie", date: "04/09", visitors: 1389, transactions: 1120, conversionRate: 80.6 },
  { day: "Sáb", date: "05/09", visitors: 1820, transactions: 1410, conversionRate: 77.5 },
  { day: "Dom", date: "06/09", visitors: 1654, transactions: 1260, conversionRate: 76.2 },
  { day: "Lun", date: "07/09", visitors: 978, transactions: 845, conversionRate: 86.4 },
  { day: "Mar", date: "08/09", visitors: 1204, transactions: 1020, conversionRate: 84.7 },
];

export function getAverageConversionRate(): number {
  const rates = CONVERSION_7D.map((d) => d.conversionRate);
  return Number((rates.reduce((a, b) => a + b, 0) / rates.length).toFixed(1));
}

// NUEVO — KPI de conversión. No se agregó directamente al array KPIs de arriba
// para no romper un grid de 4 columnas ya existente en el front-end; el prompt
// de Antigravity indica cómo incorporarlo como 5ta tarjeta.
export const CONVERSION_KPI: KPI = {
  id: "kpi-conversion",
  label: "Conversión promedio",
  value: `${getAverageConversionRate()}%`,
  change: "+2.1 pts",
  changePositive: true,
  accentColor: "#22c55e",
  icon: "ShoppingCart",
};

// ─────────────────────────────────────────────────────────────
// NUEVO — Tiempo de permanencia por zona (clientes, no personal)
// Las 4 zonas suman ~22 min, coincide con KPIs["kpi-dwell"].value.
// ─────────────────────────────────────────────────────────────

export interface ZoneDwellTime {
  zone: string;
  cameraId: string;
  avgMinutes: number;
}

export const ZONE_DWELL_TIME: ZoneDwellTime[] = [
  { zone: "Entrada", cameraId: "cam-001", avgMinutes: 1.0 },
  { zone: "Área de Cajas", cameraId: "cam-002", avgMinutes: 5.4 },
  { zone: "Pasillos Centro (Góndolas)", cameraId: "cam-004", avgMinutes: 11.8 },
  { zone: "Sector Bebidas y Snacks", cameraId: "cam-006", avgMinutes: 3.8 },
];

// ─────────────────────────────────────────────────────────────
// DATOS POR CÁMARA — Afluencia horaria (hoy)
// Cada arreglo suma exactamente metrics.peopleDetected de su cámara en CAMERAS.
// ─────────────────────────────────────────────────────────────

export const CAMERA_HOURLY: Record<string, HourlyActivityPoint[]> = {
  "cam-001": [
    { hour: "06", count: 10 },
    { hour: "07", count: 26 },
    { hour: "08", count: 41 },
    { hour: "09", count: 53 },
    { hour: "10", count: 47 },
    { hour: "11", count: 43 },
    { hour: "12", count: 19 },
    { hour: "13", count: 17 },
    { hour: "14", count: 35 },
    { hour: "15", count: 40 },
    { hour: "16", count: 31 },
    { hour: "17", count: 22 },
    { hour: "18", count: 15 },
    { hour: "19", count: 10 },
    { hour: "20", count: 3 },
    { hour: "21", count: 0 },
  ],
  "cam-002": [
    { hour: "06", count: 3 },
    { hour: "07", count: 10 },
    { hour: "08", count: 19 },
    { hour: "09", count: 29 },
    { hour: "10", count: 38 },
    { hour: "11", count: 42 },
    { hour: "12", count: 23 },
    { hour: "13", count: 21 },
    { hour: "14", count: 31 },
    { hour: "15", count: 35 },
    { hour: "16", count: 27 },
    { hour: "17", count: 19 },
    { hour: "18", count: 12 },
    { hour: "19", count: 7 },
    { hour: "20", count: 2 },
    { hour: "21", count: 0 },
  ],
  "cam-003": [
    { hour: "06", count: 1 },
    { hour: "07", count: 3 },
    { hour: "08", count: 4 },
    { hour: "09", count: 3 },
    { hour: "10", count: 3 },
    { hour: "11", count: 2 },
    { hour: "12", count: 1 },
    { hour: "13", count: 1 },
    { hour: "14", count: 2 },
    { hour: "15", count: 1 },
    { hour: "16", count: 2 },
    { hour: "17", count: 1 },
    { hour: "18", count: 0 },
    { hour: "19", count: 0 },
    { hour: "20", count: 0 },
    { hour: "21", count: 0 },
  ],
  "cam-004": [
    { hour: "06", count: 4 },
    { hour: "07", count: 10 },
    { hour: "08", count: 21 },
    { hour: "09", count: 29 },
    { hour: "10", count: 36 },
    { hour: "11", count: 32 },
    { hour: "12", count: 13 },
    { hour: "13", count: 12 },
    { hour: "14", count: 25 },
    { hour: "15", count: 30 },
    { hour: "16", count: 26 },
    { hour: "17", count: 19 },
    { hour: "18", count: 10 },
    { hour: "19", count: 7 },
    { hour: "20", count: 2 },
    { hour: "21", count: 0 },
  ],
  "cam-005": [
    { hour: "06", count: 6 },
    { hour: "07", count: 13 },
    { hour: "08", count: 17 },
    { hour: "09", count: 11 },
    { hour: "10", count: 9 },
    { hour: "11", count: 7 },
    { hour: "12", count: 4 },
    { hour: "13", count: 5 },
    { hour: "14", count: 7 },
    { hour: "15", count: 9 },
    { hour: "16", count: 11 },
    { hour: "17", count: 14 },
    { hour: "18", count: 18 },
    { hour: "19", count: 12 },
    { hour: "20", count: 3 },
    { hour: "21", count: 1 },
  ],
  "cam-006": [
    { hour: "06", count: 1 },
    { hour: "07", count: 5 },
    { hour: "08", count: 11 },
    { hour: "09", count: 15 },
    { hour: "10", count: 11 },
    { hour: "11", count: 9 },
    { hour: "12", count: 4 },
    { hour: "13", count: 4 },
    { hour: "14", count: 7 },
    { hour: "15", count: 8 },
    { hour: "16", count: 6 },
    { hour: "17", count: 4 },
    { hour: "18", count: 2 },
    { hour: "19", count: 1 },
    { hour: "20", count: 1 },
    { hour: "21", count: 0 },
  ],
  "cam-007": [
    { hour: "06", count: 0 },
    { hour: "07", count: 0 },
    { hour: "08", count: 0 },
    { hour: "09", count: 0 },
    { hour: "10", count: 0 },
    { hour: "11", count: 0 },
    { hour: "12", count: 0 },
    { hour: "13", count: 0 },
    { hour: "14", count: 0 },
    { hour: "15", count: 0 },
    { hour: "16", count: 0 },
    { hour: "17", count: 0 },
    { hour: "18", count: 0 },
    { hour: "19", count: 0 },
    { hour: "20", count: 0 },
    { hour: "21", count: 0 },
  ],
  "cam-008": [
    { hour: "06", count: 1 },
    { hour: "07", count: 1 },
    { hour: "08", count: 2 },
    { hour: "09", count: 1 },
    { hour: "10", count: 1 },
    { hour: "11", count: 1 },
    { hour: "12", count: 0 },
    { hour: "13", count: 0 },
    { hour: "14", count: 1 },
    { hour: "15", count: 1 },
    { hour: "16", count: 1 },
    { hour: "17", count: 0 },
    { hour: "18", count: 2 },
    { hour: "19", count: 0 },
    { hour: "20", count: 0 },
    { hour: "21", count: 0 },
  ],
};

// ─────────────────────────────────────────────────────────────
// FILTROS DE HORA
// ─────────────────────────────────────────────────────────────

export type HourRange = "all" | "morning" | "midday" | "afternoon" | "evening";

export const HOUR_RANGES: Record<HourRange, { label: string; start: number; end: number }> = {
  all: { label: "Todo el día", start: 0, end: 24 },
  morning: { label: "Mañana 6–12h", start: 6, end: 12 },
  midday: { label: "Mediodía 12–15h", start: 12, end: 15 },
  afternoon: { label: "Tarde 15–19h", start: 15, end: 19 },
  evening: { label: "Noche 19–22h", start: 19, end: 22 },
};

export function filterHourly(data: HourlyActivityPoint[], range: HourRange): HourlyActivityPoint[] {
  if (range === "all") return data;
  const { start, end } = HOUR_RANGES[range];
  return data.filter((d) => {
    const h = parseInt(d.hour, 10);
    return h >= start && h < end;
  });
}

// Suma de afluencia por rango
export function sumHourly(data: HourlyActivityPoint[], range: HourRange): number {
  return filterHourly(data, range).reduce((s, d) => s + d.count, 0);
}

// NUEVO — hora pico calculada en vivo desde los datos, no hardcodeada.
export function getPeakHourToday(): { hour: string; count: number } {
  return HOURLY_ACTIVITY_TODAY.reduce((max, p) => (p.count > max.count ? p : max));
}

// NUEVO — comparación semanal calculada en vivo desde los datos reales.
export function currentWeekTotal(): number {
  return DAILY_PEOPLE_7D.reduce((s, d) => s + d.count, 0);
}

export function previousWeekTotal(): number {
  return DAILY_PEOPLE_7D_PREV.reduce((s, d) => s + d.count, 0);
}

export function getWeeklyChangePercent(): number {
  const current = currentWeekTotal();
  const previous = previousWeekTotal();
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

// ─────────────────────────────────────────────────────────────
// MATRIZ DE CALOR SEMANAL (Día de la semana vs. Hora del día)
// 7 días × 14 horas (08:00 a 21:00)
// ─────────────────────────────────────────────────────────────

export interface HeatmapCell {
  day: string;
  dayLabel: string;
  hour: string;
  count: number;
  level: "low" | "medium" | "high" | "peak";
}

export const MATRIX_HOURS = [
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
];
export const MATRIX_DAYS = [
  { key: "Lun", label: "Lunes" },
  { key: "Mar", label: "Martes" },
  { key: "Mié", label: "Miércoles" },
  { key: "Jue", label: "Jueves" },
  { key: "Vie", label: "Viernes" },
  { key: "Sáb", label: "Sábado" },
  { key: "Dom", label: "Domingo" },
];

export const WEEKLY_HOURLY_MATRIX: HeatmapCell[] = [
  // Lunes (Total ~978 - Día más calmado)
  { day: "Lun", dayLabel: "Lunes", hour: "08", count: 42, level: "low" },
  { day: "Lun", dayLabel: "Lunes", hour: "09", count: 68, level: "low" },
  { day: "Lun", dayLabel: "Lunes", hour: "10", count: 85, level: "medium" },
  { day: "Lun", dayLabel: "Lunes", hour: "11", count: 82, level: "medium" },
  { day: "Lun", dayLabel: "Lunes", hour: "12", count: 96, level: "medium" },
  { day: "Lun", dayLabel: "Lunes", hour: "13", count: 70, level: "low" },
  { day: "Lun", dayLabel: "Lunes", hour: "14", count: 64, level: "low" },
  { day: "Lun", dayLabel: "Lunes", hour: "15", count: 78, level: "medium" },
  { day: "Lun", dayLabel: "Lunes", hour: "16", count: 84, level: "medium" },
  { day: "Lun", dayLabel: "Lunes", hour: "17", count: 92, level: "medium" },
  { day: "Lun", dayLabel: "Lunes", hour: "18", count: 88, level: "medium" },
  { day: "Lun", dayLabel: "Lunes", hour: "19", count: 65, level: "low" },
  { day: "Lun", dayLabel: "Lunes", hour: "20", count: 44, level: "low" },
  { day: "Lun", dayLabel: "Lunes", hour: "21", count: 20, level: "low" },

  // Martes (Total 1,204 - Hoy)
  { day: "Mar", dayLabel: "Martes", hour: "08", count: 62, level: "low" },
  { day: "Mar", dayLabel: "Martes", hour: "09", count: 98, level: "medium" },
  { day: "Mar", dayLabel: "Martes", hour: "10", count: 148, level: "high" },
  { day: "Mar", dayLabel: "Martes", hour: "11", count: 135, level: "high" },
  { day: "Mar", dayLabel: "Martes", hour: "12", count: 86, level: "medium" },
  { day: "Mar", dayLabel: "Martes", hour: "13", count: 62, level: "low" },
  { day: "Mar", dayLabel: "Martes", hour: "14", count: 79, level: "medium" },
  { day: "Mar", dayLabel: "Martes", hour: "15", count: 114, level: "high" },
  { day: "Mar", dayLabel: "Martes", hour: "16", count: 108, level: "high" },
  { day: "Mar", dayLabel: "Martes", hour: "17", count: 96, level: "medium" },
  { day: "Mar", dayLabel: "Martes", hour: "18", count: 84, level: "medium" },
  { day: "Mar", dayLabel: "Martes", hour: "19", count: 65, level: "low" },
  { day: "Mar", dayLabel: "Martes", hour: "20", count: 42, level: "low" },
  { day: "Mar", dayLabel: "Martes", hour: "21", count: 25, level: "low" },

  // Miércoles (Total 1,087)
  { day: "Mié", dayLabel: "Miércoles", hour: "08", count: 50, level: "low" },
  { day: "Mié", dayLabel: "Miércoles", hour: "09", count: 78, level: "medium" },
  { day: "Mié", dayLabel: "Miércoles", hour: "10", count: 112, level: "high" },
  { day: "Mié", dayLabel: "Miércoles", hour: "11", count: 105, level: "high" },
  { day: "Mié", dayLabel: "Miércoles", hour: "12", count: 98, level: "medium" },
  { day: "Mié", dayLabel: "Miércoles", hour: "13", count: 74, level: "low" },
  { day: "Mié", dayLabel: "Miércoles", hour: "14", count: 70, level: "low" },
  { day: "Mié", dayLabel: "Miércoles", hour: "15", count: 92, level: "medium" },
  { day: "Mié", dayLabel: "Miércoles", hour: "16", count: 99, level: "medium" },
  { day: "Mié", dayLabel: "Miércoles", hour: "17", count: 104, level: "high" },
  { day: "Mié", dayLabel: "Miércoles", hour: "18", count: 95, level: "medium" },
  { day: "Mié", dayLabel: "Miércoles", hour: "19", count: 60, level: "low" },
  { day: "Mié", dayLabel: "Miércoles", hour: "20", count: 32, level: "low" },
  { day: "Mié", dayLabel: "Miércoles", hour: "21", count: 18, level: "low" },

  // Jueves (Total 1,143)
  { day: "Jue", dayLabel: "Jueves", hour: "08", count: 55, level: "low" },
  { day: "Jue", dayLabel: "Jueves", hour: "09", count: 85, level: "medium" },
  { day: "Jue", dayLabel: "Jueves", hour: "10", count: 118, level: "high" },
  { day: "Jue", dayLabel: "Jueves", hour: "11", count: 112, level: "high" },
  { day: "Jue", dayLabel: "Jueves", hour: "12", count: 102, level: "high" },
  { day: "Jue", dayLabel: "Jueves", hour: "13", count: 78, level: "medium" },
  { day: "Jue", dayLabel: "Jueves", hour: "14", count: 75, level: "medium" },
  { day: "Jue", dayLabel: "Jueves", hour: "15", count: 95, level: "medium" },
  { day: "Jue", dayLabel: "Jueves", hour: "16", count: 104, level: "high" },
  { day: "Jue", dayLabel: "Jueves", hour: "17", count: 110, level: "high" },
  { day: "Jue", dayLabel: "Jueves", hour: "18", count: 98, level: "medium" },
  { day: "Jue", dayLabel: "Jueves", hour: "19", count: 65, level: "low" },
  { day: "Jue", dayLabel: "Jueves", hour: "20", count: 32, level: "low" },
  { day: "Jue", dayLabel: "Jueves", hour: "21", count: 14, level: "low" },

  // Viernes (Total 1,389 - Pico de mediodía en cajas)
  { day: "Vie", dayLabel: "Viernes", hour: "08", count: 65, level: "low" },
  { day: "Vie", dayLabel: "Viernes", hour: "09", count: 95, level: "medium" },
  { day: "Vie", dayLabel: "Viernes", hour: "10", count: 125, level: "high" },
  { day: "Vie", dayLabel: "Viernes", hour: "11", count: 140, level: "high" },
  { day: "Vie", dayLabel: "Viernes", hour: "12", count: 168, level: "peak" },
  { day: "Vie", dayLabel: "Viernes", hour: "13", count: 155, level: "peak" },
  { day: "Vie", dayLabel: "Viernes", hour: "14", count: 102, level: "high" },
  { day: "Vie", dayLabel: "Viernes", hour: "15", count: 110, level: "high" },
  { day: "Vie", dayLabel: "Viernes", hour: "16", count: 118, level: "high" },
  { day: "Vie", dayLabel: "Viernes", hour: "17", count: 128, level: "high" },
  { day: "Vie", dayLabel: "Viernes", hour: "18", count: 95, level: "medium" },
  { day: "Vie", dayLabel: "Viernes", hour: "19", count: 55, level: "low" },
  { day: "Vie", dayLabel: "Viernes", hour: "20", count: 24, level: "low" },
  { day: "Vie", dayLabel: "Viernes", hour: "21", count: 9, level: "low" },

  // Sábado (Total 1,820 - Máximo semanal, pico en tarde)
  { day: "Sáb", dayLabel: "Sábado", hour: "08", count: 68, level: "low" },
  { day: "Sáb", dayLabel: "Sábado", hour: "09", count: 115, level: "high" },
  { day: "Sáb", dayLabel: "Sábado", hour: "10", count: 152, level: "peak" },
  { day: "Sáb", dayLabel: "Sábado", hour: "11", count: 165, level: "peak" },
  { day: "Sáb", dayLabel: "Sábado", hour: "12", count: 145, level: "high" },
  { day: "Sáb", dayLabel: "Sábado", hour: "13", count: 110, level: "high" },
  { day: "Sáb", dayLabel: "Sábado", hour: "14", count: 135, level: "high" },
  { day: "Sáb", dayLabel: "Sábado", hour: "15", count: 195, level: "peak" },
  { day: "Sáb", dayLabel: "Sábado", hour: "16", count: 210, level: "peak" },
  { day: "Sáb", dayLabel: "Sábado", hour: "17", count: 188, level: "peak" },
  { day: "Sáb", dayLabel: "Sábado", hour: "18", count: 155, level: "high" },
  { day: "Sáb", dayLabel: "Sábado", hour: "19", count: 98, level: "medium" },
  { day: "Sáb", dayLabel: "Sábado", hour: "20", count: 58, level: "low" },
  { day: "Sáb", dayLabel: "Sábado", hour: "21", count: 26, level: "low" },

  // Domingo (Total 1,654 - Flujo familiar concentrado)
  { day: "Dom", dayLabel: "Domingo", hour: "08", count: 52, level: "low" },
  { day: "Dom", dayLabel: "Domingo", hour: "09", count: 104, level: "high" },
  { day: "Dom", dayLabel: "Domingo", hour: "10", count: 162, level: "peak" },
  { day: "Dom", dayLabel: "Domingo", hour: "11", count: 180, level: "peak" },
  { day: "Dom", dayLabel: "Domingo", hour: "12", count: 172, level: "peak" },
  { day: "Dom", dayLabel: "Domingo", hour: "13", count: 138, level: "high" },
  { day: "Dom", dayLabel: "Domingo", hour: "14", count: 120, level: "high" },
  { day: "Dom", dayLabel: "Domingo", hour: "15", count: 145, level: "high" },
  { day: "Dom", dayLabel: "Domingo", hour: "16", count: 165, level: "peak" },
  { day: "Dom", dayLabel: "Domingo", hour: "17", count: 150, level: "peak" },
  { day: "Dom", dayLabel: "Domingo", hour: "18", count: 122, level: "high" },
  { day: "Dom", dayLabel: "Domingo", hour: "19", count: 85, level: "medium" },
  { day: "Dom", dayLabel: "Domingo", hour: "20", count: 42, level: "low" },
  { day: "Dom", dayLabel: "Domingo", hour: "21", count: 17, level: "low" },
];

// ─────────────────────────────────────────────────────────────
// CONTEO BIDIRECCIONAL (Ingresos vs. Salidas & Ocupación en tienda)
// Acceso Principal — cam-001 (Hoy martes 08 de septiembre)
// ─────────────────────────────────────────────────────────────

export interface BidirectionalPoint {
  hour: string;
  entries: number;
  exits: number;
  netOccupancy: number; // Personas dentro de la tienda al cierre de la hora
}

export const BIDIRECTIONAL_HOURLY_TODAY: BidirectionalPoint[] = [
  { hour: "06", entries: 10, exits: 2, netOccupancy: 8 },
  { hour: "07", entries: 26, exits: 12, netOccupancy: 22 },
  { hour: "08", entries: 62, exits: 34, netOccupancy: 50 },
  { hour: "09", entries: 98, exits: 58, netOccupancy: 90 },
  { hour: "10", entries: 148, exits: 92, netOccupancy: 146 }, // Hora pico de entrada
  { hour: "11", entries: 135, exits: 139, netOccupancy: 142 },
  { hour: "12", entries: 86, exits: 118, netOccupancy: 110 },
  { hour: "13", entries: 62, exits: 84, netOccupancy: 88 },
  { hour: "14", entries: 79, exits: 65, netOccupancy: 102 },
  { hour: "15", entries: 114, exits: 74, netOccupancy: 142 }, // Snapshot actual a las 15:45: ~142 pers
  { hour: "16", entries: 108, exits: 102, netOccupancy: 148 },
  { hour: "17", entries: 96, exits: 114, netOccupancy: 130 },
  { hour: "18", entries: 84, exits: 112, netOccupancy: 102 },
  { hour: "19", entries: 65, exits: 98, netOccupancy: 69 },
  { hour: "20", entries: 42, exits: 78, netOccupancy: 33 },
  { hour: "21", entries: 25, exits: 52, netOccupancy: 6 },
];

// ─────────────────────────────────────────────────────────────
// CAPACIDAD Y DENSIDAD POR ZONA (En vivo — SuperFamilia Mercados)
// ─────────────────────────────────────────────────────────────

export interface ZoneDensityMetric {
  zone: string;
  cameraId: string;
  areaM2: number;
  currentPeople: number;
  densityPerM2: number;
  capacityMax: number;
  status: "optimal" | "moderate" | "dense" | "saturated";
}

export interface StoreCapacityData {
  maxCapacity: number;
  currentOccupants: number;
  occupancyPercent: number;
  totalSalesAreaM2: number;
  globalDensityPerM2: number;
  zones: ZoneDensityMetric[];
}

export const STORE_CAPACITY_METRICS: StoreCapacityData = {
  maxCapacity: 250,
  currentOccupants: 142, // A las 15:45
  occupancyPercent: 56.8,
  totalSalesAreaM2: 480,
  globalDensityPerM2: 0.3,
  zones: [
    {
      zone: "Entrada Principal",
      cameraId: "cam-001",
      areaM2: 45,
      currentPeople: 8,
      densityPerM2: 0.18,
      capacityMax: 30,
      status: "optimal" as const,
    },
    {
      zone: "Área de Cajas",
      cameraId: "cam-002",
      areaM2: 90,
      currentPeople: 42,
      densityPerM2: 0.47,
      capacityMax: 50,
      status: "dense" as const,
    },
    {
      zone: "Pasillos Centro (Góndolas)",
      cameraId: "cam-004",
      areaM2: 280,
      currentPeople: 74,
      densityPerM2: 0.26,
      capacityMax: 140,
      status: "optimal" as const,
    },
    {
      zone: "Sector Bebidas y Snacks",
      cameraId: "cam-006",
      areaM2: 65,
      currentPeople: 18,
      densityPerM2: 0.28,
      capacityMax: 30,
      status: "optimal" as const,
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// FUNCIONES AGREGADORAS DE ANALÍTICA AVANZADA
// ─────────────────────────────────────────────────────────────

export interface WeekdayVsWeekend {
  weekdayAvgVisitors: number;
  weekendAvgVisitors: number;
  trafficIncreasePercent: number;
  weekdayAvgConversion: number;
  weekendAvgConversion: number;
  conversionDiffPts: number;
  weekdayAvgDwellMin: number;
  weekendAvgDwellMin: number;
}

export function getWeekdayVsWeekendStats(): WeekdayVsWeekend {
  // Días entre semana: Mié, Jue, Vie, Lun, Mar (5 días)
  const weekdays = CONVERSION_7D.filter((d) => d.day !== "Sáb" && d.day !== "Dom");
  const weekends = CONVERSION_7D.filter((d) => d.day === "Sáb" || d.day === "Dom");

  const weekdayAvgVis = Math.round(weekdays.reduce((s, d) => s + d.visitors, 0) / weekdays.length);
  const weekendAvgVis = Math.round(weekends.reduce((s, d) => s + d.visitors, 0) / weekends.length);

  const weekdayAvgConv = Number(
    (weekdays.reduce((s, d) => s + d.conversionRate, 0) / weekdays.length).toFixed(1)
  );
  const weekendAvgConv = Number(
    (weekends.reduce((s, d) => s + d.conversionRate, 0) / weekends.length).toFixed(1)
  );

  const trafficDiff = Number((((weekendAvgVis - weekdayAvgVis) / weekdayAvgVis) * 100).toFixed(1));
  const convDiff = Number((weekendAvgConv - weekdayAvgConv).toFixed(1));

  return {
    weekdayAvgVisitors: weekdayAvgVis,
    weekendAvgVisitors: weekendAvgVis,
    trafficIncreasePercent: trafficDiff,
    weekdayAvgConversion: weekdayAvgConv,
    weekendAvgConversion: weekendAvgConv,
    conversionDiffPts: convDiff,
    weekdayAvgDwellMin: 20.2,
    weekendAvgDwellMin: 25.8,
  };
}

export interface DailyTrafficDetail {
  day: string;
  date: string;
  visitors: number;
  vsAvgPercent: number;
  peakHour: string;
  peakCount: number;
  avgDwellMin: number;
  conversionRate: number;
  transactions: number;
  isWeekend: boolean;
}

export function getDailyTrafficBreakdown(): DailyTrafficDetail[] {
  const avgVisitors = Math.round(
    CONVERSION_7D.reduce((s, d) => s + d.visitors, 0) / CONVERSION_7D.length
  );

  // Mapeo detallado con horas pico y permanencia estimada
  const peaksMap: Record<string, { hour: string; count: number; dwell: number }> = {
    Mié: { hour: "10:00", count: 112, dwell: 21.0 },
    Jue: { hour: "10:00", count: 118, dwell: 20.5 },
    Vie: { hour: "12:00", count: 168, dwell: 22.4 },
    Sáb: { hour: "16:00", count: 210, dwell: 26.5 },
    Dom: { hour: "11:00", count: 180, dwell: 25.1 },
    Lun: { hour: "12:00", count: 96, dwell: 18.2 },
    Mar: { hour: "10:00", count: 148, dwell: 22.0 },
  };

  return CONVERSION_7D.map((item) => {
    const peak = peaksMap[item.day] ?? { hour: "11:00", count: 120, dwell: 21.0 };
    const vsAvg = Number((((item.visitors - avgVisitors) / avgVisitors) * 100).toFixed(1));
    const isWeekend = item.day === "Sáb" || item.day === "Dom";

    return {
      day: item.day,
      date: item.date,
      visitors: item.visitors,
      vsAvgPercent: vsAvg,
      peakHour: peak.hour,
      peakCount: peak.count,
      avgDwellMin: peak.dwell,
      conversionRate: item.conversionRate,
      transactions: item.transactions,
      isWeekend,
    };
  });
}

// ─────────────────────────────────────────────────────────────
// OPERACIONES Y CUMPLIMIENTO DE PERSONAL (SOP VIDEOANALYTICS)
// ─────────────────────────────────────────────────────────────

export interface UniformComplianceMetric {
  category: "vestimenta" | "credencial" | "epp_sanitario" | "guantes";
  label: string;
  complianceRate: number; // e.g. 98.4
  detectedTotal: number;
  infractions: number;
  status: "optimal" | "warning" | "critical";
  targetRate: number; // 95.0
}

export interface ZoneUniformCompliance {
  zone: string;
  cameraId: string;
  complianceRate: number;
  staffCount: number;
  infractions: number;
  criticalMissing?: string;
}

export interface StorePunctualityDay {
  day: string;
  date: string;
  scheduledTime: string; // "08:30"
  actualOpenTime: string; // "08:42"
  delayMinutes: number; // 12
  status: "on_time" | "slight_delay" | "severe_delay";
  openedByCamera: string; // "cam-001"
  staffReadyBeforeOpen: boolean;
}

export interface OperationalIncident {
  id: string;
  time: string;
  timestamp: string;
  type: "uniform_missing" | "late_opening" | "phone_distraction" | "unattended_checkout" | "unauthorized_area";
  title: string;
  description: string;
  zone: string;
  cameraId: string;
  severity: "low" | "medium" | "high";
  resolved: boolean;
  durationMinutes?: number;
}

export interface OperationsSummaryData {
  overallScore: number; // 91 / 100
  uniformComplianceRate: number; // 94.2%
  punctualityScore: number; // 95.8%
  todayOpeningDelayMin: number; // 12
  todayOpeningStatus: "slight_delay";
  activeCashierCoverageRate: number; // 98.2%
  phoneDistractionEvents: number; // 7
  phoneDistractionDurationMin: number; // 16
  unattendedCounterIncidents: number; // 2
  uniformCategories: UniformComplianceMetric[];
  zoneCompliance: ZoneUniformCompliance[];
  punctualityHistory7D: StorePunctualityDay[];
  recentIncidents: OperationalIncident[];
}

export const OPERATIONS_METRICS: OperationsSummaryData = {
  overallScore: 91,
  uniformComplianceRate: 94.2,
  punctualityScore: 95.8,
  todayOpeningDelayMin: 12,
  todayOpeningStatus: "slight_delay",
  activeCashierCoverageRate: 98.2,
  phoneDistractionEvents: 7,
  phoneDistractionDurationMin: 16,
  unattendedCounterIncidents: 2,
  uniformCategories: [
    {
      category: "vestimenta",
      label: "Mandil / Chaleco Reglamentario",
      complianceRate: 98.4,
      detectedTotal: 48,
      infractions: 1,
      status: "optimal",
      targetRate: 95.0,
    },
    {
      category: "credencial",
      label: "Credencial / Fotocheck Visible",
      complianceRate: 93.1,
      detectedTotal: 48,
      infractions: 3,
      status: "warning",
      targetRate: 95.0,
    },
    {
      category: "epp_sanitario",
      label: "Cofia / Mascarilla (Alimentos)",
      complianceRate: 86.5,
      detectedTotal: 16,
      infractions: 4,
      status: "critical",
      targetRate: 98.0,
    },
    {
      category: "guantes",
      label: "Guantes de Protección (Bodega)",
      complianceRate: 91.8,
      detectedTotal: 22,
      infractions: 2,
      status: "warning",
      targetRate: 95.0,
    },
  ],
  zoneCompliance: [
    {
      zone: "Línea de Cajas",
      cameraId: "cam-002",
      complianceRate: 97.5,
      staffCount: 8,
      infractions: 1,
    },
    {
      zone: "Pasillos & Sala de Ventas",
      cameraId: "cam-004",
      complianceRate: 95.0,
      staffCount: 6,
      infractions: 2,
      criticalMissing: "1 fotocheck",
    },
    {
      zone: "Panadería & Charcutería",
      cameraId: "cam-005",
      complianceRate: 85.7,
      staffCount: 4,
      infractions: 3,
      criticalMissing: "2 cofias ausentes",
    },
    {
      zone: "Bodega & Recepción Carga",
      cameraId: "cam-003",
      complianceRate: 91.0,
      staffCount: 5,
      infractions: 2,
      criticalMissing: "1 sin guantes",
    },
  ],
  punctualityHistory7D: [
    {
      day: "Mié",
      date: "02 Sep",
      scheduledTime: "08:30",
      actualOpenTime: "08:29",
      delayMinutes: 0,
      status: "on_time",
      openedByCamera: "cam-001",
      staffReadyBeforeOpen: true,
    },
    {
      day: "Jue",
      date: "03 Sep",
      scheduledTime: "08:30",
      actualOpenTime: "08:31",
      delayMinutes: 1,
      status: "on_time",
      openedByCamera: "cam-001",
      staffReadyBeforeOpen: true,
    },
    {
      day: "Vie",
      date: "04 Sep",
      scheduledTime: "08:30",
      actualOpenTime: "08:34",
      delayMinutes: 4,
      status: "on_time",
      openedByCamera: "cam-001",
      staffReadyBeforeOpen: true,
    },
    {
      day: "Sáb",
      date: "05 Sep",
      scheduledTime: "08:30",
      actualOpenTime: "08:45",
      delayMinutes: 15,
      status: "severe_delay",
      openedByCamera: "cam-001",
      staffReadyBeforeOpen: false,
    },
    {
      day: "Dom",
      date: "06 Sep",
      scheduledTime: "09:00",
      actualOpenTime: "09:02",
      delayMinutes: 2,
      status: "on_time",
      openedByCamera: "cam-001",
      staffReadyBeforeOpen: true,
    },
    {
      day: "Lun",
      date: "07 Sep",
      scheduledTime: "08:30",
      actualOpenTime: "08:30",
      delayMinutes: 0,
      status: "on_time",
      openedByCamera: "cam-001",
      staffReadyBeforeOpen: true,
    },
    {
      day: "Mar",
      date: "08 Sep",
      scheduledTime: "08:30",
      actualOpenTime: "08:42",
      delayMinutes: 12,
      status: "slight_delay",
      openedByCamera: "cam-001",
      staffReadyBeforeOpen: true,
    },
  ],
  recentIncidents: [
    {
      id: "op-inc-01",
      time: "14:32",
      timestamp: "2026-09-08T14:32:00",
      type: "phone_distraction",
      title: "Uso indebido de celular en Caja 3",
      description: "Operador de caja manipuló teléfono móvil durante 3.2 min con cliente esperando en cinta transportadora.",
      zone: "Línea de Cajas",
      cameraId: "cam-002",
      severity: "medium",
      resolved: true,
      durationMinutes: 3.2,
    },
    {
      id: "op-inc-02",
      time: "12:15",
      timestamp: "2026-09-08T12:15:00",
      type: "unattended_checkout",
      title: "Caja 2 desatendida con cola activa",
      description: "Puesto de cobro desatendido durante 4.5 min con 3 clientes formados. Requirió llamada de supervisor.",
      zone: "Línea de Cajas",
      cameraId: "cam-002",
      severity: "high",
      resolved: true,
      durationMinutes: 4.5,
    },
    {
      id: "op-inc-03",
      time: "10:40",
      timestamp: "2026-09-08T10:40:00",
      type: "uniform_missing",
      title: "Manipulación de alimentos sin cofia",
      description: "Personal en área de horneado ingresó sin cofia ni barbijo reglamentario. Riesgo de contaminación cruzada.",
      zone: "Panadería & Charcutería",
      cameraId: "cam-005",
      severity: "medium",
      resolved: false,
    },
    {
      id: "op-inc-04",
      time: "08:42",
      timestamp: "2026-09-08T08:42:00",
      type: "late_opening",
      title: "Apertura de sucursal con 12 min de retraso",
      description: "Cortina metálica principal levantada a las 08:42 h frente a hora programada (08:30 h). 6 clientes esperaban afuera.",
      zone: "Entrada Principal",
      cameraId: "cam-001",
      severity: "high",
      resolved: true,
      durationMinutes: 12,
    },
    {
      id: "op-inc-05",
      time: "08:15",
      timestamp: "2026-09-08T08:15:00",
      type: "uniform_missing",
      title: "Personal sin credencial visible",
      description: "Reponedor en pasillo 3 detectado sin fotocheck visible durante labores matutinas de estantería.",
      zone: "Pasillos & Sala de Ventas",
      cameraId: "cam-004",
      severity: "low",
      resolved: true,
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// VERTICAL DE PRODUCCIÓN Y MANUFACTURA DE ALIMENTOS
// Planta Central de Panadería, Empanadas & Rotisería
// ─────────────────────────────────────────────────────────────

export interface ProductionHourlyPoint {
  hour: string;
  hourNum: number;
  produced: number;
  target: number;
  defective: number;
  burned: number;
  downtimeMinutes: number;
  activeOvens: number;
}

export interface ProductVarietyMetric {
  id: string;
  name: string;
  shortName: string;
  produced: number;
  percentage: number;
  defective: number;
  defectRate: number;
  targetRate: number;
  color: string;
  unitPriceBs: number;
}

export interface QualityDefectMetric {
  id: string;
  type: "burned" | "broken_crust" | "deformed" | "underbaked";
  label: string;
  count: number;
  percentageOfDefects: number;
  color: string;
  severity: "high" | "medium" | "low";
  description: string;
  cameraSource: string;
  suspectedCause: string;
}

export interface ProductionDowntimeEvent {
  id: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  reason: string;
  line: string;
  cameraId: string;
  impactUnitsLost: number;
  resolved: boolean;
  category: "mechanical" | "operational" | "cleaning";
}

export interface ProductionSummaryData {
  plantName: string;
  lineName: string;
  totalProduced: number;
  targetTotal: number;
  qualityConformityRate: number;
  defectiveTotal: number;
  burnedTotal: number;
  uptimeRate: number;
  downtimeMinutesTotal: number;
  downtimeEventsCount: number;
  scrapCostEstimatedBs: number;
  scrapCostEstimatedUsd: number;
  averagePph: number;
  peakHour: string;
  hourlyProduction: ProductionHourlyPoint[];
  varieties: ProductVarietyMetric[];
  defects: QualityDefectMetric[];
  downtimeLog: ProductionDowntimeEvent[];
}

export const PRODUCTION_METRICS: ProductionSummaryData = {
  plantName: "Planta Central Panadería & Alimentos",
  lineName: "Línea 1 — Horneo & Salida Continua (cam-003)",
  totalProduced: 4850,
  targetTotal: 4500,
  qualityConformityRate: 96.8,
  defectiveTotal: 156,
  burnedTotal: 84,
  uptimeRate: 94.2,
  downtimeMinutesTotal: 38,
  downtimeEventsCount: 2,
  scrapCostEstimatedBs: 1170,
  scrapCostEstimatedUsd: 169,
  averagePph: 485,
  peakHour: "11:00 – 12:00",
  hourlyProduction: [
    {
      hour: "06:00",
      hourNum: 6,
      produced: 310,
      target: 400,
      defective: 6,
      burned: 2,
      downtimeMinutes: 0,
      activeOvens: 2,
    },
    {
      hour: "07:00",
      hourNum: 7,
      produced: 480,
      target: 500,
      defective: 12,
      burned: 6,
      downtimeMinutes: 0,
      activeOvens: 3,
    },
    {
      hour: "08:00",
      hourNum: 8,
      produced: 340,
      target: 500,
      defective: 18,
      burned: 10,
      downtimeMinutes: 22,
      activeOvens: 2,
    },
    {
      hour: "09:00",
      hourNum: 9,
      produced: 510,
      target: 500,
      defective: 14,
      burned: 8,
      downtimeMinutes: 0,
      activeOvens: 3,
    },
    {
      hour: "10:00",
      hourNum: 10,
      produced: 590,
      target: 500,
      defective: 28,
      burned: 18,
      downtimeMinutes: 0,
      activeOvens: 3,
    },
    {
      hour: "11:00",
      hourNum: 11,
      produced: 630,
      target: 500,
      defective: 26,
      burned: 16,
      downtimeMinutes: 0,
      activeOvens: 3,
    },
    {
      hour: "12:00",
      hourNum: 12,
      produced: 370,
      target: 500,
      defective: 11,
      burned: 6,
      downtimeMinutes: 16,
      activeOvens: 2,
    },
    {
      hour: "13:00",
      hourNum: 13,
      produced: 540,
      target: 500,
      defective: 15,
      burned: 7,
      downtimeMinutes: 0,
      activeOvens: 3,
    },
    {
      hour: "14:00",
      hourNum: 14,
      produced: 560,
      target: 500,
      defective: 14,
      burned: 6,
      downtimeMinutes: 0,
      activeOvens: 3,
    },
    {
      hour: "15:00",
      hourNum: 15,
      produced: 520,
      target: 500,
      defective: 12,
      burned: 5,
      downtimeMinutes: 0,
      activeOvens: 3,
    },
  ],
  varieties: [
    {
      id: "var-carne",
      name: "Empanada de Carne Criolla",
      shortName: "Carne Criolla",
      produced: 1840,
      percentage: 37.9,
      defective: 32,
      defectRate: 1.7,
      targetRate: 2.0,
      color: "#056EFA",
      unitPriceBs: 7.5,
    },
    {
      id: "var-pollo",
      name: "Empanada de Pollo al Horno",
      shortName: "Pollo Horno",
      produced: 1320,
      percentage: 27.2,
      defective: 36,
      defectRate: 2.7,
      targetRate: 2.5,
      color: "#34d399",
      unitPriceBs: 7.5,
    },
    {
      id: "var-queso",
      name: "Empanada de Queso & Cebolla",
      shortName: "Queso & Cebolla",
      produced: 1140,
      percentage: 23.5,
      defective: 64,
      defectRate: 5.6,
      targetRate: 3.0,
      color: "#fbbf24",
      unitPriceBs: 7.0,
    },
    {
      id: "var-saltena",
      name: "Salteña Tradicional",
      shortName: "Salteña",
      produced: 550,
      percentage: 11.4,
      defective: 24,
      defectRate: 4.4,
      targetRate: 3.5,
      color: "#a78bfa",
      unitPriceBs: 8.5,
    },
  ],
  defects: [
    {
      id: "def-burned",
      type: "burned",
      label: "Empanadas Quemadas / Sobre-tostadas",
      count: 84,
      percentageOfDefects: 53.8,
      color: "#f87171",
      severity: "high",
      description: "Tostado excesivo superior por encima de umbral L* (colorimetría oscura > 38%). Producto no comercializable.",
      cameraSource: "cam-003 (Salida Horno 2)",
      suspectedCause: "Termocupla descalibrada en Horno 2 entre 10:15 y 11:20 (+18°C sobre consigna).",
    },
    {
      id: "def-broken",
      type: "broken_crust",
      label: "Repulgue Roto / Fuga de Relleno",
      count: 48,
      percentageOfDefects: 30.8,
      color: "#fb923c",
      severity: "medium",
      description: "Apertura perimetral del sellado con derrame de relleno en bandeja de cocción.",
      cameraSource: "cam-003 (Entrada Cinta)",
      suspectedCause: "Presión insuficiente en mesa de cerrado manual durante el turno matutino.",
    },
    {
      id: "def-deformed",
      type: "deformed",
      label: "Tamaño Irregular / Deforme",
      count: 24,
      percentageOfDefects: 15.4,
      color: "#fbbf24",
      severity: "low",
      description: "Desviación volumétrica superior al ±15% del estándar nominal (120g ± 10g).",
      cameraSource: "cam-003 (Pesaje & Salida)",
      suspectedCause: "Desgaste en cuchilla de dosificado de masa en cortadora #1.",
    },
  ],
  downtimeLog: [
    {
      id: "dt-01",
      startTime: "08:45",
      endTime: "09:07",
      durationMinutes: 22,
      reason: "Atasco en tolva de dosificación de relleno con parada automática de cinta",
      line: "Línea 1 — Cinta Salida Horno 2",
      cameraId: "cam-003",
      impactUnitsLost: 180,
      resolved: true,
      category: "mechanical",
    },
    {
      id: "dt-02",
      startTime: "12:15",
      endTime: "12:31",
      durationMinutes: 16,
      reason: "Limpieza preventiva de residuos y recambio de latas de teflón",
      line: "Línea 1 — Horno Rotativo Principal",
      cameraId: "cam-003",
      impactUnitsLost: 130,
      resolved: true,
      category: "cleaning",
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// INSIGHTS & RECOMENDACIONES
// ─────────────────────────────────────────────────────────────

export type InsightType = "positive" | "warning" | "critical" | "info";
export type InsightSource = "traffic" | "alerts" | "cameras" | "general";

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  metric?: string;
  recommendation: string;
  module?: ModuleId;
  source: InsightSource;
}

export const INSIGHTS: Insight[] = [
  {
    id: "ins-001",
    type: "positive",
    title: "Pico de tráfico identificado",
    description:
      "El sábado 05/09 registró 1,820 personas — el mayor flujo de la semana. La zona de góndolas alcanzó densidad máxima entre las 15:00 y 17:00.",
    metric: "+38% vs. promedio",
    recommendation:
      "Refuerza personal de piso los sábados en el rango 14:00–18:00 para mejorar la experiencia del cliente y reducir tiempos de espera.",
    source: "traffic",
  },
  {
    id: "ins-002",
    type: "warning",
    title: "Patrón de caídas en pasillo 5",
    description:
      "Se registraron 3 eventos de caída en 7 días, todos en Pasillos Centro, en el rango 15:00–17:00 — coincide con el repunte de tráfico de la tarde tras el descanso del mediodía.",
    metric: "3 eventos / semana",
    recommendation:
      "Revisar el piso del pasillo 5 para detectar irregularidades. Aumentar la frecuencia de limpieza en horas pico. Considera señalización de piso mojado.",
    module: "fall",
    source: "alerts",
  },
  {
    id: "ins-003",
    type: "critical",
    title: "Cámara Oficinas offline >24h",
    description:
      "La cámara de Planta Alta — Oficinas lleva más de 24 horas sin reportar. El último evento registrado fue un intento de tampering a las 23:47.",
    metric: "24h+ sin señal",
    recommendation:
      "Enviar técnico para inspección física inmediata. Posible sabotaje intencional previo a un acceso no autorizado. Revisar registros de acceso al pasillo.",
    module: "tampering",
    source: "cameras",
  },
  {
    id: "ins-004",
    type: "info",
    title: "Lunes con menor afluencia",
    description:
      "Los lunes registran consistentemente un 27% menos de clientes vs. el promedio del último mes (912 personas el 10/08, 934 el 17/08, 978 el 07/09).",
    metric: "-27% vs. promedio",
    recommendation:
      "Aprovecha los lunes para mantenimiento, reorganización de góndolas y capacitación de personal sin impactar la experiencia de compra.",
    source: "traffic",
  },
  {
    id: "ins-005",
    type: "warning",
    title: "Alertas de intrusión fuera del horario esperado",
    description:
      "cam-003 (Bodega Principal) generó 2 alertas de intrusión hoy. Ambas ocurrieron durante el horario habitual de operación (mediodía-tarde), fuera de la ventana nocturna (18:00–06:00) que este módulo vigila por defecto.",
    metric: "2 alertas en bodega",
    recommendation:
      "Verifica si corresponden a personal autorizado que ingresó sin registrar su acceso, o si hay un patrón diurno real que valga la pena cubrir ampliando el horario de vigilancia del módulo.",
    module: "intrusion",
    source: "alerts",
  },
  {
    id: "ins-006",
    type: "positive",
    title: "OCR con alta cobertura vehicular",
    description:
      "cam-005 registró 147 lecturas de placas hoy. El 94% fueron placas de la lista blanca, lo que indica buena configuración del sistema.",
    metric: "94% identificadas",
    recommendation:
      "Amplía la lista blanca con los proveedores recurrentes no registrados (6%) para eliminar falsas alarmas y reducir la carga operativa del equipo.",
    module: "ocr",
    source: "alerts",
  },
  {
    id: "ins-007",
    type: "info",
    title: "Cola alta en cajas los viernes",
    description:
      "Los viernes entre 12:00 y 14:00 se detectan colas de más de 8 personas en al menos 3 cajas simultáneamente.",
    metric: "Colas >8 personas",
    recommendation:
      "Habilita una caja express adicional los viernes al mediodía. Considera implementar alertas automáticas por umbral de cola para activar cajas de respaldo.",
    module: "people",
    source: "alerts",
  },
  // NUEVO — conecta CONVERSION_7D con la narrativa de negocio: más tráfico
  // no siempre significa más ventas si no se mide la conversión real.
  {
    id: "ins-008",
    type: "info",
    title: "Fin de semana: más tráfico, menor conversión",
    description:
      "El sábado y domingo concentran el mayor número de visitantes de la semana, pero la tasa de conversión estimada cae a 76–78%, frente a 85–86% de lunes y martes.",
    metric: "-9 pts vs. entre semana",
    recommendation:
      "Refuerza personal de piso y señalización de precios los fines de semana para convertir el tráfico extra en ventas, en vez de asumir que más visitas siempre significan más ingreso.",
    source: "traffic",
  },
];

// ─────────────────────────────────────────────────────────────
// CHAT IA — Respuestas contextualizadas (mock)
// ─────────────────────────────────────────────────────────────

export interface AIChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}

const AI_RESPONSES: { triggers: string[]; response: string }[] = [
  {
    triggers: ["campaña", "marketing", "publicidad", "promoción", "promo"],
    response:
      "¡Muy buena observación! Si realizaste una campaña de marketing, el incremento del 38% en tráfico registrado el sábado 05/09 (1,820 personas) es completamente consistente con ese tipo de acción. Las campañas bien ejecutadas en supermercados de Cochabamba suelen generar picos de between 25–45% en el día de mayor impacto.\n\nTe recomiendo documentar las fechas de tus campañas para poder correlacionar automáticamente el impacto en los próximos reportes. ¿Fue una campaña en redes sociales, volanteo o radio?",
  },
  {
    triggers: [
      "incremento",
      "aumento",
      "aumento",
      "subió",
      "subio",
      "más personas",
      "mas personas",
    ],
    response:
      "El mayor incremento registrado en los últimos 7 días fue el sábado 05/09 con 1,820 personas (+38% vs. el promedio semanal). El segundo pico fue el domingo 06/09 con 1,654 personas.\n\nEstos patrones son típicos en supermercados bolivianos: inicio de quincena + fin de semana genera una combinación fuerte. Si el incremento fue mayor al esperado, factores como una campaña, un evento local en Cochabamba, o el cierre de un competidor podrían explicarlo.",
  },
  {
    triggers: ["caída", "caidas", "accidente", "persona en el suelo"],
    response:
      "En los últimos 7 días se registraron 3 eventos de caída, todos en Pasillos Centro (cam-004). El patrón es claro: todas ocurrieron entre las 15:00 y 17:00, que coincide con el repunte de tráfico de la tarde.\n\nEsto sugiere que el problema puede ser una combinación de tráfico alto + condición del piso. Recomiendo: (1) inspección del pasillo 5, (2) señalización de piso y (3) limpieza más frecuente en ese rango horario.",
  },
  {
    triggers: ["intrusion", "intrusión", "bodega", "acceso no autorizado"],
    response:
      "Se detectaron 2 alertas de intrusión en Bodega Principal (cam-003) hoy. Ambas ocurrieron durante el horario habitual de operación (mediodía-tarde), fuera de la ventana nocturna (18:00–06:00) que este módulo vigila por defecto.\n\nEsto sugiere que el motivo de disparo no es el esperado (acceso nocturno no autorizado). Revisa si corresponde a personal trabajando sin registrar su acceso, o si hay un patrón diurno real que valga la pena investigar y cubrir con el módulo.",
  },
  {
    triggers: ["lunes", "semana", "dia de menor", "bajo flujo"],
    response:
      "Los lunes son consistentemente el día de menor tráfico: promedian un 27% menos que el resto del mes. En las últimas 4 semanas: 912 personas (10/08), 934 (17/08), 901 (24/08), 945 (31/08), 978 (07/09).\n\nEste es el mejor día para: reorganización de góndolas, mantenimiento de cámaras, capacitación de personal y reposición de inventario sin interrumpir la experiencia de compra.",
  },
  {
    triggers: ["comparar", "mes anterior", "semana anterior", "tendencia"],
    response: `Comparando la semana actual (${currentWeekTotal().toLocaleString(
      "es-BO"
    )} personas) vs. la anterior (${previousWeekTotal().toLocaleString(
      "es-BO"
    )} personas), hay un cambio de ${getWeeklyChangePercent() >= 0 ? "+" : ""}${getWeeklyChangePercent()}%. Sin embargo, si comparo el mismo sábado: 05/09 tuvo 1,820 vs. 29/08 que tuvo 1,689 (+7.8%).\n\nLa tendencia de las últimas semanas muestra un crecimiento promedio cercano al +4.4% semana a semana. El pico histórico del período fue el sábado 05/09.`,
  },
  {
    triggers: ["conversion", "conversión", "tasa de conversion", "ventas vs personas"],
    response: `La tasa de conversión promedio de los últimos 7 días es de ${getAverageConversionRate()}%. El patrón más interesante: los fines de semana tienen más visitantes pero MENOR conversión (76–78%) que entre semana (85–86%).\n\nEsto significa que el sábado y domingo hay más gente "mirando" y proporcionalmente menos gente comprando. Vale la pena reforzar personal de piso y señalización de precios esos días para capturar mejor ese tráfico extra.`,
  },
  {
    triggers: ["recomendacion", "recomendación", "qué hago", "que hago", "consejo", "sugerencia"],
    response:
      "Basándome en los datos actuales de SuperFamilia, estas son mis recomendaciones principales:\n\n1. **Refuerza los sábados 14–18h**: Son las horas con mayor densidad, aunque con menor conversión relativa — ahí está la oportunidad más grande.\n\n2. **Revisa cam-007**: Lleva más de 24h offline tras un evento de tampering. Es una zona ciega en administración.\n\n3. **Investiga las alertas diurnas de Intrusión en Bodega**: No encajan con el horario nocturno que el módulo vigila por defecto — podrían ser falsas alarmas o un patrón real nuevo.",
  },
];

export function getAIResponse(question: string): string {
  const q = question.toLowerCase();
  const match = AI_RESPONSES.find((r) => r.triggers.some((t) => q.includes(t)));
  if (match) return match.response;

  return "Entiendo tu pregunta. Basándome en la actividad de SuperFamilia Mercados en el período actual, te puedo decir que los patrones de afluencia son consistentes con supermercados de Cochabamba en temporada normal.\n\nSi tienes un evento específico que quieres analizar (campaña, feriado, cambio de lay-out, cierre de competidor), compárteme el contexto y puedo ayudarte a correlacionarlo con los datos. Prueba preguntarme sobre: campañas, incrementos, caídas, intrusiones, conversión, el lunes o comparar períodos.";
}
