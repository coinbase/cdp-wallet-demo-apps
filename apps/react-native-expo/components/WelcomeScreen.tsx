import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { WelcomeScreenProps } from "../types";

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSignInPress }) => {
  const { colors } = useTheme();

  const createStyles = () =>
    StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      },
      card: {
        backgroundColor: colors.cardBackground,
        borderRadius: 12,
        padding: 32,
        alignItems: "center",
        width: "100%",
        maxWidth: 400,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      },
      title: {
        fontSize: 28,
        fontWeight: "bold",
        color: colors.text,
        marginBottom: 8,
        textAlign: "center",
      },
      subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 24,
        textAlign: "center",
      },
      signInButton: {
        backgroundColor: colors.accent,
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 48,
        alignItems: "center",
      },
      signInButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
      },
    });

  const styles = createStyles();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>Please sign in to continue.</Text>
        <TouchableOpacity style={styles.signInButton} onPress={onSignInPress}>
          <Text style={styles.signInButtonText}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
