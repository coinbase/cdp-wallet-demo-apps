import { useState } from "react";

import { Balances } from "./Balances";
import { Header } from "./Header";
import { Transaction } from "./Transaction";

/**
 * The Signed In screen for the Tempo demo.
 */
export function SignedInScreen() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <>
      <Header />
      <main className="main flex-col-container flex-grow">
        <div className="main-inner flex-col-container">
          <div className="card card--balances">
            <Balances refreshTrigger={refreshTrigger} />
          </div>
          <div className="card card--transaction">
            <Transaction onSuccess={() => setRefreshTrigger((n) => n + 1)} />
          </div>
        </div>
      </main>
    </>
  );
}
