import { useLinkSms, useVerifySmsOTP } from "@coinbase/cdp-hooks";
import React, { useCallback, useState } from "react";
import { Text, TextInput, View } from "react-native";

import { useTheme } from "../../theme/ThemeContext";
import { OtpVerificationForm } from "./OtpVerificationForm";
import { PrimaryButton } from "./PrimaryButton";
import { ScreenContainer } from "./ScreenContainer";
import { createStyles } from "./styles";

export function SmsVerificationView() {
  const { linkSms } = useLinkSms();
  const { verifySmsOTP } = useVerifySmsOTP();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [flowId, setFlowId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLinking, setIsLinking] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const showOtpForm = !!flowId;

  const handleSubmitPhone = useCallback(async () => {
    try {
      setError(null);
      setIsLinking(true);
      // Format phone number with US country code
      const formattedPhoneNumber = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+1${phoneNumber.replace(/\D/g, "")}`;
      const result = await linkSms(formattedPhoneNumber);
      setFlowId(result.flowId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send SMS");
    } finally {
      setIsLinking(false);
    }
  }, [phoneNumber, linkSms]);

  const handleVerifyOtp = useCallback(async () => {
    if (!flowId) {
      setError("No verification flow in progress");
      return;
    }

    try {
      setError(null);
      setIsVerifying(true);
      await verifySmsOTP({ flowId, otp: otpCode });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify OTP");
    } finally {
      setIsVerifying(false);
    }
  }, [flowId, otpCode, verifySmsOTP]);

  const handleBack = useCallback(() => {
    setFlowId(null);
    setOtpCode("");
    setError(null);
  }, []);

  // Format the phone number for display in the OTP form
  const formattedPhoneForDisplay = phoneNumber.startsWith("+")
    ? phoneNumber
    : `+1${phoneNumber.replace(/\D/g, "")}`;

  return (
    <ScreenContainer>
      <Text style={styles.title}>Phone Verification Required</Text>
      <Text style={styles.description}>
        Purchasing crypto requires phone verification for security. Please link your phone number to
        continue.
      </Text>

      {!showOtpForm ? (
        <View style={styles.formContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.phoneInputContainer}>
            <View style={styles.flagContainer}>
              <Text style={styles.flagText}>🇺🇸</Text>
              <Text style={styles.countryCode}>+1</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="(000) 000-0000"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLinking}
              returnKeyType="done"
              blurOnSubmit={true}
            />
          </View>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <PrimaryButton onPress={handleSubmitPhone} disabled={!phoneNumber} loading={isLinking}>
            Send Verification Code
          </PrimaryButton>
        </View>
      ) : (
        <OtpVerificationForm
          destination={formattedPhoneForDisplay}
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
