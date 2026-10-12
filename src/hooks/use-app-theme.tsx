import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useState } from "react";

type AppTheme = "dark" | "light";

interface ThemeContextValue {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => Promise<void>;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  setTheme: async () => {},
});

export function useAppTheme() {
  return useContext(ThemeContext);
}

export function useThemeState(initial: AppTheme = "light") {
  const [theme, setThemeState] = useState<AppTheme>(initial);

  const setTheme = async (newTheme: AppTheme) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem("vigia_theme", newTheme);
  };

  return { theme, setTheme };
}
