import React, { useState } from "react";
import { View, TouchableOpacity, Text, TextInput, Alert } from "react-native";
import { useSignInWithSms } from "@coinbase/cdp-hooks";
import { useTheme } from "../theme/ThemeContext";
import { useSignInFormStyles } from "../hooks/useSignInFormStyles";

export interface SmsFormProps {
  onSuccess: (flowId: string) => void;
}

export const SmsForm: React.FC<SmsFormProps> = ({ onSuccess }) => {
  const { colors } = useTheme();
  const { signInWithSms } = useSignInWithSms();
  const styles = useSignInFormStyles();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!phoneNumber) {
      Alert.alert("Error", "Please enter a phone number.");
      return;
    }

    setIsLoading(true);
    try {
      // Format phone number with country code for SMS
      const formattedPhoneNumber = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+1${phoneNumber.replace(/\D/g, "")}`;
      const result = await signInWithSms({ phoneNumber: formattedPhoneNumber });
      onSuccess(result.flowId);
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>C</Text>
        </View>
        <Text style={styles.title}>Sign in</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.inputLabel}>Phone number</Text>
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
            onSubmitEditing={handleSignIn}
            blurOnSubmit={true}
          />
        </View>

        <TouchableOpacity
          style={[styles.continueButton, isLoading && styles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={isLoading}
        >
          <Text style={styles.continueButtonText}>{isLoading ? "Sending..." : "Continue"}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
