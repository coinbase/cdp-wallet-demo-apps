import { useEffect, useState } from "react";
import { User, getCurrentUser, onAuthStateChange } from "@coinbase/cdp-core";
import {
  useCdpSolanaStandardWallet,
  useSolanaStandardWallets,
} from "@coinbase/cdp-solana-standard-wallet";

import AuthSection from "./components/AuthSection";
import SigningSection from "./components/SigningSection";
import WalletSection from "./components/WalletSection";
import WalletStandardSection from "./components/WalletStandardSection";

/**
 * Main application component demonstrating standalone Solana Wallet Standard integration.
 * This example uses CDP core API directly without hooks or providers.
 *
 * @returns The main App component
 */
function App() {
  const [user, setUser] = useState<User | null>(null);

  // CDP configuration
  const config = {
    projectId: import.meta.env.VITE_CDP_PROJECT_ID,
    basePath: import.meta.env.VITE_CDP_BASE_PATH,
    useMock: import.meta.env.VITE_USE_MOCK === "true",
    solana: {
      createOnLogin: import.meta.env.VITE_CDP_CREATE_SOLANA_ACCOUNT === "true",
    },
  };

  // Use our CDP Standard Solana Wallet hook with config for standalone usage
  const { ready: walletReady, wallet: cdpWallet } = useCdpSolanaStandardWallet(config);

  // Use the standard wallets hook to see all available wallets
  const { wallets: standardWallets } = useSolanaStandardWallets();

  // Set up auth state management (CDP initialization handled by the hook)
  useEffect(() => {
    const setupAuth = async () => {
      try {
        // Get current user if already signed in
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        // Set up auth state change listener
        onAuthStateChange(user => {
          setUser(user);
        });
      } catch (error) {
        console.error("Failed to setup auth:", error);
      }
    };

    setupAuth();
  }, []);

  // No need for manual wallet detection - useSolanaStandardWallets handles it

  // No need for manual wallet creation - useCdpSolanaStandardWallet handles it

  return (
    <div>
      <header>
        <h1>Solana Standard Wallet - Standalone Example</h1>
        <p>
          This example demonstrates Solana wallet integration using the Wallet Standard with CDP
          core API directly (no hooks, no providers).
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
