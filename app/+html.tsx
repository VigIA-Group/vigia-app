import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
          rel="stylesheet"
        />
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Alias de fuentes para compatibilidad total con Tamagui y Expo */
              @font-face {
                font-family: 'PlusJakartaSans';
                src: local('Plus Jakarta Sans'), local('PlusJakartaSans');
                font-weight: 300 800;
                font-display: swap;
              }
              @font-face {
                font-family: 'IBMPlexMono';
                src: local('Plus Jakarta Sans'), local('PlusJakartaSans');
                font-weight: 300 800;
                font-display: swap;
              }

              /* Tipografía universal Plus Jakarta Sans para toda la aplicación y números */
              html, body, #root, [data-tamagui-component], input, button, textarea, select, text, tspan, * {
                font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }

              /* Cursor pointer para todos los elementos interactivos */
              [role="button"],
              button,
              a,
              [tabindex="0"],
              [data-pressable],
              input[type="submit"],
              input[type="button"],
              label[for] {
                cursor: pointer !important;
              }
              /* Suaviza el scrolling en web */
              * { scroll-behavior: smooth; }
              /* Evita doble tap zoom en mobile web */
              * { touch-action: manipulation; }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
