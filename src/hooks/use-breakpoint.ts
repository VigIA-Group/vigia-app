import { useWindowDimensions } from "react-native";

export function useBreakpoint() {
  const { width } = useWindowDimensions();
  return {
    isWide: width >= 768,
    isDesktop: width >= 1200,
    width,
  };
}
