import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useEvmAddress, useCurrentUser } from "@coinbase/cdp-hooks";
import { useTheme } from "../theme/ThemeContext";
import { UserIcon } from "../components/UserIcon";

interface WalletHeaderProps {
  onSignOut: () => void;
}

export const WalletHeader: React.FC<WalletHeaderProps> = ({ onSignOut }) => {
  const { colors } = useTheme();
  const { evmAddress } = useEvmAddress();
  const { currentUser } = useCurrentUser();

  // Use EVM address if available, otherwise fall back to smart account
  const evmWalletAddress = evmAddress || currentUser?.evmSmartAccounts?.[0];

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyWalletAddress = async () => {
    if (!evmWalletAddress) return;

    try {
      await Clipboard.setStringAsync(evmWalletAddress);
      Alert.alert("Copied!", "EVM address copied to clipboard.");
    } catch (error) {
      Alert.alert("Error", "Failed to copy EVM address.");
    }
  };

  const createStyles = () =>
    StyleSheet.create({
      container: {
        backgroundColor: colors.cardBackground,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
      leftContent: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
      },
      avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.textSecondary,
        marginRight: 12,
        justifyContent: "center",
        alignItems: "center",
      },
      addressContainer: {
        flex: 1,
      },
      address: {
        fontSize: 14,
        fontWeight: "500",
        color: colors.text,
        marginBottom: 2,
      },
      addressLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 1,
      },
      signOutButton: {
        backgroundColor: colors.accent,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
      },
      signOutButtonText: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "600",
      },
    });

  const styles = createStyles();

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <View style={styles.avatar}>
          <UserIcon size={18} color={colors.cardBackground} />
        </View>
        <View style={styles.addressContainer}>
          {evmWalletAddress ? (
            <>
              <Text style={styles.addressLabel}>EVM</Text>
              <TouchableOpacity onPress={copyWalletAddress}>
                <Text style={styles.address}>{formatAddress(evmWalletAddress)}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.address}>Loading...</Text>
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.signOutButton} onPress={onSignOut}>
        <Text style={styles.signOutButtonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};
