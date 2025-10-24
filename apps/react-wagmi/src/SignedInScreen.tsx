import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import { formatEther } from "viem";

import { Header } from "./Header";
import { Loading } from "./Loading";
import { UserBalance } from "./UserBalance";
import { Transaction } from "./Transaction";
import { publicClient } from "./config";
import { useAccount } from "wagmi";

/**
 * The Signed In screen
 */
export function SignedInScreen() {
  const { address } = useAccount();

  const [balance, setBalance] = useState<bigint | undefined>(undefined);

  const formattedBalance = useMemo(() => {
    if (balance === undefined) return undefined;
    // Convert wei to ETH
    return formatEther(balance);
  }, [balance]);

  const getBalance = useCallback(async () => {
    if (!address) return;

    // Get EVM balance in wei
    const weiBalance = await publicClient.getBalance({
      address,
    });
    setBalance(weiBalance);
  }, [address]);

  useEffect(() => {
    getBalance();
    const interval = setInterval(getBalance, 500);
    return () => clearInterval(interval);
  }, [getBalance]);

  return (
    <>
      <Header />
      <main className="main flex-col-container flex-grow">
        <div className="main-inner flex-col-container">
          <div className="card card--user-balance">
            <UserBalance balance={formattedBalance} />
          </div>
          <div className="card card--transaction">
            {address && (
              <Suspense fallback={<Loading />}>
                <Transaction
                  balance={formattedBalance}
                  onSuccess={getBalance}
                />
              </Suspense>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
