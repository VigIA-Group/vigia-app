import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `
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
