import { Buffer } from "buffer";

import {
  useSignSolanaMessage,
  useSignSolanaTransaction,
} from "@coinbase/cdp-hooks";
import { SendSolanaTransactionButton, Button } from "@coinbase/cdp-react";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
} from "@solana/web3.js";
import { useState } from "react";

interface SolanaWalletActionsProps {
  solanaAccount: string;
}

/**
 * Component that provides actions for Solana wallets including signing messages, transactions, and sending transactions
 *
 * @param root0 - Component props
 * @param root0.solanaAccount - The Solana account address
 * @returns The Solana wallet actions component
 */
export const SolanaWalletActions = ({ solanaAccount }: SolanaWalletActionsProps) => {
  const { signSolanaMessage } = useSignSolanaMessage();
  const { signSolanaTransaction } = useSignSolanaTransaction();
  const [messageLoading, setMessageLoading] = useState(false);
  const [signTxLoading, setSignTxLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signResult, setSignResult] = useState<string | null>(null);
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null);

  const createTransaction = (address: string): string => {
    const fromPubkey = new PublicKey(address);
    const toPubkey = new PublicKey(address); // Send to self for testing

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: 1, // 1 lamport
      }),
    );

    transaction.recentBlockhash = SYSVAR_RECENT_BLOCKHASHES_PUBKEY.toBase58();
    transaction.feePayer = fromPubkey;

    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false,
    });

    return Buffer.from(serializedTransaction).toString("base64");
  };

  const handleSignMessage = async () => {
    setMessageLoading(true);
    setError(null);
    setSignResult(null);
    setTransactionSignature(null);

    try {
      const messageText = "Hello from CDP + Auth0!";
      const messageBase64 = btoa(messageText);

      const result = await signSolanaMessage({
        solanaAccount,
        message: messageBase64,
      });
      setSignResult(`Solana Message: "${messageText}"\nSignature: ${result.signature}`);
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
    setTransactionSignature(null);

    try {
      const transaction = createTransaction(solanaAccount);
      const result = await signSolanaTransaction({
        solanaAccount,
        transaction,
      });
      setSignResult(`Signed Solana Transaction:\n${result.signedTransaction.substring(0, 100)}...`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign transaction failed");
    } finally {
      setSignTxLoading(false);
    }
  };

  return (
    <div className="actions-section">
      <h3>Solana Wallet Actions</h3>

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

      {transactionSignature && (
        <div className="success-message">
          <p>Transaction Signature: {transactionSignature}</p>
          <a
            href={`https://solscan.io/tx/${transactionSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#61dafb",
              textDecoration: "underline",
              marginTop: "0.5rem",
              display: "inline-block",
            }}
          >
            View on Solscan ↗
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

        <SendSolanaTransactionButton
          account={solanaAccount}
          network="solana-devnet"
          transaction={createTransaction(solanaAccount)}
          onSuccess={(signature) => {
            setError(null);
            setSignResult(null);
            setTransactionSignature(signature);
          }}
          onError={(err) => {
            setError(err.message);
            setTransactionSignature(null);
          }}
          pendingLabel="Sending..."
          className="action-button"
        >
          Send Transaction
        </SendSolanaTransactionButton>
      </div>
    </div>
  );
};
