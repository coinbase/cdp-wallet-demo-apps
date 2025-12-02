import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";

import { Profile } from "../Profile";

/**
 * Tab component that displays Auth0 user information, JWT claims, and access token
 *
 * @returns The Auth0 information tab component
 */
export const Auth0Tab = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [tokenClaims, setTokenClaims] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        setAccessToken(token);

        // Decode JWT to get claims
        const payload = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(payload));
        setTokenClaims(decodedPayload);
      } catch (error) {
        console.error("Error getting access token:", error);
      }
    };

    getToken();
  }, [getAccessTokenSilently]);

  return (
    <div className="tab-content">
      <Profile />

      <div className="details-grid">
        <div className="user-details">
          <h3>User Object</h3>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>

        <div className="user-details">
          <h3>JWT Claims</h3>
          {tokenClaims ? (
            <pre>{JSON.stringify(tokenClaims, null, 2)}</pre>
          ) : (
            <p>Loading token claims...</p>
          )}
        </div>
      </div>

      {accessToken && (
        <div className="user-details token-display">
          <h3>Access Token (JWT)</h3>
          <pre className="token-text">{accessToken}</pre>
        </div>
      )}
    </div>
  );
};
