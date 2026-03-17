import { useCallback, useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";

import { TOKEN_DECIMALS, TOKENS } from "./tokens";
import { tempoClient } from "./tempo";

const ERC20_BALANCE_OF_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

interface TokenBalance {
  symbol: string;
  formatted: string;
}

/**
 * Displays ERC-20 token balances for the connected EOA on Tempo.
 */
interface BalancesProps {
  refreshTrigger?: number;
}

export function Balances({ refreshTrigger }: BalancesProps) {
  const { address } = useAccount();
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalances = useCallback(async () => {
    if (!address) return;

    setIsLoading(true);
    try {
      const results = await Promise.all(
        TOKENS.map((token) =>
          tempoClient.readContract({
            address: token.address,
            abi: ERC20_BALANCE_OF_ABI,
            functionName: "balanceOf",
            args: [address],
          }),
        ),
      );

      setTokenBalances(
        TOKENS.map((token, i) => ({
          symbol: token.symbol,
          formatted: formatUnits(results[i] as bigint, TOKEN_DECIMALS),
        })),
      );
    } finally {
      setIsLoading(false);
    }
  }, [address, tempoClient]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  useEffect(() => {
    if (refreshTrigger === undefined || refreshTrigger === 0) return;
    fetchBalances();
  }, [refreshTrigger, fetchBalances]);

  useEffect(() => {
    if (!address) return;
    const id = setInterval(fetchBalances, 5000);
    return () => clearInterval(id);
  }, [address, fetchBalances]);

  return (
    <>
      <div className="balances-header">
        <h2 className="card-title">Balances</h2>
        <button
          className="refresh-button"
          onClick={fetchBalances}
          disabled={isLoading}
          aria-label="Refresh balances"
        >
          {isLoading ? "↻" : "↻"}
        </button>
      </div>

      <table className="balances-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {tokenBalances
            ? tokenBalances.map((b) => (
                <tr key={b.symbol}>
                  <td>{b.symbol}</td>
                  <td>{b.formatted}</td>
                </tr>
              ))
            : TOKENS.map((t) => (
                <tr key={t.symbol}>
                  <td>{t.symbol}</td>
                  <td>—</td>
                </tr>
              ))}
        </tbody>
      </table>

      <p className="small-text">
        <a
          href="https://docs.tempo.xyz/quickstart/faucet?tab-1=fund-an-address"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get testnet tokens from the faucet
        </a>
      </p>
    </>
  );
}
