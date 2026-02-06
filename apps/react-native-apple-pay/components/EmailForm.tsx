import React, { useState } from "react";
import { View, TouchableOpacity, Text, TextInput, Alert } from "react-native";
import { useSignInWithEmail } from "@coinbase/cdp-hooks";
import { useTheme } from "../theme/ThemeContext";
import { useSignInFormStyles } from "../hooks/useSignInFormStyles";

export interface EmailFormProps {
  onSuccess: (flowId: string) => void;
}

export const EmailForm: React.FC<EmailFormProps> = ({ onSuccess }) => {
  const { colors } = useTheme();
  const { signInWithEmail } = useSignInWithEmail();
  const styles = useSignInFormStyles();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter an email address.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await signInWithEmail({ email });
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
        <Text style={styles.inputLabel}>Email address</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="name@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
          placeholderTextColor={colors.textSecondary}
          returnKeyType="done"
          onSubmitEditing={handleSignIn}
          blurOnSubmit={true}
        />

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
