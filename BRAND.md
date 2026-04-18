# VigIA — Brand & Design System

<p align="center">
  <img src="assets/images/logotipo.png" alt="VigIA Logo" width="280" />
</p>

## Concepto de Marca

**VigIA** fusiona **"Vigilancia"** con **"IA"** (Inteligencia Artificial). La marca representa una plataforma de videovigilancia inteligente que transforma la observación pasiva en insights accionables mediante inteligencia artificial.

### Filosofía de Diseño

- **Dark Mode First** — La interfaz oscura es el tema principal, reflejando la naturaleza de monitoreo 24/7 y reduciendo fatiga visual en centros de control.
- **Jerarquía clara** — Sistema de 3 niveles de texto (primario, secundario, terciario) con colores semánticos por módulo.
- **Colores con intención** — Cada módulo de detección tiene un color asignado que se mantiene consistente en toda la app.
- **Movimiento sutil y funcional** — Animaciones con propósito: indicar estado, guiar atención, nunca distraer.
- **Tarjetas contenidas** — Bordes suaves (14px radius), sin sombras agresivas, separación por bordes finos.

---

## Identidad Visual

### Isotipo (Ícono)

La **"V" geométrica** está compuesta de segmentos angulares que representan:

| Elemento                            | Significado                                   |
| ----------------------------------- | --------------------------------------------- |
| Lado izquierdo (azul claro → medio) | Observación, vigilancia                       |
| Lado derecho (azul oscuro + rayo)   | Inteligencia artificial, velocidad, detección |
| Base inferior (azul profundo)       | Estabilidad, confianza                        |

### Logotipo

En la tipografía **"VigIA"**:

- **"Vig"** usa tonos de azul oscuro a medio (navy → blue)
- **"IA"** usa azul claro (`#60a5fa` → `#93c5fd`), destacando el componente de inteligencia artificial

### Archivos del Logo

| Archivo                           | Uso                          |
| --------------------------------- | ---------------------------- |
| `assets/images/isotipo.png`       | Ícono solo (marca "V")       |
| `assets/images/logotipo.png`      | Logo completo (fondo claro)  |
| `assets/images/logotipo-dark.png` | Logo completo (fondo oscuro) |
| `assets/images/logo.png`          | Variante alternativa clara   |
| `assets/images/logo-dark.png`     | Variante alternativa oscura  |

### Mascota: Búho

Un búho geométrico renderizado proceduralmente (SVG) que:

- Cambia de color según el módulo de detección activo
- Tiene animación de flotación con spring physics
- 3 tamaños: small (56px), medium (96px), large (128px)

---

## Paleta de Colores

### Gradiente Principal de Marca

```
#1e3a8a  Brand Navy     ████████
#2563eb  Brand Blue     ████████
#3b82f6  Primary Blue   ████████  ← Acento principal
#60a5fa  Brand Sky      ████████
#93c5fd  Brand Ice      ████████
```

Todos los gradientes de la app parten de **Brand Navy (`#1e3a8a`)** como punto de origen, creando un lenguaje visual unificado.

### Colores por Módulo de Detección

| Módulo       | Color   | Hex       | Uso                       |
| ------------ | ------- | --------- | ------------------------- |
| 🔤 OCR       | Azul    | `#3b82f6` | Detección de placas       |
| 👤 Personas  | Azul    | `#3b82f6` | Detección de personas     |
| 🚧 Intrusión | Ámbar   | `#fbbf24` | Violación de perímetro    |
| 🚗 Robados   | Rojo    | `#f87171` | Objetos/vehículos robados |
| 🤸 Caídas    | Naranja | `#fb923c` | Detección de caídas       |
| 📷 Tampering | Púrpura | `#a78bfa` | Manipulación de cámara    |

### Colores Semánticos de Estado

| Estado               | Color     | Hex       |
| -------------------- | --------- | --------- |
| ✅ Éxito / Normal    | Esmeralda | `#34d399` |
| ⚠️ Advertencia       | Ámbar     | `#fbbf24` |
| 🔴 Crítico / Peligro | Rojo      | `#f87171` |
| 🟠 Urgente / Alerta  | Naranja   | `#fb923c` |

### Severidad de Alertas

| Nivel | Color   | Hex       | Animación                  |
| ----- | ------- | --------- | -------------------------- |
| ALTA  | Rojo    | `#ef4444` | Pulso de escala (1 → 1.03) |
| MEDIA | Naranja | `#d97706` | Estático                   |
| BAJA  | Verde   | `#059669` | Estático                   |

### Tema Oscuro (Principal)

| Token               | Color     | Hex       | Uso                   |
| ------------------- | --------- | --------- | --------------------- |
| `darkBg`            | Slate-950 | `#020617` | Fondo principal       |
| `darkCard`          | Slate-900 | `#0f172a` | Fondo de tarjetas     |
| `darkSecondary`     | Slate-800 | `#1e293b` | Elementos secundarios |
| `darkBorder`        | Slate-700 | `#334155` | Bordes y divisores    |
| `darkTextPrimary`   | Blanco    | `#ffffff` | Texto principal       |
| `darkTextSecondary` | Slate-200 | `#e2e8f0` | Texto secundario      |
| `darkTextTertiary`  | Slate-300 | `#cbd5e1` | Texto de soporte      |
| `darkTextLabel`     | Slate-400 | `#94a3b8` | Labels, hints         |

### Tema Claro

| Token                | Color     | Hex       | Uso                      |
| -------------------- | --------- | --------- | ------------------------ |
| `lightBg`            | Slate-50  | `#f8fafc` | Fondo principal          |
| `lightCard`          | Blanco    | `#ffffff` | Fondo de tarjetas        |
| `lightBorder`        | Slate-300 | `#cbd5e1` | Bordes (mayor contraste) |
| `lightTextPrimary`   | Slate-900 | `#0f172a` | Texto principal          |
| `lightTextSecondary` | Slate-700 | `#334155` | Texto secundario         |

### Opacidades de Color de Módulo

Los colores de módulo se usan con diferentes niveles de opacidad según el contexto:

| Sufijo   | Opacidad | Uso                       |
| -------- | -------- | ------------------------- |
| `+ "22"` | ~13%     | Fondo sutil (icon badges) |
| `+ "33"` | ~20%     | Fondo medio (overlays)    |
| `+ "66"` | ~40%     | Bordes con peso           |
| `+ "CC"` | ~80%     | Acentos fuertes           |

---

## Tipografía

### Familias Tipográficas

| Familia | Fuente         | Paquete                         | Uso                                  |
| ------- | -------------- | ------------------------------- | ------------------------------------ |
| `$body` | **DM Sans**    | `@expo-google-fonts/dm-sans`    | Textos, títulos, UI general          |
| `$mono` | **Space Mono** | `@expo-google-fonts/space-mono` | Números, métricas, timestamps, datos |

### DM Sans — Pesos Disponibles

| Peso       | Nombre         | Uso                                                      |
| ---------- | -------------- | -------------------------------------------------------- |
| 400        | Regular        | Texto de cuerpo, texto secundario                        |
| 400 Italic | Regular Italic | Recomendaciones, texto terciario                         |
| 500        | Medium         | Labels, chips, énfasis sutil                             |
| 600        | SemiBold       | Títulos de tarjetas, headers de sección, tabs activos    |
| 700        | Bold           | Headings principales, valores KPI, labels de formularios |

### Space Mono — Pesos Disponibles

| Peso | Nombre  | Uso                                      |
| ---- | ------- | ---------------------------------------- |
| 400  | Regular | Datos secundarios, timestamps            |
| 700  | Bold    | Valores principales, métricas destacadas |

### Escala Tipográfica

| Nivel | DM Sans | Space Mono | Uso típico                   |
| ----- | ------- | ---------- | ---------------------------- |
| 1     | 11px    | 10px       | Micro labels                 |
| 2     | 12px    | 11px       | Texto pequeño, descripciones |
| 3     | 13px    | 12px       | Cuerpo de texto              |
| 4     | 14px    | 13px       | Texto estándar (base)        |
| 5     | 15px    | 14px       | Cuerpo ampliado              |
| 6     | 16px    | 16px       | Subtítulos                   |
| 7     | 18px    | 18px       | Títulos de sección           |
| 8     | 20px    | 20px       | Títulos grandes              |
| 9     | 22px    | —          | Extra large                  |
| 10    | 24px    | —          | Display / KPI values         |
| 11    | 28px    | —          | Large display                |
| 12    | 32px    | —          | Extra large display          |

### Letter Spacing

- **Por defecto:** 0 (sin tracking adicional)
- **Caps / Labels:** `1.2px`
- **KPI Cards (números):** `-0.5px` (tracking reducido)

---

## Espaciado y Layout

### Sistema de Espaciado

La app sigue un ritmo basado en múltiplos de 4px:

| Token    | Valor | Uso                                              |
| -------- | ----- | ------------------------------------------------ |
| Micro    | 3-4px | Spacing dentro de chips compactos                |
| XSmall   | 6px   | Gap entre ícono y texto                          |
| Small    | 8px   | Padding de tarjetas compactas, márgenes internos |
| Standard | 12px  | Padding de tarjetas, secciones                   |
| Medium   | 14px  | Padding de componentes más grandes               |
| Large    | 16px  | Padding mayor, espaciado de secciones            |
| XLarge   | 20px  | Headers de bottom sheets                         |
| 2XL      | 24px  | Márgenes entre secciones principales             |
| 3XL      | 32px  | Spacing del logo en sidebar web                  |

### Border Radius

| Radio    | Uso                                                          |
| -------- | ------------------------------------------------------------ |
| 6px      | Controles pequeños, botones compactos                        |
| 8px      | Contenedores badge/chip                                      |
| 10px     | Tarjetas pequeñas, chips de módulo, thumbnails               |
| 12px     | Tarjetas medianas, cajas de info                             |
| **14px** | **Radio principal** — KPI cards, module cards, insight cards |
| 16px     | Tarjetas grandes (camera cards)                              |
| 18px     | Pills de tab bar (indicador activo)                          |
| 100px    | Redondo completo (badges, botones pill)                      |

### Breakpoints Responsivos (Tamagui Media)

```
xs:    ≤ 660px
sm:    ≤ 800px
md:    ≤ 1020px
lg:    ≤ 1280px
xl:    ≤ 1420px
xxl:   ≤ 1600px

gtXs:  ≥ 661px
gtSm:  ≥ 801px
gtMd:  ≥ 1021px
gtLg:  ≥ 1281px

short: ≤ 820px alto
tall:  ≥ 820px alto
```

### Escalado Web Desktop

En pantallas ≥1200px de ancho, se aplica un `zoom: 1.22` global para escalar proporcionalmente todos los tamaños de fuente y espaciado de React Native.

---

## Patrones de Componentes

### Tarjeta Base

```
┌─────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  ← Barra de gradiente (3px)
│                             │     (#1e3a8a → color del módulo)
│  Contenido                  │  ← Padding: 14px
│                             │     Border: 1px, theme-aware
│                             │     Radius: 14px
└─────────────────────────────┘
```

### KPI Card

```
┌─────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  Gradiente
│ Label           │  11px, DM Sans, Medium, placeholder color
│ 1,247           │  24px, Space Mono, Bold, texto principal
│ ↑ +12.5%        │  11px, Space Mono, SemiBold, color de estado
└─────────────────┘
```

### Icon Badge

```
┌──────────┐
│          │  36 × 36px
│   icon   │  Radius: 10px
│          │  Background: moduleColor + "22" (13% opacidad)
└──────────┘
```

### Camera Card

```
┌─────────────────────────────┐
│                             │
│  [Preview 160px]            │  ← Imagen con scanline animado
│  ● Online        ┌──┐┌──┐  │  ← Status dot + Module chips
│                   │  ││  │  │
└─────────────────────────────┘
│  Camera Name                │  14px, Bold
│  Metric1 | Metric2 | Met3  │  3 columnas de métricas
└─────────────────────────────┘
```

---

## Animaciones

| Animación         | Componente       | Duración                     | Loop |
| ----------------- | ---------------- | ---------------------------- | ---- |
| Entrada staggered | KPI Cards        | 350ms + (index × 80ms) delay | No   |
| Float (spring)    | Búho mascota     | stiffness 80, damping 10     | Sí   |
| Pulso verde       | Cámaras online   | 1200ms                       | Sí   |
| Pulso rojo        | Cámaras alerta   | 800ms                        | Sí   |
| Pulso severidad   | Badge ALTA       | 1500ms (scale 1→1.03)        | Sí   |
| Scanline          | Preview cámara   | 4000ms (translateY)          | Sí   |
| Typing dots       | Chat AI pensando | Rápido                       | Sí   |

**Librería:** [Moti](https://moti.fyi/) (Reanimated)

---

## Stack Tecnológico de UI

| Herramienta                                                                        | Propósito                                   |
| ---------------------------------------------------------------------------------- | ------------------------------------------- |
| [Tamagui](https://tamagui.dev)                                                     | Framework de UI, temas, tokens, componentes |
| [Expo Router](https://docs.expo.dev/router)                                        | Navegación file-based                       |
| [Moti](https://moti.fyi)                                                           | Animaciones declarativas                    |
| [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) | Gradientes                                  |
| [Lucide React Native](https://lucide.dev)                                          | Iconografía (18-24px)                       |
| DM Sans + Space Mono                                                               | Tipografía (Google Fonts via Expo)          |

---

## Principios de Diseño

1. **Accesibilidad** — Bordes más oscuros en modo claro para contraste suficiente
2. **Consistencia** — Colores de módulo idénticos en cards, chips, badges y gráficos
3. **Jerarquía** — Sistema de 3 niveles de texto con opacidades definidas
4. **Gradientes unificados** — Siempre desde Brand Navy (`#1e3a8a`)
5. **Movimiento con propósito** — Animaciones sutiles que informan, no distraen
6. **Ritmo de espaciado** — Múltiplos consistentes de 4px/8px/12px/16px
7. **Iconografía uniforme** — Lucide React Native, 18-24px, color contextual
8. **Tarjetas contenidas** — Bordes finos, radios suaves (14px), sin sombras duras
9. **Dark Mode First** — Tema oscuro por defecto, modo claro como variante secundaria
10. **Datos en mono** — Siempre Space Mono para números, métricas y timestamps
