import {
  useSignEvmMessage,
  useSignEvmTransaction,
} from "@coinbase/cdp-hooks";
import { SendEvmTransactionButton, Button } from "@coinbase/cdp-react";
import { useState } from "react";

interface EvmWalletActionsProps {
  evmAccount: `0x${string}`;
  accountType: "eoa" | "smart";
}

/**
 * Component that provides actions for EVM wallets including signing messages, transactions, and sending transactions
 *
 * @param root0 - Component props
 * @param root0.evmAccount - The EVM account address
 * @param root0.accountType - The type of account (EOA or Smart)
 * @returns The EVM wallet actions component
 */
export const EvmWalletActions = ({ evmAccount, accountType }: EvmWalletActionsProps) => {
  const { signEvmMessage } = useSignEvmMessage();
  const { signEvmTransaction } = useSignEvmTransaction();
  const [messageLoading, setMessageLoading] = useState(false);
  const [signTxLoading, setSignTxLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signResult, setSignResult] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const handleSignMessage = async () => {
    setMessageLoading(true);
    setError(null);
    setSignResult(null);
    setTransactionHash(null);

    try {
      const messageText = "Hello from CDP + Auth0!";

      const result = await signEvmMessage({
        evmAccount,
        message: messageText,
      });
      setSignResult(`EVM Message: "${messageText}"\nSignature: ${result.signature}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign failed");
    } finally {
      setMessageLoading(false);
    }
  };

  const handleSignTransaction = async () => {
    setSignTxLoading(true);
    setError(null);
    setSignResult(null);
    setTransactionHash(null);

    try {
      // Sign a transaction without sending it (0 wei to self)
      const result = await signEvmTransaction({
        evmAccount,
        transaction: {
          to: evmAccount,
          value: 0n,
          chainId: 84532,
          type: "eip1559",
        },
      });
      setSignResult(`Signed EVM Transaction:\n${result.signedTransaction.substring(0, 100)}...`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign transaction failed");
    } finally {
      setSignTxLoading(false);
    }
  };

  return (
    <div className="actions-section">
      <h3>EVM {accountType === "smart" ? "Smart Account" : "Wallet"} Actions</h3>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {signResult && (
        <div className="success-message">
          <p style={{ whiteSpace: "pre-wrap" }}>{signResult}</p>
        </div>
      )}

      {transactionHash && (
        <div className="success-message">
          <p>Transaction Hash: {transactionHash}</p>
          <a
            href={`https://sepolia.basescan.org/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#61dafb",
              textDecoration: "underline",
              marginTop: "0.5rem",
              display: "inline-block",
            }}
          >
            View on BaseScan ↗
          </a>
        </div>
      )}

      <div className="action-buttons">
        <Button
          onClick={handleSignMessage}
          disabled={messageLoading}
          pendingLabel="Signing..."
          className="action-button"
        >
          Sign Message
        </Button>

        <Button
          onClick={handleSignTransaction}
          disabled={signTxLoading}
          pendingLabel="Signing..."
          className="action-button"
        >
          Sign Transaction
        </Button>

        <SendEvmTransactionButton
          account={evmAccount}
          network="base-sepolia"
          transaction={{
            to: evmAccount,
            value: 0n,
            chainId: 84532,
            type: "eip1559",
          }}
          onSuccess={(hash) => {
            setError(null);
            setSignResult(null);
            setTransactionHash(hash);
          }}
          onError={(err) => {
            setError(err.message);
            setTransactionHash(null);
          }}
          pendingLabel="Sending..."
          className="action-button"
        >
          Send Transaction
        </SendEvmTransactionButton>
      </div>
    </div>
  );
};
