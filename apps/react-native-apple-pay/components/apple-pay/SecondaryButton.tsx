import React from "react";
import { Text, TouchableOpacity } from "react-native";

import { useTheme } from "../../theme/ThemeContext";
import { createStyles } from "./styles";

interface SecondaryButtonProps {
  onPress: () => void;
  children: string;
}

export function SecondaryButton({ onPress, children }: SecondaryButtonProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity style={styles.secondaryButton} onPress={onPress}>
      <Text style={styles.secondaryButtonText}>{children}</Text>
    </TouchableOpacity>
  );
}
