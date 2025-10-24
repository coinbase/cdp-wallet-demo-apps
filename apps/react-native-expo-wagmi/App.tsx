import {
  CDPHooksProvider,
  useIsInitialized,
  useSignInWithEmail,
  useVerifyEmailOTP,
  useSignInWithSms,
  useVerifySmsOTP,
  useIsSignedIn,
  useSignOut,
} from "@coinbase/cdp-hooks";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, View, Alert, ScrollView, SafeAreaView } from "react-native";

import Transaction from "./Transaction";
import { ThemeProvider, useTheme } from "./theme/ThemeContext";
import { SignInForm } from "./components/SignInForm";
import { DarkModeToggle } from "./components/DarkModeToggle";
import { WalletHeader } from "./components/WalletHeader";
import { AuthMethod } from "./types";

import { WagmiProvider } from "wagmi";
import { cdpConfig, queryClient, wagmiConfig, persister } from "./config";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

/**
 * A multi-step authentication component that handles email and SMS-based sign-in flows.
 *
 * The component manages authentication states:
 * 1. Initial state: Displays a welcome screen with sign-in options
 * 2. Input: Collects and validates the user's email address or phone number
 * 3. OTP verification: Validates the one-time password sent to the user's email or SMS
 *
 * Features:
 * - Toggle between email and SMS authentication
 * - Email and phone number validation
 * - 6-digit OTP validation
 * - Loading states during API calls
 * - Error handling for failed authentication attempts
 * - Cancelable workflow with state reset
 *
 * @returns {JSX.Element} The rendered sign-in form component
 */
function CDPApp() {
  const { isInitialized } = useIsInitialized();
  const { isSignedIn } = useIsSignedIn();
  const { signInWithEmail } = useSignInWithEmail();
  const { verifyEmailOTP } = useVerifyEmailOTP();
  const { signInWithSms } = useSignInWithSms();
  const { verifySmsOTP } = useVerifySmsOTP();
  const { signOut } = useSignOut();
  const { colors, isDarkMode } = useTheme();

  const [authMethod, setAuthMethod] = useState<AuthMethod>("email");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [flowId, setFlowId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (authMethod === "email") {
      if (!email) {
        Alert.alert("Error", "Please enter an email address.");
        return;
      }

      setIsLoading(true);
      try {
        const result = await signInWithEmail({ email });
        setFlowId(result.flowId);
      } catch (error) {
        Alert.alert("Error", error instanceof Error ? error.message : "Failed to sign in.");
      } finally {
        setIsLoading(false);
      }
    } else {
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
        const result = await signInWithSms({
          phoneNumber: formattedPhoneNumber,
        });
        setFlowId(result.flowId);
      } catch (error) {
        Alert.alert("Error", error instanceof Error ? error.message : "Failed to sign in.");
      } finally {
        setIsLoading(false);
      }
    }
  };

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
      setFlowId("");
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to verify OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setEmail("");
      setPhoneNumber("");
      setOtp("");
      setFlowId("");
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to sign out.");
    }
  };

  const handleAuthMethodToggle = () => {
    setAuthMethod(authMethod === "email" ? "sms" : "email");
    setEmail("");
    setPhoneNumber("");
  };

  const handleBack = () => {
    setFlowId("");
    setOtp("");
  };

  const createStyles = () =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.background,
      },
      centerContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      },
      header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: colors.cardBackground,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      },
      headerContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
      headerText: {
        flex: 1,
        alignItems: "flex-start",
        paddingLeft: 4,
      },
      title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "left",
        color: colors.text,
      },
      text: {
        fontSize: 16,
        textAlign: "center",
        color: colors.text,
      },
      content: {
        flex: 1,
      },
      scrollView: {
        flex: 1,
      },
      scrollContent: {
        paddingVertical: 40,
        paddingHorizontal: 20,
      },
      userContainer: {
        width: "100%",
        alignItems: "center",
        marginBottom: 20,
      },
    });

  const styles = createStyles();

  if (!isInitialized) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.text}>Initializing CDP...</Text>
        </View>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.title}>CDP React Native Demo</Text>
          </View>
          <DarkModeToggle style={{ width: 40, height: 40 }} />
        </View>
      </View>

      <View style={styles.content}>
        {!isSignedIn ? (
          <SignInForm
            authMethod={authMethod}
            onAuthMethodToggle={handleAuthMethodToggle}
            email={email}
            setEmail={setEmail}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            otp={otp}
            setOtp={setOtp}
            flowId={flowId}
            isLoading={isLoading}
            onSignIn={handleSignIn}
            onVerifyOTP={handleVerifyOTP}
            onBack={handleBack}
          />
        ) : (
          <>
            <WalletHeader onSignOut={handleSignOut} />
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.userContainer}>
                <Transaction onSuccess={() => console.log("Transaction successful!")} />
              </View>
            </ScrollView>
          </>
        )}
      </View>

      <StatusBar style={isDarkMode ? "light" : "dark"} />
    </SafeAreaView>
  );
}

/**
 * The main component that wraps the CDPApp component and provides the CDPHooksProvider.
 *
 * @returns {JSX.Element} The rendered main component
 */
export default function App() {
  // Check if project ID is empty or the placeholder value
  const projectId = process.env.EXPO_PUBLIC_CDP_PROJECT_ID;
  const isPlaceholderProjectId = !projectId || projectId === "your-project-id-here";

  if (isPlaceholderProjectId) {
    return (
      <ThemeProvider>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "#f5f5f5",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#333",
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            ⚠️ CDP Project ID Required
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#666",
              textAlign: "center",
              lineHeight: 24,
              marginBottom: 24,
            }}
          >
            Please configure your CDP project ID in the .env file. Create a .env file in the project
            root and add your CDP project ID.
          </Text>
          <View
            style={{
              backgroundColor: "#f0f0f0",
              padding: 16,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#ddd",
            }}
          >
            <Text
              style={{
                fontFamily: "monospace",
                fontSize: 14,
                color: "#333",
                textAlign: "center",
              }}
            >
              EXPO_PUBLIC_CDP_PROJECT_ID=your-actual-project-id
            </Text>
          </View>
        </SafeAreaView>
      </ThemeProvider>
    );
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
        <CDPHooksProvider config={cdpConfig}>
          <ThemeProvider>
            <CDPApp />
          </ThemeProvider>
        </CDPHooksProvider>
      </PersistQueryClientProvider>
    </WagmiProvider>
  );
}
