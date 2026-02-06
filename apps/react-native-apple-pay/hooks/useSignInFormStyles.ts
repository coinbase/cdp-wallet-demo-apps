import { StyleSheet, Platform, Dimensions } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export const useSignInFormStyles = () => {
  const { colors } = useTheme();
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const isSmallScreen = screenHeight < 700;

  return StyleSheet.create({
    keyboardContainer: {
      flex: 1,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: 20,
      paddingVertical: isSmallScreen ? 20 : 40,
      minHeight: screenHeight - (Platform.OS === "ios" ? 100 : 80),
    },
    scrollContainerWithOtp: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: 20,
      paddingVertical: isSmallScreen ? 20 : 40,
      paddingBottom: isSmallScreen ? 150 : 180,
      minHeight: screenHeight - (Platform.OS === "ios" ? 100 : 80),
    },
    container: {
      alignItems: "center",
      justifyContent: "center",
    },
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: isSmallScreen ? 24 : 32,
      width: "100%",
      maxWidth: 400,
      minWidth: Math.min(screenWidth - 40, 280),
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    header: {
      alignItems: "center",
      marginBottom: isSmallScreen ? 24 : 32,
      position: "relative",
    },
    backButton: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    backButtonText: {
      fontSize: 18,
      color: colors.text,
      fontWeight: "600",
    },
    logoCircle: {
      width: isSmallScreen ? 56 : 64,
      height: isSmallScreen ? 56 : 64,
      borderRadius: isSmallScreen ? 28 : 32,
      backgroundColor: colors.accent,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    logoText: {
      color: "#ffffff",
      fontSize: isSmallScreen ? 28 : 32,
      fontWeight: "bold",
    },
    title: {
      fontSize: isSmallScreen ? 20 : 24,
      fontWeight: "500",
      color: colors.text,
      textAlign: "center",
    },
    form: {
      width: "100%",
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.inputBackground,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: Platform.OS === "ios" ? 16 : 14,
      fontSize: 16,
      color: colors.text,
      marginBottom: isSmallScreen ? 20 : 24,
      minHeight: Platform.OS === "android" ? 48 : 44,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "stretch",
      marginBottom: isSmallScreen ? 20 : 24,
    },
    flagContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: Platform.OS === "ios" ? 16 : 14,
      borderWidth: 1,
      borderColor: colors.border,
      borderTopLeftRadius: 8,
      borderBottomLeftRadius: 8,
      backgroundColor: colors.inputBackground,
      minHeight: Platform.OS === "android" ? 48 : 44,
      justifyContent: "center",
    },
    flagText: {
      fontSize: 16,
      marginRight: 4,
    },
    countryCode: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "500",
    },
    phoneInput: {
      backgroundColor: colors.inputBackground,
      borderRadius: 0,
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
      borderWidth: 1,
      borderLeftWidth: 0,
      borderColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: Platform.OS === "ios" ? 16 : 14,
      fontSize: 16,
      color: colors.text,
      flex: 1,
      minHeight: Platform.OS === "android" ? 48 : 44,
    },
    continueButton: {
      backgroundColor: colors.accent,
      borderRadius: 8,
      paddingVertical: 16,
      alignItems: "center",
      marginBottom: isSmallScreen ? 20 : 24,
      minHeight: 48,
      justifyContent: "center",
    },
    continueButtonText: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "600",
    },
    buttonDisabled: {
      opacity: 0.6,
    },
  });
};
