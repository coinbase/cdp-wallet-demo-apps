import React, { useState } from "react";
import { View, TouchableOpacity, Text, Alert } from "react-native";
import { useSignInWithOAuth } from "@coinbase/cdp-hooks";
import { useSignInFormStyles } from "../hooks/useSignInFormStyles";

export const OAuthForm: React.FC = () => {
  const { signInWithOAuth } = useSignInWithOAuth();
  const styles = useSignInFormStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleOAuthSignIn = async (provider: "google" | "apple") => {
    setIsLoading(true);
    setLoadingProvider(provider);
    try {
      await signInWithOAuth(provider);
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to sign in.");
    } finally {
      setIsLoading(false);
      setLoadingProvider(null);
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
        <TouchableOpacity
          style={[styles.continueButton, isLoading && styles.buttonDisabled]}
          onPress={() => handleOAuthSignIn("google")}
          disabled={isLoading}
        >
          <Text style={styles.continueButtonText}>
            {loadingProvider === "google" ? "Signing in..." : "Continue with Google"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.continueButton, isLoading && styles.buttonDisabled]}
          onPress={() => handleOAuthSignIn("apple")}
          disabled={isLoading}
        >
          <Text style={styles.continueButtonText}>
            {loadingProvider === "apple" ? "Signing in..." : "Continue with Apple"}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
