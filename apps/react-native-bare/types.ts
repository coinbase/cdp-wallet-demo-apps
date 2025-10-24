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

export type AuthMethod = "email" | "sms";

export interface SignInModalProps {
  visible: boolean;
  onClose: () => void;
  authMethod: AuthMethod;
  onAuthMethodToggle: () => void;
  email: string;
  setEmail: (email: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  otp: string;
  setOtp: (otp: string) => void;
  flowId: string;
  isLoading: boolean;
  onSignIn: () => void;
  onVerifyOTP: () => void;
  slideAnim: any;
}

export interface WelcomeScreenProps {
  onSignInPress: () => void;
}

export interface DarkModeToggleProps {
  style?: any;
  iconStyle?: any;
  showText?: boolean;
}
