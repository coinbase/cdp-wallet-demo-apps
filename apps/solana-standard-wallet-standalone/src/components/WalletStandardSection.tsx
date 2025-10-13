import { Wallet, WalletAccount } from "@wallet-standard/base";
import { CdpSolanaWallet } from "@coinbase/cdp-solana-standard-wallet";
import { useState } from "react";

interface WalletStandardSectionProps {
  standardWallets: readonly Wallet[];
  cdpWallet: CdpSolanaWallet | null;
}

/**
 * Wallet Standard section that displays all detected wallets in the ecosystem.
 *
 * @param root0 - The component props
 * @param root0.wallets - Array of all wallets detected through wallet standard
 * @param root0.selectedWallet - The currently selected wallet
 * @param root0.onWalletSelect - Callback to select a wallet
 * @returns The wallet standard section component
 */
export default function WalletStandardSection({
  standardWallets,
  cdpWallet,
}: WalletStandardSectionProps) {
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [walletDetails, setWalletDetails] = useState<{
    name: string;
    version: string;
    icon: string;
    chains: string[];
    accounts: WalletAccount[];
    features: string[];
  } | null>(null);

  const inspectWallet = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setWalletDetails({
      name: wallet.name,
      version: wallet.version,
      icon: wallet.icon,
      chains: wallet.chains.slice(),
      accounts: wallet.accounts.slice(),
      features: Object.keys(wallet.features),
    });
  };

  const isCdpWallet = (wallet: Wallet) => {
    return "cdp:" in wallet.features && wallet.features["cdp:"] === true;
  };

  return (
    <div className="card">
      <h2>🌐 Wallet Standard Integration</h2>
      <p>This section shows all wallets available through the Wallet Standard API</p>

      <h3>Available Wallets ({standardWallets.length})</h3>

      {standardWallets.length === 0 ? (
        <div className="status disconnected">No wallets detected through Wallet Standard</div>
      ) : (
        <div className="wallet-list">
          {standardWallets.map((wallet, index) => (
            <div key={index} className="wallet-item">
              <div className="wallet-info">
                {wallet.icon && <img src={wallet.icon} alt={wallet.name} className="wallet-icon" />}
                <div>
                  <strong>{wallet.name}</strong>
                  {isCdpWallet(wallet) && <span className="success"> (CDP Wallet)</span>}
                  <div style={{ fontSize: "0.8em", opacity: 0.7 }}>
                    Version: {wallet.version} | Accounts: {wallet.accounts.length}
                  </div>
                </div>
              </div>
              <button className="button" onClick={() => inspectWallet(wallet)}>
                Inspect
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedWallet && walletDetails && (
        <div>
          <h3>Wallet Details: {walletDetails.name}</h3>
          <div className="code">
            <div>
              <strong>Name:</strong> {walletDetails.name}
            </div>
            <div>
              <strong>Version:</strong> {walletDetails.version}
            </div>
            <div>
              <strong>Chains:</strong> {walletDetails.chains.join(", ")}
            </div>
            <div>
              <strong>Accounts:</strong> {walletDetails.accounts.length}
            </div>
            <div>
              <strong>Features:</strong>
            </div>
            <ul>
              {walletDetails.features.map((feature: string) => (
                <li key={feature}>
                  {feature}
                  {feature === "cdp:" && " ✨ (CDP Custom Feature)"}
                </li>
              ))}
            </ul>
          </div>

          {walletDetails.accounts.length > 0 && (
            <div>
              <h4>Accounts</h4>
              {walletDetails.accounts.map((account: WalletAccount, index: number) => (
                <div key={index} className="code">
                  <div>
                    <strong>Account {index + 1}:</strong>
                  </div>
                  <div>
                    <strong>Address:</strong> {account.address}
                  </div>
                  <div>
                    <strong>Chains:</strong> {account.chains.join(", ")}
                  </div>
                  <div>
                    <strong>Features:</strong> {account.features.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <h3>CDP Wallet Registration Status</h3>
      {cdpWallet ? (
        <div className="status connected">
          ✅ CDP Solana Wallet is registered with the Wallet Standard
        </div>
      ) : (
        <div className="status disconnected">❌ CDP Solana Wallet is not ready</div>
      )}

      <h3>Integration Test</h3>
      <div className="code">
        <div>
          <strong>Wallet Standard Detection:</strong>{" "}
          {standardWallets.length > 0 ? "✅ Working" : "❌ No wallets found"}
        </div>
        <div>
          <strong>CDP Wallet Hook:</strong> {cdpWallet ? "✅ Working" : "❌ Not ready"}
        </div>
        <div>
          <strong>CDP Wallet in Standard:</strong>{" "}
          {standardWallets.some(w => isCdpWallet(w)) ? "✅ Registered" : "❌ Not found"}
        </div>
        <div>
          <strong>Feature Detection:</strong>{" "}
          {cdpWallet && "cdp:" in cdpWallet.features ? "✅ Working" : "❌ Missing"}
        </div>
      </div>
    </div>
  );
}
