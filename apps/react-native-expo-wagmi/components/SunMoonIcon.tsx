import React from "react";
import { View, StyleSheet } from "react-native";

interface SunMoonIconProps {
  isDarkMode: boolean;
  size?: number;
  color?: string;
}

export const SunMoonIcon: React.FC<SunMoonIconProps> = ({
  isDarkMode,
  size = 16,
  color = "#666666",
}) => {
  const createStyles = () =>
    StyleSheet.create({
      container: {
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      },
      // Sun icon (circle with rays)
      sunContainer: {
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      },
      sunCore: {
        width: size * 0.6,
        height: size * 0.6,
        borderRadius: (size * 0.6) / 2,
        backgroundColor: color,
      },
      sunRay: {
        position: "absolute",
        width: 2,
        height: size * 0.2,
        backgroundColor: color,
      },
      sunRayTop: {
        top: 0,
        left: (size - 2) / 2,
      },
      sunRayRight: {
        right: 0,
        top: (size - size * 0.2) / 2,
        transform: [{ rotate: "90deg" }],
      },
      sunRayBottom: {
        bottom: 0,
        left: (size - 2) / 2,
      },
      sunRayLeft: {
        left: 0,
        top: (size - size * 0.2) / 2,
        transform: [{ rotate: "90deg" }],
      },
      // Moon icon (simple crescent shape)
      moonContainer: {
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      },
      moonShape: {
        width: size * 0.7,
        height: size * 0.7,
        borderRadius: (size * 0.7) / 2,
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: color,
        borderRightColor: "transparent",
        transform: [{ rotate: "20deg" }],
      },
    });

  const styles = createStyles();

  if (isDarkMode) {
    // Show sun icon (switching to light mode)
    return (
      <View style={styles.container}>
        <View style={styles.sunContainer}>
          <View style={[styles.sunRay, styles.sunRayTop]} />
          <View style={[styles.sunRay, styles.sunRayRight]} />
          <View style={[styles.sunRay, styles.sunRayBottom]} />
          <View style={[styles.sunRay, styles.sunRayLeft]} />
          <View style={styles.sunCore} />
        </View>
      </View>
    );
  } else {
    // Show moon icon (switching to dark mode)
    return (
      <View style={styles.container}>
        <View style={styles.moonContainer}>
          <View style={styles.moonShape} />
        </View>
      </View>
    );
  }
};
