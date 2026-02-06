import React from "react";
import { ScrollView, View } from "react-native";

import { useTheme } from "../../theme/ThemeContext";
import { createStyles } from "./styles";

interface ScreenContainerProps {
  children: React.ReactNode;
  keyboardShouldPersistTaps?: "handled" | "always" | "never";
}

export function ScreenContainer({ children, keyboardShouldPersistTaps }: ScreenContainerProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps={keyboardShouldPersistTaps}>
      <View style={styles.content}>{children}</View>
    </ScrollView>
  );
}
