import { CdpSolanaWallet } from "@coinbase/cdp-solana-standard-wallet";

interface WalletSectionProps {
  walletReady: boolean;
  cdpWallet: CdpSolanaWallet | null;
}

/**
 * Wallet details section that displays CDP wallet information and accounts.
 *
 * @param root0 - The component props
 * @param root0.walletReady - Whether the CDP wallet is ready for use
 * @param root0.cdpWallet - The CDP Solana wallet instance, if available
 * @returns The wallet section component
 */
export default function WalletSection({ walletReady, cdpWallet }: WalletSectionProps) {
  return (
    <div className="card">
      <h2>💰 CDP Solana Wallet</h2>

      {!walletReady ? (
        <div className="status disconnected">⏳ Initializing wallet...</div>
      ) : (
        <div>
          <div className="status connected">✅ Wallet ready!</div>

          {cdpWallet && (
            <div>
              <h3>Wallet Details</h3>
              <div className="code">
                <div>
                  <strong>Name:</strong> {cdpWallet.name}
                </div>
                <div>
                  <strong>Version:</strong> {cdpWallet.version}
                </div>
                <div>
                  <strong>Chains:</strong> {cdpWallet.chains.join(", ")}
                </div>
                <div>
                  <strong>Accounts:</strong> {cdpWallet.accounts.length}
                </div>
              </div>

              <h3>Accounts</h3>
              {cdpWallet.accounts.length > 0 ? (
                <div>
                  {cdpWallet.accounts.map((account, index) => (
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
              ) : (
                <p>No accounts available</p>
              )}

              <h3>Supported Features</h3>
              <div className="code">
                {Object.keys(cdpWallet.features).map(feature => (
                  <div key={feature}>✅ {feature}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
