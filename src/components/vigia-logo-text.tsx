import { useAppTheme } from "@/src/hooks/use-app-theme";
import { Image } from "expo-image";

interface VigIALogoTextProps {
  height?: number;
}

export function VigIALogoText({ height = 28 }: VigIALogoTextProps) {
  const { theme } = useAppTheme();
  const isDark = theme === "dark";

  return (
    <Image
      source={
        isDark
          ? require("../../assets/images/logotipo-dark.png")
          : require("../../assets/images/logotipo.png")
      }
      style={{ height, width: height * 3.5, resizeMode: "contain" } as any}
      contentFit="contain"
    />
  );
}
