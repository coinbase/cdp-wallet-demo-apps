import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@coinbase/cdp-react";

/**
 * Button component that triggers Auth0 login with redirect
 *
 * @returns The login button component
 */
export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <Button onClick={() => loginWithRedirect()}>Log In</Button>;
};
