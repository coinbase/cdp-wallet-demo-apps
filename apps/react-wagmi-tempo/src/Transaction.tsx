import { useSignEvmTransaction } from "@coinbase/cdp-hooks";
import { Button } from "@coinbase/cdp-react/components/ui/Button";
import { useState } from "react";
import { type Hex, encodeFunctionData } from "viem";
import { useAccount } from "wagmi";

import { TOKENS, type Token } from "./tokens";
import { FAUCET_ADDRESS, tempoClient, tempoModerato } from "./tempo";

const ERC20_TRANSFER_ABI = [
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

interface TransactionProps {
  onSuccess?: () => void;
}

/**
 * Demonstrates sending an ERC-20 token transfer on Tempo using the CDP EOA.
 * The CDP backend signs the transaction; viem broadcasts it to Tempo's RPC.
 */
export function Transaction({ onSuccess }: TransactionProps) {
  const { address: eoaAddress } = useAccount();
  const { signEvmTransaction } = useSignEvmTransaction();

  const [selectedToken, setSelectedToken] = useState<Token>(TOKENS[0]);
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSendTransaction = async () => {
    if (!eoaAddress) return;

    setStatus("pending");
    setTxHash(null);
    setErrorMessage(null);

    try {
      const data = encodeFunctionData({
        abi: ERC20_TRANSFER_ABI,
        functionName: "transfer",
        args: [FAUCET_ADDRESS, 10_000_000n],
      });

      const [nonce, fees, gasLimit] = await Promise.all([
        tempoClient.getTransactionCount({ address: eoaAddress }),
        tempoClient.estimateFeesPerGas().catch(() => ({
          maxFeePerGas: 1000n,
          maxPriorityFeePerGas: 1000n,
        })),
        tempoClient
          .estimateGas({ account: eoaAddress, to: selectedToken.address, data, value: 0n })
          .catch(() => 60000n),
      ]);

      const { signedTransaction } = await signEvmTransaction({
        evmAccount: eoaAddress,
        transaction: {
          to: selectedToken.address,
          value: 0n,
          data,
          chainId: tempoModerato.id,
          type: "eip1559",
          nonce,
          gas: gasLimit,
          maxFeePerGas: fees.maxFeePerGas ?? 1000n,
          maxPriorityFeePerGas: fees.maxPriorityFeePerGas ?? 1000n,
        },
      });

      const hash = await tempoClient.sendRawTransaction({
        serializedTransaction: signedTransaction as Hex,
      });
      setTxHash(hash);

      await tempoClient.waitForTransactionReceipt({ hash });
      setStatus("success");
      onSuccess?.();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setTxHash(null);
    setErrorMessage(null);
  };

  return (
    <>
      <h2 className="card-title">Send a transaction</h2>

      <div className="token-picker">
        {TOKENS.map((token) => (
          <button
            key={token.symbol}
            className={`token-pill${selectedToken.symbol === token.symbol ? " token-pill--active" : ""}`}
            onClick={() => {
              setSelectedToken(token);
              handleReset();
            }}
            disabled={status === "pending"}
          >
            {token.symbol}
          </button>
        ))}
      </div>

      <p className="small-text">
        Send $10 {selectedToken.symbol} back to the faucet on Tempo (Chain ID {tempoModerato.id}).
      </p>

      {status === "idle" && eoaAddress && (
        <Button className="tx-button" onClick={handleSendTransaction}>
          Send $10 {selectedToken.symbol}
        </Button>
      )}

      {status === "pending" && (
        <div className="transaction-result">
          <p className="small-text">
            {txHash ? "Confirming on Tempo..." : "Signing and broadcasting..."}
          </p>
          {txHash && (
            <p className="small-text wallet-address">
              {txHash.slice(0, 18)}...{txHash.slice(-12)}
            </p>
          )}
        </div>
      )}

      {status === "error" && (
        <>
          <div className="error-box">
            <p className="small-text error-box__label">Transaction failed</p>
            <p className="small-text error-box__message">
              {errorMessage?.match(/Details:\s*(.+?)(?:\s*Version:|$)/s)?.[1]?.trim() ??
                errorMessage}
            </p>
          </div>
          <Button variant="secondary" className="tx-button" onClick={handleReset}>
            Try Again
          </Button>
        </>
      )}

      {status === "success" && txHash && (
        <div className="transaction-result">
          <p className="card-title">Transaction confirmed!</p>
          <p className="small-text">
            Tx Hash:{" "}
            <a
              href={`${tempoModerato.blockExplorers.default.url}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </a>
          </p>
          <Button variant="secondary" className="tx-button" onClick={handleReset}>
            Send Another
          </Button>
        </div>
      )}
    </>
  );
}
