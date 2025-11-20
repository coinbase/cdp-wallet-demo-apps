import { useAuth0 } from "@auth0/auth0-react";
import { useCurrentUser } from "@coinbase/cdp-hooks";
import { Button } from "@coinbase/cdp-react";
import { useState } from "react";

import { EvmSmartAccountActions } from "./EvmSmartAccountActions";
import { EvmWalletActions } from "./EvmWalletActions";
import { SolanaWalletActions } from "./SolanaWalletActions";

/**
 * Tab component that displays wallet information for Solana and EVM accounts
 *
 * @returns The CDP wallet information tab component
 */
export const CDPTab = () => {
  const { isAuthenticated } = useAuth0();
  const { currentUser: cdpUser } = useCurrentUser();
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [hasUserLoaded, setHasUserLoaded] = useState(false);

  // Track if we've ever had a user to distinguish between loading and logging out
  if (cdpUser && !hasUserLoaded) {
    setHasUserLoaded(true);
  }

  const copyToClipboard = (address: string, label: string) => {
    navigator.clipboard.writeText(address).then(() => {
      setCopiedAddress(label);
      setTimeout(() => setCopiedAddress(null), 2000);
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="tab-content">
        <div className="user-details">
          <h3>Auth0 Required</h3>
          <p>Please authenticate with Auth0 first before using CDP Embedded Wallets.</p>
        </div>
      </div>
    );
  }

  // If we don't have a user and we've never had one, show loading
  // If we don't have a user but we had one before, user is logging out - show nothing
  if (!cdpUser) {
    if (!hasUserLoaded) {
      return (
        <div className="tab-content">
          <div className="user-details">
            <h3>Fetching CDP Wallets...</h3>
            <p>Please wait while we create your embedded wallets.</p>
            <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#888" }}>
              This usually takes a few seconds. If this takes too long, try refreshing the page.
            </p>
          </div>
        </div>
      );
    }
    return null;
  }

  // Extract account info
  const solanaAccount = cdpUser.solanaAccounts?.[0];
  const evmEoaAccount = cdpUser.evmAccounts?.[0];
  const evmSmartAccount = cdpUser.evmSmartAccounts?.[0];

  return (
    <div className="tab-content">
      <div className="details-grid">
        <div className="user-details">
          <h3>CDP User Info</h3>
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ margin: "0.5rem 0", fontSize: "0.9rem" }}>
              <strong>User ID:</strong>{" "}
              <span style={{ fontFamily: "monospace", color: "#888" }}>{cdpUser.userId}</span>
            </p>
            <p style={{ margin: "0.5rem 0", fontSize: "0.9rem" }}>
              <strong>Auth Type:</strong> <span style={{ color: "#888" }}>JWT</span>
            </p>
          </div>
        </div>

        {solanaAccount && (
          <div className="user-details">
            <h3>Solana Wallet</h3>
            <div style={{ marginTop: "0.5rem" }}>
              <code
                style={{
                  display: "block",
                  background: "#f5f5f5",
                  color: "#333",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  wordBreak: "break-all",
                  border: "1px solid #e0e0e0",
                  fontFamily: "monospace",
                  marginBottom: "0.5rem",
                }}
              >
                {solanaAccount}
              </code>
              <Button
                onClick={() => copyToClipboard(solanaAccount, "solana")}
              >
                {copiedAddress === "solana" ? "✓ Copied!" : "Copy Address"}
              </Button>
            </div>
          </div>
        )}

        {evmEoaAccount && (
          <div className="user-details">
            <h3>EVM EOA Wallet</h3>
            <div style={{ marginTop: "0.5rem" }}>
              <code
                style={{
                  display: "block",
                  background: "#f5f5f5",
                  color: "#333",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  wordBreak: "break-all",
                  border: "1px solid #e0e0e0",
                  fontFamily: "monospace",
                  marginBottom: "0.5rem",
                }}
              >
                {evmEoaAccount}
              </code>
              <Button
                onClick={() => copyToClipboard(evmEoaAccount, "evm-eoa")}
              >
                {copiedAddress === "evm-eoa" ? "✓ Copied!" : "Copy Address"}
              </Button>
            </div>
          </div>
        )}

        {evmSmartAccount && (
          <div className="user-details">
            <h3>EVM Smart Account</h3>
            <div style={{ marginTop: "0.5rem" }}>
              <code
                style={{
                  display: "block",
                  background: "#f5f5f5",
                  color: "#333",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  wordBreak: "break-all",
                  border: "1px solid #e0e0e0",
                  fontFamily: "monospace",
                  marginBottom: "0.5rem",
                }}
              >
                {evmSmartAccount}
              </code>
              <Button
                onClick={() => copyToClipboard(evmSmartAccount, "evm-smart")}
              >
                {copiedAddress === "evm-smart" ? "✓ Copied!" : "Copy Address"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Render appropriate wallet actions based on what accounts exist */}
      {solanaAccount && <SolanaWalletActions solanaAccount={solanaAccount} />}
      {evmEoaAccount && <EvmWalletActions evmAccount={evmEoaAccount} accountType="eoa" />}
      {evmSmartAccount && <EvmSmartAccountActions evmSmartAccount={evmSmartAccount} />}
    </div>
  );
};
