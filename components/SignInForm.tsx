import React, { useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
  Dimensions,
  Keyboard,
} from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { AuthMethod } from "../types";

export interface SignInFormProps {
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
  onBack?: () => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({
  authMethod,
  onAuthMethodToggle,
  email,
  setEmail,
  phoneNumber,
  setPhoneNumber,
  otp,
  setOtp,
  flowId,
  isLoading,
  onSignIn,
  onVerifyOTP,
  onBack,
}) => {
  const { colors } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const isSmallScreen = screenHeight < 700;

  // Auto-scroll to ensure OTP field and button are visible
  useEffect(() => {
    if (flowId && scrollViewRef.current) {
      // Initial scroll when OTP field appears
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ 
          y: 200, // Scroll up enough to show both OTP field and button
          animated: true 
        });
      }, 300);
    }
  }, [flowId]);

  // Handle keyboard events for better positioning
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      if (flowId && scrollViewRef.current) {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({ 
            y: 250, // Scroll up more when keyboard is visible
            animated: true 
          });
        }, 100);
      }
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      if (flowId && scrollViewRef.current) {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({ 
            y: 150, // Scroll back down a bit when keyboard hides
            animated: true 
          });
        }, 100);
      }
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [flowId]);

  const createStyles = () =>
    StyleSheet.create({
      keyboardContainer: {
        flex: 1,
      },
      scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: isSmallScreen ? 20 : 40,
        paddingBottom: flowId ? (isSmallScreen ? 150 : 180) : (isSmallScreen ? 20 : 40),
        minHeight: screenHeight - (Platform.OS === 'ios' ? 100 : 80),
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
        position: 'relative',
      },
      backButton: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.inputBackground,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
      },
      backButtonText: {
        fontSize: 18,
        color: colors.text,
        fontWeight: '600',
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
        paddingVertical: Platform.OS === 'ios' ? 16 : 14,
        fontSize: 16,
        color: colors.text,
        marginBottom: isSmallScreen ? 20 : 24,
        minHeight: Platform.OS === 'android' ? 48 : 44,
      },
      inputDisabled: {
        opacity: 0.6,
        backgroundColor: colors.border,
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
        paddingVertical: Platform.OS === 'ios' ? 16 : 14,
        borderWidth: 1,
        borderColor: colors.border,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        backgroundColor: colors.inputBackground,
        minHeight: Platform.OS === 'android' ? 48 : 44,
        justifyContent: 'center',
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
        paddingVertical: Platform.OS === 'ios' ? 16 : 14,
        fontSize: 16,
        color: colors.text,
        flex: 1,
        minHeight: Platform.OS === 'android' ? 48 : 44,
      },
      continueButton: {
        backgroundColor: colors.accent,
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: "center",
        marginBottom: isSmallScreen ? 20 : 24,
        minHeight: 48,
        justifyContent: 'center',
      },
      continueButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
      },
      buttonDisabled: {
        opacity: 0.6,
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
    });

  const styles = createStyles();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "position"}
      style={styles.keyboardContainer}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : -150}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.header}>
              {flowId && onBack && (
                <TouchableOpacity style={styles.backButton} onPress={onBack} disabled={isLoading}>
                  <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
              )}
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>C</Text>
              </View>
              <Text style={styles.title}>
                {flowId ? "Check your " + (authMethod === "email" ? "email" : "phone") : "Sign in"}
              </Text>
            </View>

            <View style={styles.form}>
              {/* Email/Phone Input Section */}
              <Text style={styles.inputLabel}>
                {authMethod === "email" ? "Email address" : "Phone number"}
              </Text>
              {authMethod === "sms" ? (
                <View style={styles.inputContainer}>
                  <View style={styles.flagContainer}>
                    <Text style={styles.flagText}>🇺🇸</Text>
                    <Text style={styles.countryCode}>+1</Text>
                  </View>
                  <TextInput
                    style={[styles.phoneInput, flowId && styles.inputDisabled]}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholder="(000) 000-0000"
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading && !flowId}
                    placeholderTextColor={colors.textSecondary}
                    returnKeyType="done"
                    onSubmitEditing={flowId ? undefined : onSignIn}
                    blurOnSubmit={true}
                  />
                </View>
              ) : (
                <TextInput
                  style={[styles.input, flowId && styles.inputDisabled]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading && !flowId}
                  placeholderTextColor={colors.textSecondary}
                  returnKeyType="done"
                  onSubmitEditing={flowId ? undefined : onSignIn}
                  blurOnSubmit={true}
                />
              )}

              {/* OTP Input Section - Shows when flowId exists */}
              {flowId && (
                <>
                  <Text style={styles.inputLabel}>Verification code</Text>
                  <TextInput
                    style={styles.input}
                    value={otp}
                    onChangeText={setOtp}
                    placeholder="Enter 6-digit code"
                    keyboardType="number-pad"
                    maxLength={6}
                    editable={!isLoading}
                    placeholderTextColor={colors.textSecondary}
                    returnKeyType="done"
                    onSubmitEditing={onVerifyOTP}
                    blurOnSubmit={true}
                    autoFocus={true}
                  />
                </>
              )}

              {/* Action Button */}
              <TouchableOpacity
                style={[styles.continueButton, isLoading && styles.buttonDisabled]}
                onPress={flowId ? onVerifyOTP : onSignIn}
                disabled={isLoading}
              >
                <Text style={styles.continueButtonText}>
                  {isLoading 
                    ? (flowId ? "Verifying..." : "Sending...") 
                    : (flowId ? "Verify Code" : "Continue")
                  }
                </Text>
              </TouchableOpacity>

              {/* Auth Method Toggle - Only show when not in OTP mode */}
              {!flowId && (
                <>
                  <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={onAuthMethodToggle}
                    disabled={isLoading}
                  >
                    <Text style={styles.toggleIcon}>{authMethod === "email" ? "📞" : "✉️"}</Text>
                    <Text style={styles.toggleButtonText}>
                      Continue with {authMethod === "email" ? "phone" : "email"}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
