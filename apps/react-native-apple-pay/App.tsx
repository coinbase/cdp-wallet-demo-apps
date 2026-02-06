import {
  CDPHooksProvider,
  useIsInitialized,
  useIsSignedIn,
  useSignOut,
  Config,
} from "@coinbase/cdp-hooks";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Alert, ScrollView, SafeAreaView } from "react-native";

import Transaction from "./Transaction";
import { ThemeProvider, useTheme } from "./theme/ThemeContext";
import { SignInForm } from "./components/SignInForm";
import { DarkModeToggle } from "./components/DarkModeToggle";
import { WalletHeader } from "./components/WalletHeader";

const cdpConfig = {
  projectId: process.env.EXPO_PUBLIC_CDP_PROJECT_ID,
  basePath: process.env.EXPO_PUBLIC_CDP_BASE_PATH,
  ethereum: {
    createOnLogin: "smart",
  },
  useMock: process.env.EXPO_PUBLIC_CDP_USE_MOCK === "true",
  nativeOAuthCallback: process.env.EXPO_PUBLIC_NATIVE_OAUTH_CALLBACK,
} as Config;

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
  const { signOut } = useSignOut();
  const { colors, isDarkMode } = useTheme();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to sign out.");
    }
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
        flexGrow: 1,
      },
      userContainer: {
        flex: 1,
        width: "100%",
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
          <SignInForm />
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
              style={{ fontFamily: "monospace", fontSize: 14, color: "#333", textAlign: "center" }}
            >
              EXPO_PUBLIC_CDP_PROJECT_ID=your-actual-project-id
            </Text>
          </View>
        </SafeAreaView>
      </ThemeProvider>
    );
  }

  return (
    <CDPHooksProvider config={cdpConfig}>
      <ThemeProvider>
        <CDPApp />
      </ThemeProvider>
    </CDPHooksProvider>
  );
}
