import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { DarkModeToggleProps } from "../types";
import { SunMoonIcon } from "./SunMoonIcon";

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  style,
  iconStyle,
  showText = false,
}) => {
  const { isDarkMode, toggleDarkMode, colors } = useTheme();

  const createStyles = () =>
    StyleSheet.create({
      button: {
        backgroundColor: colors.inputBackground,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: showText ? 8 : 20,
        padding: showText ? 15 : 10,
        alignItems: "center",
        flexDirection: showText ? "row" : "column",
        justifyContent: "center",
        ...style,
      },
      iconContainer: {
        marginRight: showText ? 8 : 0,
        alignItems: "center",
        justifyContent: "center",
      },
      text: {
        color: colors.text,
        fontSize: 16,
        fontWeight: "500",
      },
    });

  const styles = createStyles();

  return (
    <TouchableOpacity style={styles.button} onPress={toggleDarkMode}>
      <View style={styles.iconContainer}>
        <SunMoonIcon isDarkMode={isDarkMode} size={showText ? 18 : 16} color={colors.text} />
      </View>
      {showText && <Text style={styles.text}>{isDarkMode ? "Light Mode" : "Dark Mode"}</Text>}
    </TouchableOpacity>
  );
};
