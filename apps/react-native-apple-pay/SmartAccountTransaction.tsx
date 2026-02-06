import { useCurrentUser } from "@coinbase/cdp-hooks";
import { ApplePayProvider } from "@coinbase/cdp-react-native";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
} from "react-native";
import { createPublicClient, http, formatUnits } from "viem";
import { baseSepolia } from "viem/chains";
import { useTheme } from "./theme/ThemeContext";
import { ApplePayFlow } from "./ApplePayFlow";

// USDC contract address on Base Sepolia
const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as const;

// ERC20 ABI for balance
const ERC20_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

const client = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

interface Props {
  onSuccess?: () => void;
}

function SmartAccountTransaction(props: Props) {
  const { onSuccess } = props;
  const { currentUser } = useCurrentUser();
  const [usdcBalance, setUsdcBalance] = useState<bigint | undefined>(undefined);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { colors } = useTheme();

  const smartAccount = currentUser?.evmSmartAccounts?.[0];

  const formattedUsdcBalance = useMemo(() => {
    if (usdcBalance === undefined) return undefined;
    return formatUnits(usdcBalance, 6); // USDC has 6 decimals
  }, [usdcBalance]);

  const getBalance = useCallback(async () => {
    if (!smartAccount) return;

    try {
      // Get USDC balance
      const balance = await client.readContract({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [smartAccount],
      });
      setUsdcBalance(balance as bigint);
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  }, [smartAccount]);

  useEffect(() => {
    getBalance();
    const interval = setInterval(getBalance, 5000);
    return () => clearInterval(interval);
  }, [getBalance]);

  const handleBuyCrypto = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
    getBalance();
    onSuccess?.();
  }, [getBalance, onSuccess]);

  const createStyles = () =>
    StyleSheet.create({
      container: {
        flex: 1,
      },
      balanceSection: {
        backgroundColor: colors.cardBackground,
        padding: 24,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        marginTop: 20,
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
      buyCryptoButton: {
        backgroundColor: colors.accent,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        width: "100%",
      },
      buyCryptoButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
      },
      modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      modalContent: {
        backgroundColor: colors.cardBackground,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        minHeight: "80%",
        maxHeight: "90%",
      },
      modalHeader: {
        flexDirection: "row",
        justifyContent: "flex-end",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      },
      closeButton: {
        padding: 8,
      },
      closeButtonText: {
        fontSize: 16,
        color: colors.accent,
        fontWeight: "600",
      },
    });

  const styles = createStyles();

  return (
    <View style={styles.container}>
      {/* Balance Section - Centered */}
      <View style={styles.balanceSection}>
        <Text style={styles.balanceTitle}>Current Balance</Text>
        <Text style={styles.balanceAmount}>
          {formattedUsdcBalance === undefined ? "Loading..." : `${formattedUsdcBalance} USDC`}
        </Text>
        <TouchableOpacity style={styles.buyCryptoButton} onPress={handleBuyCrypto}>
          <Text style={styles.buyCryptoButtonText}>Buy crypto</Text>
        </TouchableOpacity>
      </View>

      {/* Apple Pay Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="overFullScreen"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
            <ApplePayProvider>
              <ApplePayFlow onDone={handleCloseModal} />
            </ApplePayProvider>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}


export default SmartAccountTransaction;
