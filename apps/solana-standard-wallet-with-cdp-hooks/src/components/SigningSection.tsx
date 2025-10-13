import { CdpSolanaWallet } from "@coinbase/cdp-solana-standard-wallet";
import { PublicKey, Transaction, SystemProgram, Connection } from "@solana/web3.js";
import { useState } from "react";

interface SigningSectionProps {
  wallet: CdpSolanaWallet;
}

/**
 * Signing operations component that demonstrates wallet signing capabilities.
 *
 * @param root0 - The component props
 * @param root0.wallet - The CDP Solana wallet instance for signing operations
 * @returns The signing operations component
 */
export default function SigningSection({ wallet }: SigningSectionProps) {
  const [messageResult, setMessageResult] = useState<string | null>(null);
  const [transactionResult, setTransactionResult] = useState<string | null>(null);
  const [sendTxResult, setSendTxResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearResults = () => {
    setMessageResult(null);
    setTransactionResult(null);
    setSendTxResult(null);
    setError(null);
  };

  const signMessage = async () => {
    if (!wallet.accounts.length) return;

    setLoading("message");
    clearResults();

    try {
      const account = wallet.accounts[0];
      const message = new TextEncoder().encode("Hello from CDP Solana Wallet!");

      const result = await wallet.features["solana:signMessage"].signMessage({
        account,
        message,
      });

      if (result.length > 0) {
        const signature = Array.from(result[0].signature)
          .map(b => b.toString(16).padStart(2, "0"))
          .join("");
        setMessageResult(`Message signed! Signature: ${signature}`);
      }
    } catch (err) {
      setError(`Message signing failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(null);
    }
  };

  const signTransaction = async () => {
    if (!wallet.accounts.length) return;

    setLoading("transaction");
    clearResults();

    try {
      const account = wallet.accounts[0];
      const serializedTransaction = await getSerializedTransaction(
        account.address,
        "4C7sHifMjsgNZTLHABr7vUqYXLFiGnZhSru712MKAxJf",
        1,
      );
      const result = await wallet.features["solana:signTransaction"].signTransaction({
        account,
        transaction: serializedTransaction,
        chain: "solana:devnet",
      });

      if (result.length > 0) {
        const signedTxBytes = Array.from(result[0].signedTransaction)
          .map(b => b.toString(16).padStart(2, "0"))
          .join("");
        setTransactionResult(
          `Transaction signed! Signed bytes: ${signedTxBytes.substring(0, 100)}...`,
        );
      }
    } catch (err) {
      setError(
        `Transaction signing failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setLoading(null);
    }
  };

  const signAndSendTransaction = async () => {
    if (!wallet.accounts.length) return;

    setLoading("sendTx");
    clearResults();

    try {
      const account = wallet.accounts[0];
      const serializedTransaction = await getSerializedTransaction(
        account.address,
        "4C7sHifMjsgNZTLHABr7vUqYXLFiGnZhSru712MKAxJf",
        1,
      );
      const result = await wallet.features["solana:signAndSendTransaction"].signAndSendTransaction({
        account,
        transaction: serializedTransaction,
        chain: "solana:devnet",
      });

      if (result.length > 0) {
        const signature = Array.from(result[0].signature)
          .map(b => b.toString(16).padStart(2, "0"))
          .join("");
        setSendTxResult(`Transaction sent! Signature: ${signature}`);
      }
    } catch (err) {
      setError(`Send transaction failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(null);
    }
  };

  const connectWallet = async () => {
    setLoading("connect");
    clearResults();

    try {
      const result = await wallet.features["standard:connect"].connect();
      setMessageResult(`Connected! Found ${result.accounts.length} accounts`);
    } catch (err) {
      setError(`Connect failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(null);
    }
  };

  const disconnectWallet = async () => {
    setLoading("disconnect");
    clearResults();

    try {
      await wallet.features["standard:disconnect"].disconnect();
      setMessageResult("Wallet disconnected!");
    } catch (err) {
      setError(`Disconnect failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(null);
    }
  };

  if (!wallet.accounts.length) {
    return (
      <div className="card">
        <h2>🖊️ Wallet Operations</h2>
        <p>No accounts available. Try connecting the wallet first.</p>
        <button className="button primary" onClick={connectWallet} disabled={loading === "connect"}>
          {loading === "connect" ? "Connecting..." : "Connect Wallet"}
        </button>
        {error && <div className="error">{error}</div>}
        {messageResult && <div className="success">{messageResult}</div>}
      </div>
    );
  }

  return (
    <div className="card">
      <h2>🖊️ Signing Operations</h2>
      <p>Test signing capabilities with your CDP Solana wallet</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1em", justifyContent: "center" }}>
        <button className="button" onClick={signMessage} disabled={loading === "message"}>
          {loading === "message" ? "Signing..." : "Sign Message"}
        </button>

        <button className="button" onClick={signTransaction} disabled={loading === "transaction"}>
          {loading === "transaction" ? "Signing..." : "Sign Transaction"}
        </button>

        <button
          className="button primary"
          onClick={signAndSendTransaction}
          disabled={loading === "sendTx"}
        >
          {loading === "sendTx" ? "Sending..." : "Sign & Send Transaction"}
        </button>

        <button className="button" onClick={connectWallet} disabled={loading === "connect"}>
          {loading === "connect" ? "Connecting..." : "Connect"}
        </button>

        <button
          className="button secondary"
          onClick={disconnectWallet}
          disabled={loading === "disconnect"}
        >
          {loading === "disconnect" ? "Disconnecting..." : "Disconnect"}
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {messageResult && <div className="success">{messageResult}</div>}
      {transactionResult && <div className="success">{transactionResult}</div>}
      {sendTxResult && <div className="success">{sendTxResult}</div>}

      <div className="code">
        <strong>Current Account:</strong>
        <br />
        Address: {wallet.accounts[0].address}
        <br />
        Features: {wallet.accounts[0].features.join(", ")}
      </div>
    </div>
  );
}

/**
 * Creates and serializes a Solana transfer transaction.
 *
 * @param fromAddress - The sender's Solana address
 * @param toAddress - The recipient's Solana address
 * @param lamports - The amount to transfer in lamports (default: 1)
 * @returns The serialized transaction as Uint8Array
 */
async function getSerializedTransaction(
  fromAddress: string,
  toAddress: string,
  lamports: number = 1,
) {
  const fromPubkey = new PublicKey(fromAddress);
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey: new PublicKey(toAddress),
      lamports,
    }),
  );
  const connection = new Connection("https://api.devnet.solana.com");
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = fromPubkey;
  const serializedTransaction = transaction.serialize({
    requireAllSignatures: false,
    verifySignatures: false,
  });

  return serializedTransaction;
}
