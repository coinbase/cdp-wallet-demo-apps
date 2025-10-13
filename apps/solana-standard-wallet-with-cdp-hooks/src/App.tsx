import { useCurrentUser } from "@coinbase/cdp-hooks";
import {
  useCdpSolanaStandardWallet,
  useSolanaStandardWallets,
} from "@coinbase/cdp-solana-standard-wallet";

import AuthSection from "./components/AuthSection";
import SigningSection from "./components/SigningSection";
import WalletSection from "./components/WalletSection";
import WalletStandardSection from "./components/WalletStandardSection";

/**
 * Main application component demonstrating CDP Standard Solana Wallet integration.
 *
 * @returns The main App component
 */
function App() {
  const { currentUser: user } = useCurrentUser();

  // Use our CDP Standard Solana Wallet hook
  const { ready: walletReady, wallet: cdpWallet } = useCdpSolanaStandardWallet();

  // Use the standard wallets hook to see all available wallets
  const { wallets: standardWallets } = useSolanaStandardWallets();

  return (
    <div>
      <header>
        <h1>CDP Standard Solana Wallet Example</h1>
        <p>
          This example demonstrates the CDP Standard Solana Wallet integration with the Wallet
          Standard.
        </p>
      </header>

      <main>
        <AuthSection user={user} />

        {user && <WalletSection walletReady={walletReady} cdpWallet={cdpWallet} />}

        {user && walletReady && cdpWallet && <SigningSection wallet={cdpWallet} />}

        <WalletStandardSection standardWallets={standardWallets} cdpWallet={cdpWallet} />
      </main>
    </div>
  );
}

export default App;
