import { useEvmAddress } from "@coinbase/cdp-hooks";
import { useApplePay } from "@coinbase/cdp-react-native";
import { useTheme } from "./theme/ThemeContext";
import { useState } from "react";
import { useCallback } from "react";
import { Platform } from "react-native";
import { View } from "react-native";
import { Text } from "react-native";
import { EmailVerificationView } from "./components/apple-pay/EmailVerificationView";
import { SmsVerificationView } from "./components/apple-pay/SmsVerificationView";
import { ErrorView } from "./components/apple-pay/ErrorView";
import { SuccessView } from "./components/apple-pay/SuccessView";
import { PaymentReadyView } from "./components/apple-pay/PaymentReadyView";
import { OrderForm } from "./components/apple-pay/OrderForm";

interface ApplePayFlowProps {
  onDone: () => void;
}

export function ApplePayFlow({ onDone }: ApplePayFlowProps) {
  const { status, data, error, createOrder, reset } = useApplePay();
  const { evmAddress } = useEvmAddress();
  const { colors } = useTheme();

  const [amount, setAmount] = useState("");
  const [isSandbox, setIsSandbox] = useState(true);

  const handleCreateOrder = useCallback(async () => {
    const parsedAmount = parseFloat(amount);
    if (parsedAmount < 1 || parsedAmount > 10000 || !evmAddress) {
      return;
    }

    await createOrder({
      destination: { address: evmAddress, network: "base" },
      purchase: { amount, currency: "usdc" },
      payment: { currency: "usd" },
      isSandbox,
    });
  }, [amount, createOrder, evmAddress, isSandbox]);

  const handleDone = useCallback(() => {
    reset();
    setAmount("");
    onDone();
  }, [reset, onDone]);

  // Platform check - Apple Pay is iOS only
  if (Platform.OS !== "ios") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          backgroundColor: colors.cardBackground,
        }}
      >
        <Text style={{ fontSize: 18, textAlign: "center", color: colors.textSecondary }}>
          Apple Pay is only available on iOS devices. Please run this app on an iOS device or
          simulator to test the Apple Pay Onramp functionality.
        </Text>
      </View>
    );
  }

  if (status === "error") {
    if (error?.code === "requires_email") {
      return <EmailVerificationView />;
    }

    if (error?.code === "requires_sms") {
      return <SmsVerificationView />;
    }

    return <ErrorView message={error?.message || "An error occurred"} onRetry={reset} />;
  }

  if (status === "success") {
    return <SuccessView onDone={handleDone} />;
  }

  if (status === "pending" && data) {
    return <PaymentReadyView amount={amount} onCancel={reset} />;
  }

  return (
    <OrderForm
      amount={amount}
      onAmountChange={setAmount}
      onSubmit={handleCreateOrder}
      isCreatingOrder={status === "pending"}
      isSandbox={isSandbox}
      onSandboxChange={setIsSandbox}
    />
  );
}