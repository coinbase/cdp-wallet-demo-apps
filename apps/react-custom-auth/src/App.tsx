import { useAuth0 } from "@auth0/auth0-react";
import { useAuthenticateWithJWT, useCurrentUser } from "@coinbase/cdp-hooks";
import { useState, useEffect } from "react";

import { Auth0Tab } from "./components/Auth0Tab";
import { CDPTab } from "./components/CDPTab";
import { TabNavigation } from "./components/TabNavigation";
import { LoginButton } from "./LoginButton";
import { LogoutButton } from "./LogoutButton";
import "./App.css";

/**
 * Main application component that handles Auth0 authentication and CDP wallet integration
 *
 * @returns The main application component
 */
export const App = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const { currentUser: cdpUser } = useCurrentUser();
  const { authenticateWithJWT } = useAuthenticateWithJWT();
  const [activeTab, setActiveTab] = useState<"auth0" | "cdp">("cdp");
  const [cdpAuthLoading, setCdpAuthLoading] = useState(false);
  const [cdpAuthError, setCdpAuthError] = useState<string | null>(null);

  // Automatically authenticate with CDP after Auth0 login
  useEffect(() => {
    const authenticateCDP = async () => {
      if (isAuthenticated && !cdpUser && !cdpAuthLoading) {
        setCdpAuthLoading(true);
        setCdpAuthError(null);
        try {
          await authenticateWithJWT();
          console.log("CDP authentication successful");
        } catch (error) {
          console.error("CDP authentication failed:", error);
          setCdpAuthError(error instanceof Error ? error.message : "Failed to authenticate with CDP");
        } finally {
          setCdpAuthLoading(false);
        }
      }
    };

    authenticateCDP();
  }, [isAuthenticated, cdpUser, authenticateWithJWT, cdpAuthLoading]);

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="card">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <h1>Auth0 + CDP Developer JWT Test</h1>
        <p className="subtitle">Testing Auth0 authentication and CDP Embedded Wallets</p>
      </header>

      <div className="card">
        {!isAuthenticated ? (
          <div className="auth-section">
            <h2>Welcome!</h2>
            <p>Please log in to continue</p>
            <LoginButton />
          </div>
        ) : (
          <div className="auth-section">
            <div className="auth-section-header">
              <h2>Authentication Successful</h2>
              <LogoutButton />
            </div>

            {cdpAuthError && (
              <div className="error-message">
                <strong>CDP Authentication Error:</strong> {cdpAuthError}
                <br />
                <button onClick={() => window.location.reload()} style={{ marginTop: "0.5rem" }}>
                  Retry
                </button>
              </div>
            )}

            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === "auth0" ? <Auth0Tab /> : <CDPTab />}
          </div>
        )}
      </div>
    </div>
  );
};
