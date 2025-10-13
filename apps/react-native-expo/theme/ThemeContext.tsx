import React, { createContext, useContext, useState } from "react";
import { ThemeContextType, ThemeColors } from "../types";

const lightTheme: ThemeColors = {
  background: "#eaeaea",
  cardBackground: "#ffffff",
  text: "#111111",
  textSecondary: "#757575",
  accent: "#008080",
  border: "#dcdcdc",
  inputBackground: "#ffffff",
  errorBackground: "rgba(255, 0, 0, 0.1)",
  successBackground: "rgba(0, 128, 128, 0.1)",
  warningBackground: "rgba(255, 193, 7, 0.1)",
};

const darkTheme: ThemeColors = {
  background: "#121212",
  cardBackground: "#1e1e1e",
  text: "#ffffff",
  textSecondary: "#b3b3b3",
  accent: "#00a6a6",
  border: "#333333",
  inputBackground: "#2c2c2c",
  errorBackground: "rgba(255, 99, 99, 0.2)",
  successBackground: "rgba(0, 150, 150, 0.2)",
  warningBackground: "rgba(255, 213, 79, 0.2)",
};

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
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const colors = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};
