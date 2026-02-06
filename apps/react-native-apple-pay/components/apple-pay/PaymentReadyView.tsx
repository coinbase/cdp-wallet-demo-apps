import { useEvmAddress } from "@coinbase/cdp-hooks";
import { ApplePayButton } from "@coinbase/cdp-react-native";
import React from "react";
import { Text, View } from "react-native";

import { useTheme } from "../../theme/ThemeContext";
import { DetailRow } from "./DetailRow";
import { ScreenContainer } from "./ScreenContainer";
import { SecondaryButton } from "./SecondaryButton";
import { createStyles } from "./styles";

interface PaymentReadyViewProps {
  amount: string;
  onCancel: () => void;
}

function formatAddress(address: string | null | undefined): string {
  if (!address) return "...";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function PaymentReadyView({ amount, onCancel }: PaymentReadyViewProps) {
  const { evmAddress } = useEvmAddress();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Complete Your Purchase</Text>
      <Text style={styles.description}>
        Your order is ready. Tap the button below to pay with Apple Pay.
      </Text>

      <View style={styles.detailsContainer}>
        <DetailRow label="Amount:" value={`$${amount} USD`} />
        <DetailRow label="You will receive:" value="USDC on Base" />
        <DetailRow label="To wallet:" value={formatAddress(evmAddress)} />
      </View>

      <ApplePayButton style={styles.applePayButton} />

      <SecondaryButton onPress={onCancel}>Cancel</SecondaryButton>
    </ScreenContainer>
  );
}
