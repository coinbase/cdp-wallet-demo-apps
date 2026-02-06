import { useEvmAddress } from "@coinbase/cdp-hooks";
import React from "react";
import { Linking, Text, TextInput, View, Switch } from "react-native";

import { useTheme } from "../../theme/ThemeContext";
import { InfoRow } from "./InfoRow";
import { PrimaryButton } from "./PrimaryButton";
import { ScreenContainer } from "./ScreenContainer";
import { createStyles } from "./styles";

interface OrderFormProps {
  amount: string;
  onAmountChange: (amount: string) => void;
  onSubmit: () => void;
  isCreatingOrder: boolean;
  isSandbox: boolean;
  onSandboxChange: (value: boolean) => void;
}

function formatAddress(address: string | null | undefined): string {
  if (!address) return "...";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function OrderForm({
  amount,
  onAmountChange,
  onSubmit,
  isCreatingOrder,
  isSandbox,
  onSandboxChange,
}: OrderFormProps) {
  const { evmAddress } = useEvmAddress();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const parsedAmount = parseFloat(amount) || 0;
  const isValidAmount = parsedAmount >= 1 && parsedAmount <= 10000;

  return (
    <ScreenContainer keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Buy crypto</Text>
      <Text style={styles.description}>Buy USDC with Apple Pay. Powered by Coinbase Onramp.</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Amount (USD)</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={onAmountChange}
            placeholder="0.00"
            placeholderTextColor={colors.textSecondary}
            keyboardType="decimal-pad"
            editable={!isCreatingOrder}
          />
        </View>
        <Text style={styles.hint}>Minimum: $1.00 | Maximum: $10,000.00</Text>

        <View style={styles.infoContainer}>
          <InfoRow label="Network:" value="Base" />
          <InfoRow label="You'll receive:" value="USDC" />
          <InfoRow label="To wallet:" value={formatAddress(evmAddress)} />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleLabelContainer}>
            <Text style={styles.toggleLabel}>Sandbox Mode</Text>
            <Text style={styles.toggleHint}>
              {isSandbox ? "Test purchase (no real money)" : "Real purchase"}
            </Text>
          </View>
          <Switch
            value={isSandbox}
            onValueChange={onSandboxChange}
            trackColor={{ false: colors.border, true: colors.accent }}
            thumbColor="#ffffff"
            disabled={isCreatingOrder}
          />
        </View>

        <PrimaryButton
          onPress={onSubmit}
          disabled={!isValidAmount || isCreatingOrder}
          loading={isCreatingOrder}
        >
          Continue with Apple Pay
        </PrimaryButton>

        <Text style={styles.disclaimer}>
          By continuing, you accept the <Text style={styles.link} onPress={() => Linking.openURL("https://www.coinbase.com/legal/guest-checkout/us")}>Coinbase Terms</Text>, <Text style={styles.link} onPress={() => Linking.openURL("https://www.coinbase.com/legal/user_agreement")}>User Agreement</Text> and <Text style={styles.link} onPress={() => Linking.openURL("https://www.coinbase.com/legal/privacy")}>Privacy Policy</Text>.
        </Text>
      </View>
    </ScreenContainer>
  );
}
