import { useBreakpoint } from "@/src/hooks/use-breakpoint";
import { Platform } from "react-native";
import { View } from "tamagui";

/**
 * On wide screens: scales text via CSS zoom so it feels desktop-sized.
 * Does NOT constrain max-width — each screen handles its own grid layout.
 * On mobile: renders children as-is.
 */
export function PageContainer({ children }: { children: React.ReactNode }) {
  const { isWide, isDesktop } = useBreakpoint();

  if (!isWide) {
    return <>{children}</>;
  }

  // zoom scales all RN inline font-size / spacing proportionally on desktop.
  const zoomStyle = Platform.OS === "web" && isDesktop ? ({ zoom: 1.45 } as any) : undefined;

  return (
    <View flex={1} style={zoomStyle}>
      {children}
    </View>
  );
}
