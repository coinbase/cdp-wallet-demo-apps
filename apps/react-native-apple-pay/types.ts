export interface ThemeColors {
  background: string;
  cardBackground: string;
  text: string;
  textSecondary: string;
  accent: string;
  border: string;
  inputBackground: string;
  errorBackground: string;
  successBackground: string;
  warningBackground: string;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: ThemeColors;
}

export type AuthMethod = "email" | "sms" | "oauth";

export interface DarkModeToggleProps {
  style?: any;
  iconStyle?: any;
  showText?: boolean;
}
