import { useMemo } from "react";
import { useAccount, useSendTransaction } from "wagmi";

import { Button } from "@coinbase/cdp-react/components/ui/Button";
import { LoadingSkeleton } from "@coinbase/cdp-react/components/ui/LoadingSkeleton";

interface Props {
  balance?: string;
  onSuccess?: () => void;
}

/**
 * This component demonstrates how to send an EVM transaction using Wagmi.
 *
 * @param {Props} props - The props for the Transaction component.
 * @param {string} [props.balance] - The user's balance.
 * @param {() => void} [props.onSuccess] - A function to call when the transaction is successful.
 * @returns A component that displays a transaction form and a transaction hash.
 */
export function Transaction(props: Props) {
  const { balance, onSuccess } = props;
  const { address } = useAccount();
  const { sendTransaction, data, error, reset } = useSendTransaction({
    mutation: {
      onSuccess,
    },
  });

  const hasBalance = useMemo(() => {
    return balance && balance !== "0";
  }, [balance]);

  return (
    <>
      {balance === undefined && (
        <>
          <h2 className="card-title">Send a transaction</h2>
          <LoadingSkeleton className="loading--text" />
          <LoadingSkeleton className="loading--btn" />
        </>
      )}
      {balance !== undefined && (
        <>
          {!data && error && (
            <>
              <h2 className="card-title">Oops</h2>
              <p>{error.message}</p>
              <Button className="tx-button" onClick={reset}>
                Try again
              </Button>
            </>
          )}
          {!data && !error && (
            <>
              <h2 className="card-title">Send a transaction</h2>
              {hasBalance && address && (
                <>
                  <p>Send 0.000001 ETH to yourself on Base Sepolia</p>
                  <Button
                    className="tx-button"
                    onClick={() => {
                      sendTransaction({
                        to: address,
                        value: 1000000000000n,
                        gas: 21000n,
                      });
                    }}
                  >
                    Send Transaction
                  </Button>
                </>
              )}
              {!hasBalance && (
                <>
                  <p>
                    This example transaction sends a tiny amount of ETH from
                    your wallet to itself.
                  </p>
                  <p>
                    Get some from{" "}
                    <a
                      href="https://portal.cdp.coinbase.com/products/faucet"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Base Sepolia Faucet
                    </a>
                  </p>
                </>
              )}
            </>
          )}
          {data && (
            <>
              <h2 className="card-title">Transaction sent</h2>
              <p>
                Transaction hash:{" "}
                <a
                  href={`https://sepolia.basescan.org/tx/${data}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.slice(0, 6)}...{data.slice(-4)}
                </a>
              </p>
              <Button variant="secondary" className="tx-button" onClick={reset}>
                Send another transaction
              </Button>
            </>
          )}
        </>
      )}
    </>
  );
}
