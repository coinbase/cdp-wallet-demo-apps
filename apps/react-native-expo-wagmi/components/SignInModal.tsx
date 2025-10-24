import React from "react";
import {
  Modal,
  Animated,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { SignInModalProps } from "../types";

export const SignInModal: React.FC<SignInModalProps> = ({
  visible,
  onClose,
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
  slideAnim,
}) => {
  const { colors } = useTheme();

  const createStyles = () =>
    StyleSheet.create({
      modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
      },
      modalContainer: {
        backgroundColor: colors.cardBackground,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        minHeight: "60%",
        maxHeight: "90%",
      },
      modalContent: {
        flex: 1,
        padding: 24,
      },
      modalCloseButton: {
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 1,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        justifyContent: "center",
        alignItems: "center",
      },
      modalCloseText: {
        color: colors.text,
        fontSize: 20,
        fontWeight: "300",
        textAlign: "center",
        lineHeight: 20,
        includeFontPadding: false,
      },
      modalHeader: {
        alignItems: "center",
        marginTop: 32,
        marginBottom: 32,
      },
      logoCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.accent,
        justifyContent: "center",
        alignItems: "center",
      },
      logoText: {
        color: "#ffffff",
        fontSize: 32,
        fontWeight: "bold",
      },
      modalTitle: {
        fontSize: 24,
        fontWeight: "500",
        color: colors.text,
        textAlign: "center",
        marginTop: 16,
      },
      modalForm: {
        flex: 1,
      },
      inputLabel: {
        fontSize: 16,
        fontWeight: "500",
        color: colors.text,
        marginBottom: 8,
      },
      modalInput: {
        backgroundColor: colors.inputBackground,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: colors.text,
        marginBottom: 24,
      },
      inputContainer: {
        flexDirection: "row",
        alignItems: "stretch",
        marginBottom: 24,
      },
      flagContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: colors.border,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        backgroundColor: colors.inputBackground,
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
        paddingVertical: 14,
        fontSize: 16,
        color: colors.text,
        flex: 1,
      },
      continueButton: {
        backgroundColor: colors.accent,
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: "center",
        marginBottom: 24,
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
        marginBottom: 24,
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
      phoneButton: {
        backgroundColor: colors.inputBackground,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 32,
      },
      phoneIcon: {
        fontSize: 18,
        marginRight: 8,
      },
      phoneButtonText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: "500",
      },
    });

  const styles = createStyles();

  return (
    <Modal visible={visible} transparent={true} animationType="none" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContent}
          >
            <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
              <Text style={styles.modalCloseText}>×</Text>
            </TouchableOpacity>

            <View style={styles.modalHeader}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>C</Text>
              </View>
              <Text style={styles.modalTitle}>
                {flowId ? "Enter verification code" : "Sign in"}
              </Text>
            </View>

            {flowId ? (
              <View style={styles.modalForm}>
                <Text style={styles.inputLabel}>Verification code</Text>
                <TextInput
                  style={styles.modalInput}
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
                />

                <TouchableOpacity
                  style={[styles.continueButton, isLoading && styles.buttonDisabled]}
                  onPress={onVerifyOTP}
                  disabled={isLoading}
                >
                  <Text style={styles.continueButtonText}>
                    {isLoading ? "Verifying..." : "Continue"}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.modalForm}>
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
                      style={styles.phoneInput}
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      placeholder="(000) 000-0000"
                      keyboardType="phone-pad"
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isLoading}
                      placeholderTextColor={colors.textSecondary}
                      returnKeyType="done"
                      onSubmitEditing={onSignIn}
                      blurOnSubmit={true}
                    />
                  </View>
                ) : (
                  <TextInput
                    style={styles.modalInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="name@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                    placeholderTextColor={colors.textSecondary}
                    returnKeyType="done"
                    onSubmitEditing={onSignIn}
                    blurOnSubmit={true}
                  />
                )}

                <TouchableOpacity
                  style={[styles.continueButton, isLoading && styles.buttonDisabled]}
                  onPress={onSignIn}
                  disabled={isLoading}
                >
                  <Text style={styles.continueButtonText}>
                    {isLoading ? "Sending..." : "Continue"}
                  </Text>
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                  style={styles.phoneButton}
                  onPress={onAuthMethodToggle}
                  disabled={isLoading}
                >
                  <Text style={styles.phoneIcon}>{authMethod === "email" ? "📞" : "✉️"}</Text>
                  <Text style={styles.phoneButtonText}>
                    Continue with {authMethod === "email" ? "phone" : "email"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
};
