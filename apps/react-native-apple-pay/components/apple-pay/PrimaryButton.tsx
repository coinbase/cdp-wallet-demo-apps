import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

import { useTheme } from "../../theme/ThemeContext";
import { createStyles } from "./styles";

interface PrimaryButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: string;
}

export function PrimaryButton({ onPress, disabled, loading, children }: PrimaryButtonProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}
