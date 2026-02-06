import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { AuthMethod } from "../types";
import { useTheme } from "../theme/ThemeContext";
import { EmailForm } from "./EmailForm";
import { SmsForm } from "./SmsForm";
import { OAuthForm } from "./OAuthForm";
import { OtpForm } from "./OtpForm";

export interface SignInFormProps {}

export const SignInForm: React.FC<SignInFormProps> = () => {
  const { colors } = useTheme();
  const [authMethod, setAuthMethod] = useState<AuthMethod>("email");
  const [flowId, setFlowId] = useState("");

  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const isSmallScreen = screenHeight < 700;

  const handleSignInSuccess = (newFlowId: string) => {
    setFlowId(newFlowId);
  };

  const handleVerifySuccess = () => {
    setFlowId("");
  };

  const handleBack = () => {
    setFlowId("");
  };

  const createStyles = () =>
    StyleSheet.create({
      container: {
        flex: 1,
      },
      tabContainer: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingTop: 20,
        gap: 12,
      },
      tab: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.inputBackground,
        alignItems: "center",
      },
      tabActive: {
        backgroundColor: colors.accent,
        borderColor: colors.accent,
      },
      tabText: {
        fontSize: 14,
        fontWeight: "500",
        color: colors.text,
      },
      tabTextActive: {
        color: "#ffffff",
      },
      formContainer: {
        flex: 1,
      },
      dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: isSmallScreen ? 20 : 24,
        marginTop: 8,
      },
      dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
      },
      dividerText: {
        color: colors.textSecondary,
        fontSize: 14,
        marginHorizontal: 16,
      },
      toggleButtonContainer: {
        gap: 12,
      },
      toggleButton: {
        backgroundColor: colors.inputBackground,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 48,
      },
      toggleIcon: {
        fontSize: 18,
        marginRight: 8,
      },
      toggleButtonText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: "500",
      },
      loginContainer: {
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
        minHeight: screenHeight - (Platform.OS === "ios" ? 350 : 300),
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      },
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
    });

  const styles = createStyles();

  // If we have a flowId, show the OTP form (without tabs)
  if (flowId) {
    return (
      <OtpForm
        authMethod={authMethod}
        flowId={flowId}
        onSuccess={handleVerifySuccess}
        onBack={handleBack}
      />
    );
  }

  // Otherwise show tabs and the selected form
  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "position"}
          style={styles.keyboardContainer}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : -150}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.loginContainer}>
              <View style={styles.card}>
                {authMethod === "email" && <EmailForm onSuccess={handleSignInSuccess} />}
                {authMethod === "sms" && <SmsForm onSuccess={handleSignInSuccess} />}
                {authMethod === "oauth" && <OAuthForm />}
                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>
                <View style={styles.toggleButtonContainer}>
                  {authMethod !== "email" && (
                    <TouchableOpacity
                      style={styles.toggleButton}
                      onPress={() => setAuthMethod("email")}
                    >
                      <Text style={styles.toggleIcon}>{"✉️"}</Text>
                      <Text style={styles.toggleButtonText}>Continue with Email</Text>
                    </TouchableOpacity>
                  )}
                  {authMethod !== "sms" && (
                    <TouchableOpacity
                      style={styles.toggleButton}
                      onPress={() => setAuthMethod("sms")}
                    >
                      <Text style={styles.toggleIcon}>{"📞"}</Text>
                      <Text style={styles.toggleButtonText}>Continue with SMS</Text>
                    </TouchableOpacity>
                  )}
                  {authMethod !== "oauth" && (
                    <TouchableOpacity
                      style={styles.toggleButton}
                      onPress={() => setAuthMethod("oauth")}
                    >
                      <Text style={styles.toggleButtonText}>Continue with Social</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};
