import { useLinkEmail, useVerifyEmailOTP } from "@coinbase/cdp-hooks";
import React, { useCallback, useState } from "react";
import { Text, TextInput, View } from "react-native";

import { useTheme } from "../../theme/ThemeContext";
import { OtpVerificationForm } from "./OtpVerificationForm";
import { PrimaryButton } from "./PrimaryButton";
import { ScreenContainer } from "./ScreenContainer";
import { createStyles } from "./styles";

export function EmailVerificationView() {
  const { linkEmail } = useLinkEmail();
  const { verifyEmailOTP } = useVerifyEmailOTP();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [flowId, setFlowId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLinking, setIsLinking] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const showOtpForm = !!flowId;

  const handleSubmitEmail = useCallback(async () => {
    try {
      setError(null);
      setIsLinking(true);
      const result = await linkEmail(email);
      setFlowId(result.flowId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send email");
    } finally {
      setIsLinking(false);
    }
  }, [email, linkEmail]);

  const handleVerifyOtp = useCallback(async () => {
    if (!flowId) {
      setError("No verification flow in progress");
      return;
    }

    try {
      setError(null);
      setIsVerifying(true);
      await verifyEmailOTP({ flowId, otp: otpCode });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify OTP");
    } finally {
      setIsVerifying(false);
    }
  }, [flowId, otpCode, verifyEmailOTP]);

  const handleBack = useCallback(() => {
    setFlowId(null);
    setOtpCode("");
    setError(null);
  }, []);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Email Verification Required</Text>
      <Text style={styles.description}>
        Purchasing crypto requires email verification for security. Please link your email address to
        continue.
      </Text>

      {!showOtpForm ? (
        <View style={styles.formContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
          <PrimaryButton onPress={handleSubmitEmail} disabled={!email} loading={isLinking}>
            Send Verification Code
          </PrimaryButton>
        </View>
      ) : (
        <OtpVerificationForm
          destination={email}
          otpCode={otpCode}
          onOtpChange={setOtpCode}
          onVerify={handleVerifyOtp}
          onBack={handleBack}
          error={error}
          isVerifying={isVerifying}
        />
      )}
    </ScreenContainer>
  );
}
