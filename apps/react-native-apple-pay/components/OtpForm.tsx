import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  Alert,
} from "react-native";
import { useVerifyEmailOTP, useVerifySmsOTP } from "@coinbase/cdp-hooks";
import { useTheme } from "../theme/ThemeContext";
import { useSignInFormStyles } from "../hooks/useSignInFormStyles";
import { AuthMethod } from "../types";

export interface OtpFormProps {
  authMethod: AuthMethod;
  flowId: string;
  onSuccess: () => void;
  onBack: () => void;
}

export const OtpForm: React.FC<OtpFormProps> = ({ authMethod, flowId, onSuccess, onBack }) => {
  const { colors } = useTheme();
  const { verifyEmailOTP } = useVerifyEmailOTP();
  const { verifySmsOTP } = useVerifySmsOTP();
  const styles = useSignInFormStyles();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to ensure OTP field and button are visible
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: 200,
          animated: true,
        });
      }, 300);
    }
  }, []);

  // Handle keyboard events for better positioning
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      if (scrollViewRef.current) {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: 250,
            animated: true,
          });
        }, 100);
      }
    });

    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      if (scrollViewRef.current) {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: 150,
            animated: true,
          });
        }, 100);
      }
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleVerifyOTP = async () => {
    if (!otp || !flowId) {
      Alert.alert("Error", "Please enter the OTP.");
      return;
    }

    setIsLoading(true);
    try {
      if (authMethod === "email") {
        await verifyEmailOTP({ flowId, otp });
      } else {
        await verifySmsOTP({ flowId, otp });
      }
      setOtp("");
      onSuccess();
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to verify OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "position"}
      style={styles.keyboardContainer}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : -150}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainerWithOtp}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={onBack} disabled={isLoading}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>C</Text>
              </View>
              <Text style={styles.title}>
                Check your {authMethod === "email" ? "email" : "phone"}
              </Text>
            </View>
            <View style={styles.form}>
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
                onSubmitEditing={handleVerifyOTP}
                blurOnSubmit={true}
                autoFocus={true}
              />

              <TouchableOpacity
                style={[styles.continueButton, isLoading && styles.buttonDisabled]}
                onPress={handleVerifyOTP}
                disabled={isLoading}
              >
                <Text style={styles.continueButtonText}>
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
