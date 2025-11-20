import { useAuth0 } from "@auth0/auth0-react";
import { SignOutButton } from "@coinbase/cdp-react";

/**
 * Button component that triggers Auth0 logout and redirects to the origin
 *
 * @returns The logout button component
 */
export const LogoutButton = () => {
  const { logout } = useAuth0();

  const handleSuccess = () => {
    // Also trigger Auth0 logout after CDP logout succeeds
    logout({ logoutParams: { returnTo: window.location.origin } }).catch((error) => {
      console.error("Auth0 logout failed:", error);
    });
  };

  return <SignOutButton onSuccess={handleSuccess}>Log Out</SignOutButton>;
};
