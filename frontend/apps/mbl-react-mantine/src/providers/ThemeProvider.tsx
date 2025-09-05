import React, { createContext, useContext, useState } from "react";
import { MantineProvider } from "@mantine/core";
import { theme, themeVariants, type ThemeVariant } from "../theme";

interface ThemeContextType {
  currentTheme: ThemeVariant;
  setTheme: (theme: ThemeVariant) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeVariant>(() => {
    // 从 localStorage 读取保存的主题，默认为 blue
    const savedTheme = localStorage.getItem("mantine-theme") as ThemeVariant;
    return savedTheme && themeVariants[savedTheme] ? savedTheme : "blue";
  });

  const setTheme = (theme: ThemeVariant) => {
    setCurrentTheme(theme);
    localStorage.setItem("mantine-theme", theme);
  };

  // 创建动态主题
  const dynamicTheme = React.useMemo(() => {
    const baseTheme = { ...theme };
    if (currentTheme && themeVariants[currentTheme]) {
      baseTheme.primaryColor = themeVariants[currentTheme].primaryColor;
    }
    return baseTheme;
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      <MantineProvider theme={dynamicTheme}>{children}</MantineProvider>
    </ThemeContext.Provider>
  );
};
