import { useSendUserOperation } from "@coinbase/cdp-hooks";
import { Button } from "@coinbase/cdp-react";
import { useState } from "react";

interface EvmSmartAccountActionsProps {
  evmSmartAccount: `0x${string}`;
}

/**
 * Component that provides actions for EVM Smart Account wallets including user operations
 *
 * @param root0 - Component props
 * @param root0.evmSmartAccount - The EVM Smart Account address
 * @returns The EVM Smart Account actions component
 */
export const EvmSmartAccountActions = ({ evmSmartAccount }: EvmSmartAccountActionsProps) => {
  const { sendUserOperation, status, data, error } = useSendUserOperation();
  const [preparedOp, setPreparedOp] = useState<{
    to: `0x${string}`;
    value: bigint;
  } | null>(null);

  const handlePrepareUserOperation = () => {
    // Prepare a simple user operation (0 wei to self)
    setPreparedOp({
      to: evmSmartAccount,
      value: 0n,
    });
  };

  const handleSendUserOperation = async () => {
    if (!preparedOp) {
      handlePrepareUserOperation();
    }

    try {
      // Send a user operation (0 wei to self as a test)
      await sendUserOperation({
        evmSmartAccount,
        network: "base-sepolia",
        calls: [
          {
            to: preparedOp?.to || evmSmartAccount,
            value: preparedOp?.value || 0n,
          },
        ],
        useCdpPaymaster: true,
      });
    } catch (err) {
      console.error("User operation failed:", err);
    }
  };

  return (
    <div className="actions-section">
      <h3>EVM Smart Account Actions</h3>

      {/* Show prepared operation */}
      {preparedOp && status !== "pending" && status !== "success" && (
        <div className="info-message">
          <p>
            <strong>Prepared Operation:</strong>
          </p>
          <p>To: {preparedOp.to}</p>
          <p>Value: {preparedOp.value.toString()} wei</p>
        </div>
      )}

      {/* Show status from hook */}
      {status === "pending" && (
        <div className="success-message">
          <p>User Operation Hash: {data?.userOpHash || "Pending..."}</p>
          <p>Transaction Hash: Pending...</p>
        </div>
      )}

      {status === "success" && data && (
        <div className="success-message">
          <p>User operation successful!</p>
          <p>User Op Hash: {data.userOpHash}</p>
          <p>Transaction Hash: {data.transactionHash}</p>
          {data.transactionHash && (
            <a
              href={`https://sepolia.basescan.org/tx/${data.transactionHash}`}
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
          )}
        </div>
      )}

      {status === "error" && error && (
        <div className="error-message">
          <p>Error: {error.message}</p>
        </div>
      )}

      <div className="action-buttons">
        <Button
          onClick={handlePrepareUserOperation}
          disabled={status === "pending"}
          className="action-button"
        >
          Prepare User Operation
        </Button>

        <Button
          onClick={handleSendUserOperation}
          disabled={status === "pending"}
          pendingLabel="Sending..."
          className="action-button"
        >
          Send User Operation
        </Button>
      </div>
    </div>
  );
};
