import { User } from "@coinbase/cdp-core";
import { AuthButton } from "@coinbase/cdp-react";

interface AuthSectionProps {
  user: User | null;
}

/**
 * Authentication section component that handles CDP sign in/out functionality.
 *
 * @param root0 - The component props
 * @param root0.user - The current authenticated user from CDP, if any
 * @returns The authentication section component
 */
export default function AuthSection({ user }: AuthSectionProps) {
  return (
    <div className="card">
      <h2>🔐 Authentication</h2>

      {!user ? (
        <div>
          <p>Sign in to access your embedded Solana wallet</p>
          <AuthButton />
        </div>
      ) : (
        <div>
          <div className="status connected">
            ✅ Signed in as: {user.solanaAccounts?.[0] || "No Solana account"}
          </div>
          <AuthButton />
        </div>
      )}
    </div>
  );
}
