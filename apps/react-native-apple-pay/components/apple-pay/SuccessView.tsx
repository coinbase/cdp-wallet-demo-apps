import React from "react";
import { Text } from "react-native";

import { useTheme } from "../../theme/ThemeContext";
import { PrimaryButton } from "./PrimaryButton";
import { ScreenContainer } from "./ScreenContainer";
import { createStyles } from "./styles";

interface SuccessViewProps {
  onDone: () => void;
}

export function SuccessView({ onDone }: SuccessViewProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Purchase Complete!</Text>
      <Text style={styles.successIcon}>✓</Text>
      <Text style={styles.description}>Your USDC has been sent to your wallet on Base.</Text>
      <PrimaryButton onPress={onDone}>Done</PrimaryButton>
    </ScreenContainer>
  );
}
