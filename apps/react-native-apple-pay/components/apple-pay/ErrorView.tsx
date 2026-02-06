import React from "react";
import { Text } from "react-native";

import { useTheme } from "../../theme/ThemeContext";
import { PrimaryButton } from "./PrimaryButton";
import { ScreenContainer } from "./ScreenContainer";
import { createStyles } from "./styles";

interface ErrorViewProps {
  message: string;
  onRetry: () => void;
}

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.errorIcon}>✕</Text>
      <Text style={styles.errorText}>{message}</Text>
      <PrimaryButton onPress={onRetry}>Try Again</PrimaryButton>
    </ScreenContainer>
  );
}
