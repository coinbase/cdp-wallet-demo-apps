import { Wallet } from "@wallet-standard/base";
import { PublicKey, Transaction, SystemProgram, Connection } from "@solana/web3.js";
import { useState } from "react";

interface SigningSectionProps {
  wallet: Wallet;
}

/**
 * Signing operations component that demonstrates wallet signing capabilities.
 *
 * @param root0 - The component props
 * @param root0.wallet - The wallet instance for signing operations
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
      const message = new TextEncoder().encode("Hello from Solana Wallet Standard!");

      if ("solana:signMessage" in wallet.features) {
        const result = await (wallet.features["solana:signMessage"] as any).signMessage({
          account,
          message,
        });

        if (result.length > 0) {
          const signature = Array.from(result[0].signature as Uint8Array)
            .map((b: number) => b.toString(16).padStart(2, "0"))
            .join("");
          setMessageResult(`Message signed! Signature: ${signature}`);
        }
      } else {
        throw new Error("Wallet does not support message signing");
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

      if ("solana:signTransaction" in wallet.features) {
        const result = await (wallet.features["solana:signTransaction"] as any).signTransaction({
          account,
          transaction: serializedTransaction,
          chain: "solana:devnet",
        });

        if (result.length > 0) {
          const signedTxBytes = Array.from(result[0].signedTransaction as Uint8Array)
            .map((b: number) => b.toString(16).padStart(2, "0"))
            .join("");
          setTransactionResult(
            `Transaction signed! Signed bytes: ${signedTxBytes.substring(0, 100)}...`,
          );
        }
      } else {
        throw new Error("Wallet does not support transaction signing");
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

      if ("solana:signAndSendTransaction" in wallet.features) {
        const result = await (wallet.features["solana:signAndSendTransaction"] as any).signAndSendTransaction({
          account,
          transaction: serializedTransaction,
          chain: "solana:devnet",
        });

        if (result.length > 0) {
          const signature = Array.from(result[0].signature as Uint8Array)
            .map((b: number) => b.toString(16).padStart(2, "0"))
            .join("");
          setSendTxResult(`Transaction sent! Signature: ${signature}`);
        }
      } else {
        throw new Error("Wallet does not support sign and send transaction");
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
      if ("standard:connect" in wallet.features) {
        const result = await (wallet.features["standard:connect"] as any).connect();
        setMessageResult(`Connected! Found ${result.accounts.length} accounts`);
      } else {
        throw new Error("Wallet does not support connect feature");
      }
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
      if ("standard:disconnect" in wallet.features) {
        await (wallet.features["standard:disconnect"] as any).disconnect();
        setMessageResult("Wallet disconnected!");
      } else {
        throw new Error("Wallet does not support disconnect feature");
      }
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
      <p>Test signing capabilities with your selected Solana wallet</p>

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

      <h3>Available Features</h3>
      <div className="code">
        {Object.keys(wallet.features).map(feature => (
          <div key={feature}>
            ✅ {feature}
            {feature === "solana:signMessage" && " (Message Signing)"}
            {feature === "solana:signTransaction" && " (Transaction Signing)"}
            {feature === "solana:signAndSendTransaction" && " (Sign & Send)"}
            {feature === "standard:connect" && " (Connect)"}
            {feature === "standard:disconnect" && " (Disconnect)"}
          </div>
        ))}
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