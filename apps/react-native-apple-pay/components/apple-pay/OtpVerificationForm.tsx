import React from "react";
import { Text, TextInput, View } from "react-native";

import { useTheme } from "../../theme/ThemeContext";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";
import { createStyles } from "./styles";

interface OtpVerificationFormProps {
  destination: string;
  otpCode: string;
  onOtpChange: (code: string) => void;
  onVerify: () => void;
  onBack: () => void;
  error: string | null;
  isVerifying: boolean;
}

export function OtpVerificationForm({
  destination,
  otpCode,
  onOtpChange,
  onVerify,
  onBack,
  error,
  isVerifying,
}: OtpVerificationFormProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const isValidOtp = otpCode.length === 6;

  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Verification Code</Text>
      <Text style={styles.otpHint}>Enter the 6-digit code sent to {destination}</Text>
      <TextInput
        style={styles.input}
        value={otpCode}
        onChangeText={onOtpChange}
        placeholder="000000"
        placeholderTextColor={colors.textSecondary}
        keyboardType="number-pad"
        maxLength={6}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isVerifying}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <PrimaryButton onPress={onVerify} disabled={!isValidOtp} loading={isVerifying}>
        Verify Code
      </PrimaryButton>
      <SecondaryButton onPress={onBack}>Back</SecondaryButton>
    </View>
  );
}
