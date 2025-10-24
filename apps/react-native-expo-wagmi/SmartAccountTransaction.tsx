import { useCurrentUser, useSendUserOperation } from "@coinbase/cdp-hooks";
import * as Clipboard from "expo-clipboard";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import { createPublicClient, http, parseUnits, encodeFunctionData, formatUnits } from "viem";
import { baseSepolia } from "viem/chains";
import { useTheme } from "./theme/ThemeContext";
import { useBalance, useReadContract } from "wagmi";

// USDC contract address on Base Sepolia
const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as const;

// Faucet contract address on Base Sepolia
const FAUCET_ADDRESS = "0x8fDDcc0c5C993A1968B46787919Cc34577d6dC5c" as const;

// ERC20 ABI for balance and transfer
const ERC20_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

const client = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

interface Props {
  onSuccess?: () => void;
}

/**
 * This component demonstrates how to send a gasless transaction using Smart Accounts.
 *
 * @param {Props} props - The props for the SmartAccountTransaction component.
 * @param {() => void} [props.onSuccess] - A function to call when the transaction is successful.
 * @returns A component that displays a Smart Account transaction form and result.
 */
function SmartAccountTransaction(props: Props) {
  const { onSuccess } = props;
  const { currentUser } = useCurrentUser();
  const { sendUserOperation, data, error, status } = useSendUserOperation();
  const [balance, setBalance] = useState<bigint | undefined>(undefined);
  const [usdcBalance, setUsdcBalance] = useState<bigint | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState("");
  const { colors } = useTheme();

  const smartAccount = currentUser?.evmSmartAccounts?.[0];

  const { data: usdcBalanceData } = useReadContract({
    abi: ERC20_ABI,
    functionName: "balanceOf",
    address: USDC_ADDRESS,
    args: [smartAccount as `0x${string}`],
    query: {
      enabled: !!smartAccount,
    },
  });
  console.log(usdcBalanceData);

  const formattedUsdcBalance = useMemo(() => {
    if (usdcBalance === undefined) return undefined;
    return formatUnits(usdcBalance, 6); // USDC has 6 decimals
  }, [usdcBalance]);

  const getBalance = useCallback(async () => {
    console.log("getBalance", smartAccount);
    if (!smartAccount) return;

    try {
      console.log("Getting balance");
      // Get ETH balance
      const ethBalance = await client.getBalance({
        address: smartAccount,
      });
      console.log("ETH balance", ethBalance);
      setBalance(ethBalance);

      // Get USDC balance
      const usdcBalance = await client.readContract({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [smartAccount],
      });
      setUsdcBalance(usdcBalance as bigint);
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  }, [smartAccount]);

  useEffect(() => {
    getBalance();
    const interval = setInterval(getBalance, 5000);
    return () => clearInterval(interval);
  }, [getBalance]);

  const handleSendUserOperation = async () => {
    if (!smartAccount) {
      Alert.alert("Error", "No Smart Account available.");
      return;
    }

    setErrorMessage("");

    try {
      // Send 1 USDC back to the faucet
      const usdcAmount = parseUnits("1", 6); // USDC has 6 decimals

      const transferData = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [FAUCET_ADDRESS, usdcAmount],
      });

      const result = await sendUserOperation({
        evmSmartAccount: smartAccount,
        network: "base-sepolia",
        calls: [
          {
            to: USDC_ADDRESS,
            data: transferData,
            value: 0n,
          },
        ],
      });

      if (result?.userOperationHash) {
        onSuccess?.();
        getBalance();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send user operation";
      setErrorMessage(message);
      Alert.alert("Transaction Failed", message + (message.endsWith(".") ? "" : "."));
    }
  };

  const isLoading = status === "pending";
  const isSuccess = status === "success" && data;

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await Clipboard.setStringAsync(text);
      Alert.alert("Copied!", `${label} copied to clipboard.`);
    } catch (error) {
      Alert.alert("Error", "Failed to copy to clipboard.");
    }
  };

  const openFaucet = () => {
    const usdcFaucetUrl = `https://portal.cdp.coinbase.com/products/faucet?address=${smartAccount}&token=USDC`;

    Alert.alert(
      "Get testnet USDC",
      "",
      [
        {
          text: "Copy USDC Faucet Link",
          onPress: () => copyToClipboard(usdcFaucetUrl, "USDC Faucet Link"),
        },
        {
          text: "Open USDC Faucet",
          onPress: () => Linking.openURL(usdcFaucetUrl),
          style: "default",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true },
    );
  };

  const hasUsdcBalance = usdcBalance && usdcBalance > 0n;

  const createStyles = () =>
    StyleSheet.create({
      container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
      },
      balanceSection: {
        backgroundColor: colors.cardBackground,
        borderRadius: 12,
        padding: 24,
        marginBottom: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.border,
      },
      balanceTitle: {
        fontSize: 16,
        fontWeight: "500",
        color: colors.textSecondary,
        marginBottom: 8,
      },
      balanceAmount: {
        fontSize: 32,
        fontWeight: "bold",
        color: colors.text,
        marginBottom: 16,
      },
      faucetButton: {
        backgroundColor: colors.accent,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        width: "100%",
      },
      faucetButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
      },
      transactionSection: {
        backgroundColor: colors.cardBackground,
        borderRadius: 12,
        padding: 24,
        borderWidth: 1,
        borderColor: colors.border,
      },
      sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.text,
        marginBottom: 8,
      },
      sectionSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 20,
      },
      sendButton: {
        backgroundColor: colors.accent,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 16,
      },
      sendButtonDisabled: {
        opacity: 0.6,
      },
      sendButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
      },
      disabledText: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: "center",
        fontStyle: "italic",
      },
      noteContainer: {
        flexDirection: "row",
        backgroundColor: "rgba(0, 128, 128, 0.1)",
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "rgba(0, 128, 128, 0.3)",
      },
      noteIcon: {
        fontSize: 16,
        marginRight: 8,
        marginTop: 2,
      },
      noteTextContainer: {
        flex: 1,
      },
      noteTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.text,
        marginRight: 4,
      },
      noteText: {
        fontSize: 14,
        color: colors.text,
        lineHeight: 20,
      },
      faucetLink: {
        color: colors.accent,
        textDecorationLine: "underline",
      },
      errorContainer: {
        backgroundColor: colors.errorBackground,
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
      },
      errorText: {
        color: "#cc0000",
        fontSize: 14,
      },
      successContainer: {
        backgroundColor: colors.successBackground,
        padding: 16,
        borderRadius: 8,
        marginTop: 16,
      },
      successTitle: {
        color: colors.accent,
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 12,
      },
      hashContainer: {
        marginBottom: 12,
      },
      hashLabel: {
        color: colors.accent,
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 6,
      },
      hashButton: {
        backgroundColor: "rgba(0, 128, 128, 0.1)",
        borderRadius: 6,
        padding: 12,
        borderWidth: 1,
        borderColor: "rgba(0, 128, 128, 0.3)",
      },
      hashText: {
        color: colors.accent,
        fontSize: 12,
        fontFamily: "monospace",
        marginBottom: 4,
      },
      copyHint: {
        color: colors.accent,
        fontSize: 10,
        fontStyle: "italic",
        textAlign: "center",
      },
    });

  const styles = createStyles();

  return (
    <View style={styles.container}>
      {/* Balance Section */}
      <View style={styles.balanceSection}>
        <Text style={styles.balanceTitle}>Current Balance</Text>
        <Text style={styles.balanceAmount}>
          {formattedUsdcBalance === undefined ? "Loading..." : `${formattedUsdcBalance} USDC`}
        </Text>
        {!hasUsdcBalance && (
          <TouchableOpacity style={styles.faucetButton} onPress={openFaucet}>
            <Text style={styles.faucetButtonText}>Get funds from faucet</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Transaction Section */}
      <View style={styles.transactionSection}>
        <Text style={styles.sectionTitle}>Transfer 1 USDC</Text>
        <Text style={styles.sectionSubtitle}>
          This example sends 1 USDC from your wallet to the{" "}
          <Text style={styles.faucetLink} onPress={openFaucet}>
            CDP Faucet
          </Text>
          .
        </Text>

        {!hasUsdcBalance && (
          <View style={styles.noteContainer}>
            <Text style={styles.noteIcon}>ℹ️</Text>
            <View style={styles.noteTextContainer}>
              <Text style={styles.noteTitle}>Note:</Text>
              <Text style={styles.noteText}>
                Even though this is a gasless transaction, you still need USDC in your account to
                send it. Get some from the{" "}
                <Text style={styles.faucetLink} onPress={openFaucet}>
                  CDP Faucet
                </Text>
                .
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.sendButton,
            (!smartAccount || isLoading || !hasUsdcBalance) && styles.sendButtonDisabled,
          ]}
          onPress={handleSendUserOperation}
          disabled={!smartAccount || isLoading || !hasUsdcBalance}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.sendButtonText}>Transfer</Text>
          )}
        </TouchableOpacity>

        {errorMessage || error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage || error?.message}</Text>
          </View>
        ) : null}

        {isSuccess && data?.transactionHash ? (
          <View style={styles.successContainer}>
            <Text style={styles.successTitle}>Transfer Complete</Text>

            <View style={styles.hashContainer}>
              <Text style={styles.hashLabel}>Transaction Hash:</Text>
              <TouchableOpacity
                style={styles.hashButton}
                onPress={() =>
                  copyToClipboard(
                    `https://sepolia.basescan.org/tx/${data.transactionHash}`,
                    "Block Explorer Link",
                  )
                }
              >
                <Text style={styles.hashText}>{data.transactionHash}</Text>
                <Text style={styles.copyHint}>Tap to copy block explorer link</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}

export default SmartAccountTransaction;
