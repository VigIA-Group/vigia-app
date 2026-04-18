// ============================================================
// VigIA — Mock Data
// Supermercado ficticio: "SuperFamilia Mercados S.A." — Cochabamba, Bolivia
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
    color: "#3b82f6",
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
    stat: "3",
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
    stat: "0",
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
    stat: "1",
    statLabel: "Evento hoy",
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
    name: "Cajas Salida",
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
    name: "Pasillos Tiendas",
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
    name: "Sector Bebidas", // ← video muestra góndolas con bebidas/snacks
    zone: "Área de Góndolas",
    floor: "Planta baja",
    room: "Sector Bebidas y Snacks",
    activeModules: ["people", "tampering"],
    status: "online",
    metrics: { peopleDetected: 89, alertsToday: 0, uptimePercent: 100 },
    description: "Pasillo de bebidas, snacks y productos envasados",
  },
  // cam-007 y cam-008 no aparecen en el mock visible,
  // pero se mantienen para coherencia del sistema:
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

const now = new Date("2026-03-31T10:30:00-04:00");

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
    timestamp: hoursAgo(5.8),
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
    type: "Merma detectada en frescos",
    module: "stolen",
    cameraId: "cam-006",
    cameraName: "Carnicería y Frescos",
    severity: "BAJA",
    timestamp: daysAgo(1, "14:22"),
    description:
      "Producto retirado de la sección de carnes sin pasar por caja registradora. Item estimado: corte premium, aprox. Bs. 85.",
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
  name: "Carlos Mamani Flores",
  email: "c.mamani@superfamilia.com.bo",
  role: "Administrador",
  organization: "SuperFamilia Mercados S.A.",
  location: "Av. Blanco Galindo N° 3450, Cochabamba, Bolivia",
  activeCameras: 7,
  initials: "CM",
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
  expiresAt: "2026-05-15T00:00:00-04:00",
  daysRemaining: 45,
  startedAt: "2025-05-15T00:00:00-04:00",
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
    value: "14 min",
    change: "-1.3 min",
    changePositive: false,
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
  const now = new Date();
  const date = new Date(iso);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

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
    const today = new Date();
    const yesterday = new Date();
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
// DATOS DE REPORTES — Gráficos por día (últimos 7 días)
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
  { day: "Mié", date: "25/03", count: 1087 },
  { day: "Jue", date: "26/03", count: 1143 },
  { day: "Vie", date: "27/03", count: 1389 },
  { day: "Sáb", date: "28/03", count: 1820 },
  { day: "Dom", date: "29/03", count: 1654 },
  { day: "Lun", date: "30/03", count: 978 },
  { day: "Mar", date: "31/03", count: 1204 },
];

export const DAILY_ALERTS_7D: DailyAlertsPoint[] = [
  { day: "Mié", date: "25/03", intrusion: 1, stolen: 0, fall: 0, ocr: 2, people: 1, tampering: 0 },
  { day: "Jue", date: "26/03", intrusion: 0, stolen: 1, fall: 1, ocr: 1, people: 0, tampering: 0 },
  { day: "Vie", date: "27/03", intrusion: 2, stolen: 1, fall: 0, ocr: 3, people: 2, tampering: 0 },
  { day: "Sáb", date: "28/03", intrusion: 3, stolen: 2, fall: 1, ocr: 4, people: 3, tampering: 1 },
  { day: "Dom", date: "29/03", intrusion: 2, stolen: 1, fall: 0, ocr: 2, people: 1, tampering: 0 },
  { day: "Lun", date: "30/03", intrusion: 1, stolen: 0, fall: 1, ocr: 1, people: 0, tampering: 0 },
  { day: "Mar", date: "31/03", intrusion: 2, stolen: 1, fall: 1, ocr: 1, people: 1, tampering: 1 },
];

export const HOURLY_ACTIVITY_TODAY: HourlyActivityPoint[] = [
  { hour: "06", count: 42 },
  { hour: "07", count: 87 },
  { hour: "08", count: 134 },
  { hour: "09", count: 178 },
  { hour: "10", count: 210 },
  { hour: "11", count: 195 },
  { hour: "12", count: 88 },
  { hour: "13", count: 76 },
  { hour: "14", count: 142 },
  { hour: "15", count: 168 },
  { hour: "16", count: 145 },
  { hour: "17", count: 112 },
  { hour: "18", count: 68 },
  { hour: "19", count: 45 },
  { hour: "20", count: 14 },
  { hour: "21", count: 5 },
];

// Alertas por módulo totalizadas (para donut / barra horizontal)
export const ALERTS_BY_MODULE = [
  { moduleId: "intrusion" as ModuleId, label: "Intrusión", count: 11, color: "#fbbf24" },
  { moduleId: "ocr" as ModuleId, label: "OCR / Placas", count: 14, color: "#3b82f6" },
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
// DATOS DE REPORTES — 30 días (Marzo 2026)
// ─────────────────────────────────────────────────────────────

export const DAILY_PEOPLE_30D: DailyPeoplePoint[] = [
  { day: "01/03", date: "01/03", count: 1567 },
  { day: "02/03", date: "02/03", count: 912 },
  { day: "03/03", date: "03/03", count: 1034 },
  { day: "04/03", date: "04/03", count: 1089 },
  { day: "05/03", date: "05/03", count: 1156 },
  { day: "06/03", date: "06/03", count: 1387 },
  { day: "07/03", date: "07/03", count: 1798 },
  { day: "08/03", date: "08/03", count: 1634 },
  { day: "09/03", date: "09/03", count: 934 },
  { day: "10/03", date: "10/03", count: 1067 },
  { day: "11/03", date: "11/03", count: 1102 },
  { day: "12/03", date: "12/03", count: 1178 },
  { day: "13/03", date: "13/03", count: 1421 },
  { day: "14/03", date: "14/03", count: 1756 },
  { day: "15/03", date: "15/03", count: 1589 },
  { day: "16/03", date: "16/03", count: 901 },
  { day: "17/03", date: "17/03", count: 1023 },
  { day: "18/03", date: "18/03", count: 1090 },
  { day: "19/03", date: "19/03", count: 1132 },
  { day: "20/03", date: "20/03", count: 1356 },
  { day: "21/03", date: "21/03", count: 1689 },
  { day: "22/03", date: "22/03", count: 1612 },
  { day: "23/03", date: "23/03", count: 945 },
  { day: "24/03", date: "24/03", count: 1056 },
  { day: "25/03", date: "25/03", count: 1087 },
  { day: "26/03", date: "26/03", count: 1143 },
  { day: "27/03", date: "27/03", count: 1389 },
  { day: "28/03", date: "28/03", count: 1820 },
  { day: "29/03", date: "29/03", count: 1654 },
  { day: "30/03", date: "30/03", count: 978 },
  { day: "31/03", date: "31/03", count: 1204 },
];

// Período anterior (7 días previos, para comparación)
export const DAILY_PEOPLE_7D_PREV: DailyPeoplePoint[] = [
  { day: "Mié", date: "18/03", count: 1090 },
  { day: "Jue", date: "19/03", count: 1132 },
  { day: "Vie", date: "20/03", count: 1356 },
  { day: "Sáb", date: "21/03", count: 1689 },
  { day: "Dom", date: "22/03", count: 1612 },
  { day: "Lun", date: "23/03", count: 945 },
  { day: "Mar", date: "24/03", count: 1056 },
];

// ─────────────────────────────────────────────────────────────
// DATOS POR CÁMARA — Afluencia horaria (hoy)
// ─────────────────────────────────────────────────────────────

export const CAMERA_HOURLY: Record<string, HourlyActivityPoint[]> = {
  "cam-001": [
    { hour: "06", count: 28 },
    { hour: "07", count: 72 },
    { hour: "08", count: 115 },
    { hour: "09", count: 148 },
    { hour: "10", count: 132 },
    { hour: "11", count: 120 },
    { hour: "12", count: 54 },
    { hour: "13", count: 48 },
    { hour: "14", count: 98 },
    { hour: "15", count: 112 },
    { hour: "16", count: 87 },
    { hour: "17", count: 63 },
    { hour: "18", count: 42 },
    { hour: "19", count: 28 },
    { hour: "20", count: 9 },
    { hour: "21", count: 3 },
  ],
  "cam-002": [
    { hour: "06", count: 5 },
    { hour: "07", count: 18 },
    { hour: "08", count: 34 },
    { hour: "09", count: 52 },
    { hour: "10", count: 68 },
    { hour: "11", count: 75 },
    { hour: "12", count: 41 },
    { hour: "13", count: 38 },
    { hour: "14", count: 55 },
    { hour: "15", count: 62 },
    { hour: "16", count: 49 },
    { hour: "17", count: 34 },
    { hour: "18", count: 21 },
    { hour: "19", count: 12 },
    { hour: "20", count: 4 },
    { hour: "21", count: 1 },
  ],
  "cam-003": [
    { hour: "06", count: 3 },
    { hour: "07", count: 8 },
    { hour: "08", count: 12 },
    { hour: "09", count: 9 },
    { hour: "10", count: 7 },
    { hour: "11", count: 5 },
    { hour: "12", count: 2 },
    { hour: "13", count: 3 },
    { hour: "14", count: 6 },
    { hour: "15", count: 4 },
    { hour: "16", count: 5 },
    { hour: "17", count: 3 },
    { hour: "18", count: 0 },
    { hour: "19", count: 0 },
    { hour: "20", count: 0 },
    { hour: "21", count: 0 },
  ],
  "cam-004": [
    { hour: "06", count: 8 },
    { hour: "07", count: 22 },
    { hour: "08", count: 45 },
    { hour: "09", count: 62 },
    { hour: "10", count: 74 },
    { hour: "11", count: 68 },
    { hour: "12", count: 28 },
    { hour: "13", count: 25 },
    { hour: "14", count: 52 },
    { hour: "15", count: 63 },
    { hour: "16", count: 55 },
    { hour: "17", count: 40 },
    { hour: "18", count: 22 },
    { hour: "19", count: 14 },
    { hour: "20", count: 5 },
    { hour: "21", count: 1 },
  ],
  "cam-005": [
    { hour: "06", count: 12 },
    { hour: "07", count: 28 },
    { hour: "08", count: 35 },
    { hour: "09", count: 22 },
    { hour: "10", count: 18 },
    { hour: "11", count: 14 },
    { hour: "12", count: 8 },
    { hour: "13", count: 10 },
    { hour: "14", count: 15 },
    { hour: "15", count: 18 },
    { hour: "16", count: 22 },
    { hour: "17", count: 30 },
    { hour: "18", count: 38 },
    { hour: "19", count: 25 },
    { hour: "20", count: 8 },
    { hour: "21", count: 4 },
  ],
  "cam-006": [
    { hour: "06", count: 2 },
    { hour: "07", count: 8 },
    { hour: "08", count: 18 },
    { hour: "09", count: 24 },
    { hour: "10", count: 19 },
    { hour: "11", count: 15 },
    { hour: "12", count: 7 },
    { hour: "13", count: 6 },
    { hour: "14", count: 12 },
    { hour: "15", count: 14 },
    { hour: "16", count: 10 },
    { hour: "17", count: 7 },
    { hour: "18", count: 4 },
    { hour: "19", count: 2 },
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
    { hour: "07", count: 2 },
    { hour: "08", count: 3 },
    { hour: "09", count: 2 },
    { hour: "10", count: 1 },
    { hour: "11", count: 2 },
    { hour: "12", count: 1 },
    { hour: "13", count: 1 },
    { hour: "14", count: 2 },
    { hour: "15", count: 1 },
    { hour: "16", count: 1 },
    { hour: "17", count: 2 },
    { hour: "18", count: 3 },
    { hour: "19", count: 1 },
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
      "El sábado 28/03 registró 1,820 personas — el mayor flujo de la semana. La zona de góndolas alcanzó densidad máxima entre las 15:00 y 17:00.",
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
      "Se registraron 3 eventos de caída en 7 días, todos en Pasillos Centro. Hora más frecuente: 15:00–17:00, que coincide con el pico de afluencia.",
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
      "Los lunes registran consistentemente un 19% menos de clientes vs. el promedio semanal (912 personas el 02/03, 934 el 09/03, 978 el 30/03).",
    metric: "-19% vs. promedio",
    recommendation:
      "Aprovecha los lunes para mantenimiento, reorganización de góndolas y capacitación de personal sin impactar la experiencia de compra.",
    source: "traffic",
  },
  {
    id: "ins-005",
    type: "warning",
    title: "Alertas de intrusión concentradas",
    description:
      "cam-003 (Bodega Principal) generó 2 alertas de intrusión esta semana, ambas en el rango 18:00–20:00, justo al cierre del módulo de acceso autorizado.",
    metric: "2 alertas en bodega",
    recommendation:
      "Verificar si hay personal con horas extra no registradas. Considera ampliar el horario de acceso autorizado de 18:00 a 20:00 o ajustar el módulo.",
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
      "¡Muy buena observación! Si realizaste una campaña de marketing, el incremento del 38% en tráfico registrado el sábado 28/03 (1,820 personas) es completamente consistente con ese tipo de acción. Las campañas bien ejecutadas en supermercados de Cochabamba suelen generar picos de between 25–45% en el día de mayor impacto.\n\nTe recomiendo documentar las fechas de tus campañas para poder correlacionar automáticamente el impacto en los próximos reportes. ¿Fue una campaña en redes sociales, volanteo o radio?",
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
      "El mayor incremento registrado en los últimos 7 días fue el sábado 28/03 con 1,820 personas (+38% vs. el promedio semanal de 1,247). El segundo pico fue el domingo 29/03 con 1,654 personas.\n\nEstos patrones son típicos en supermercados bolivianos: inicio de quincena + fin de semana genera una combinación fuerte. Si el incremento fue mayor al esperado, factores como una campaña, un evento local en Cochabamba, o el cierre de un competidor podrían explicarlo.",
  },
  {
    triggers: ["caída", "caidas", "accidente", "persona en el suelo"],
    response:
      "En los últimos 7 días se registraron 3 eventos de caída, todos en Pasillos Centro (cam-004). El patrón es claro: todas ocurrieron entre las 15:00 y 17:00, que coincide exactamente con el pico de afluencia.\n\nEsto sugiere que el problema puede ser una combinación de tráfico alto + condición del piso. Recomiendo: (1) inspección del pasillo 5, (2) señalización de piso y (3) limpieza más frecuente en ese rango horario.",
  },
  {
    triggers: ["intrusion", "intrusión", "bodega", "acceso no autorizado"],
    response:
      "Se detectaron 2 alertas de intrusión en Bodega Principal (cam-003) esta semana, ambas en el rango 18:00–20:00. Esto sugiere que puede haber personal trabajando horas extra sin registrar el acceso en el sistema.\n\nEl módulo está configurado para activarse desde las 18:00, pero si hay operaciones legítimas hasta las 20:00, te recomiendo ajustar el horario del módulo para evitar falsas alarmas y enfocarte en las alertas realmente críticas.",
  },
  {
    triggers: ["lunes", "semana", "dia de menor", "bajo flujo"],
    response:
      "Los lunes son consistentemente el día de menor tráfico: promedian un 19% menos que el resto de la semana. En lo que va de marzo: 912 personas (02/03), 934 (09/03), 901 (16/03), 945 (23/03), 978 (30/03).\n\nEste es el mejor día para: reorganización de góndolas, mantenimiento de cámaras, capacitación de personal y reposición de inventario sin interrumpir la experiencia de compra.",
  },
  {
    triggers: ["comparar", "mes anterior", "semana anterior", "tendencia"],
    response:
      "Comparando la semana actual (7,273 personas) vs. la anterior (7,720 personas), hay una variación de -5.8%. Sin embargo, si comparo el mismo sábado: 28/03 tuvo 1,820 vs. 21/03 que tuvo 1,689 (+7.8%).\n\nLa tendencia mensual de marzo 2026 muestra un crecimiento promedio de +4.2% semana a semana. El pico histórico del mes fue el sábado 28/03.",
  },
  {
    triggers: ["recomendacion", "recomendación", "qué hago", "que hago", "consejo", "sugerencia"],
    response:
      "Basándome en los datos actuales de SuperFamilia, estas son mis 3 recomendaciones principales:\n\n1. **Refuerza los sábados 14–18h**: Son las 4 horas con mayor densidad. Un cajero adicional y más personal en góndolas puede mejorar la experiencia.\n\n2. **Revisa cam-007**: Lleva más de 24h offline tras un evento de tampering. Es una zona ciega en administración.\n\n3. **Ajusta el horario del módulo de Intrusión en Bodega**: Las alertas del rango 18–20h parecen ser de personal autorizado, no intrusos.",
  },
];

export function getAIResponse(question: string): string {
  const q = question.toLowerCase();
  const match = AI_RESPONSES.find((r) => r.triggers.some((t) => q.includes(t)));
  if (match) return match.response;

  return "Entiendo tu pregunta. Basándome en la actividad de SuperFamilia Mercados en el período actual, te puedo decir que los patrones de afluencia son consistentes con supermercados de Cochabamba en temporada normal.\n\nSi tienes un evento específico que quieres analizar (campaña, feriado, cambio de lay-out, cierre de competidor), compárteme el contexto y puedo ayudarte a correlacionarlo con los datos. Prueba preguntarme sobre: campañas, incrementos, caídas, intrusiones, el lunes o comparar períodos.";
}
