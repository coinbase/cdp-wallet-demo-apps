import React from "react";
import { View, StyleSheet } from "react-native";

interface UserIconProps {
  size?: number;
  color?: string;
}

export const UserIcon: React.FC<UserIconProps> = ({ size = 24, color = "#666666" }) => {
  const createStyles = () =>
    StyleSheet.create({
      container: {
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      },
      circle: {
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1.5,
        borderColor: color,
        alignItems: "center",
        justifyContent: "flex-start",
        overflow: "hidden",
      },
      head: {
        width: size * 0.3,
        height: size * 0.3,
        borderRadius: (size * 0.3) / 2,
        backgroundColor: color,
        marginTop: size * 0.15,
      },
      body: {
        width: size * 0.55,
        height: size * 0.35,
        borderRadius: size * 0.275,
        backgroundColor: color,
        marginTop: size * 0.05,
      },
    });

  const styles = createStyles();

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <View style={styles.head} />
        <View style={styles.body} />
      </View>
    </View>
  );
};
