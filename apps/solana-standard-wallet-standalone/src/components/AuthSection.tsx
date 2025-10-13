import { User, signInWithEmail, signOut, verifyEmailOTP } from "@coinbase/cdp-core";
import { useState } from "react";

interface AuthSectionProps {
  user: User | null;
}

/**
 * Authentication section component that handles CDP sign in/out functionality
 * using CDP core API directly (no hooks, no providers).
 *
 * @param root0 - The component props
 * @param root0.user - The current authenticated user from CDP, if any
 * @returns The authentication section component
 */
export default function AuthSection({ user }: AuthSectionProps) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [flowId, setFlowId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsOtp, setNeedsOtp] = useState(false);

  const handleSignIn = async () => {
    if (!email) {
      setError("Please enter an email address");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await signInWithEmail({ email });
      setFlowId(result.flowId);
      setNeedsOtp(true);
    } catch (err) {
      setError(`Sign in failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !flowId) {
      setError("Please enter the OTP code");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await verifyEmailOTP({ flowId, otp });
      // User state will be updated via onAuthStateChange
      setNeedsOtp(false);
      setOtp("");
      setEmail("");
    } catch (err) {
      setError(`OTP verification failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signOut();
      // User state will be updated via onAuthStateChange
    } catch (err) {
      setError(`Sign out failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>🔐 Authentication</h2>

      {!user ? (
        <div>
          <p>Sign in to access your embedded Solana wallet</p>

          {!needsOtp ? (
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="button"
                style={{ marginRight: "0.5em", width: "200px" }}
                disabled={isLoading}
              />
              <button
                className="button primary"
                onClick={handleSignIn}
                disabled={isLoading || !email}
              >
                {isLoading ? "Signing in..." : "Sign In with Email"}
              </button>
            </div>
          ) : (
            <div>
              <p>Please check your email for the OTP code:</p>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP code"
                className="button"
                style={{ marginRight: "0.5em", width: "150px" }}
                disabled={isLoading}
              />
              <button
                className="button primary"
                onClick={handleVerifyOtp}
                disabled={isLoading || !otp}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                className="button secondary"
                onClick={() => {
                  setNeedsOtp(false);
                  setOtp("");
                  setFlowId("");
                }}
                style={{ marginLeft: "0.5em" }}
              >
                Back to Email
              </button>
            </div>
          )}

          {error && <div className="error">{error}</div>}

          <div style={{ marginTop: "1em", fontSize: "0.9em", opacity: 0.7 }}>
            <strong>Note:</strong> This standalone example uses CDP core API directly,
            without hooks or providers. Authentication is handled via email OTP.
          </div>
        </div>
      ) : (
        <div>
          <div className="status connected">
            ✅ Signed in as: {user.solanaAccounts?.[0] || user.userId}
          </div>
          <button
            className="button secondary"
            onClick={handleSignOut}
            disabled={isLoading}
          >
            {isLoading ? "Signing out..." : "Sign Out"}
          </button>
          {error && <div className="error">{error}</div>}
        </div>
      )}
    </div>
  );
}