# VigIA

Aplicación móvil de VigIA para monitoreo y análisis inteligente.

## 🎨 Sistema de Diseño

### Colores Primarios

- **Primary (Cyan)**: `#06b6d4` - Color principal de marca
- **Secondary (Blue)**: `#3b82f6` - Color secundario de marca

### Colores de Acento

- **Success (Emerald)**: `#34d399` - Confirmaciones y estados positivos
- **Purple**: `#a78bfa` - Métricas secundarias
- **Warning (Amber)**: `#fbbf24` - Destacados y advertencias
- **Danger (Red)**: `#f87171` - Alertas críticas
- **Alert (Orange)**: `#fb923c` - Caídas y urgencia media

### Colores por Módulo

- **OCR y Placas**: Cyan `#06b6d4`
- **Análisis de Personas**: Blue `#3b82f6`
- **Intrusión y Perímetros**: Amber `#fbbf24`
- **Objetos Robados**: Red `#f87171`
- **Caídas y Movimiento**: Orange `#fb923c`
- **Clasificación y Tampering**: Purple `#a78bfa`

### Dark Mode

- Fondo principal: `#020617` (slate-950)
- Cards: `#0f172a` (slate-900)
- Elementos secundarios: `#1e293b` (slate-800)
- Bordes: `#334155` (slate-700)
- Texto primario: `#ffffff` (blanco)
- Texto secundario: `#cbd5e1` (slate-300)
- Texto terciario: `#94a3b8` (slate-400)
- Labels: `#64748b` (slate-500)

### Light Mode

- Fondo principal: `#f8fafc` (slate-50)
- Cards: `#ffffff` (blanco)
- Bordes: `#e2e8f0` (slate-200)
- Texto primario: `#0f172a` (slate-900)
- Texto secundario: `#475569` (slate-600)

## 🚀 Scripts

```bash
# Iniciar el servidor de desarrollo
npm start

# Iniciar en Android
npm run android

# Iniciar en iOS
npm run ios

# Iniciar en web
npm run web

# Linting
npm run lint

# Formateo con Prettier
npm run format
npm run format:check

# Verificación de tipos TypeScript
npm run type-check
```

## 🔧 Stack Tecnológico

- **Framework**: Expo 54
- **UI Library**: Tamagui 2.0
- **Navigation**: Expo Router 6
- **Language**: TypeScript 5.9
- **Animations**: Moti & Reanimated

## 📦 CI/CD

El proyecto incluye GitHub Actions configurado para:

- ✅ ESLint
- ✅ TypeScript type checking
- ✅ Prettier formatting
- ✅ Expo Doctor

Los workflows se ejecutan en todos los push y pull requests a cualquier rama.

## 📱 Desarrollo

Este proyecto usa Expo Router para la navegación basada en archivos. La estructura de la app está en el directorio `app/`.

La configuración de temas y colores está en `tamagui.config.ts`.

## 📄 Licencia

Privado - VigIA Group
