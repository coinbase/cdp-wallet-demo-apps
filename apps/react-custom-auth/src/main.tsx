import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { CDPHooksProvider, Config } from "@coinbase/cdp-hooks";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { App } from "./App";

// Build config dynamically based on environment variables
const ethereumAccountType = import.meta.env.VITE_CDP_CREATE_ETHEREUM_ACCOUNT_TYPE
  ? import.meta.env.VITE_CDP_CREATE_ETHEREUM_ACCOUNT_TYPE === "smart"
    ? "smart"
    : "eoa"
  : undefined;

const shouldCreateSolanaAccount = import.meta.env.VITE_CDP_CREATE_SOLANA_ACCOUNT === "true";

const CDPWrapper = ({ children }: { children: React.ReactNode }) => {
  const { getAccessTokenSilently } = useAuth0();

  // Build ethereum config based on account type
  const ethereumConfig = ethereumAccountType
    ? ethereumAccountType === "smart"
      ? { createOnLogin: "smart" as const, enableSpendPermissions: false }
      : { createOnLogin: "eoa" as const }
    : undefined;

  const config = {
    projectId: import.meta.env.VITE_CDP_PROJECT_ID,
    basePath: import.meta.env.VITE_CDP_BASE_PATH,
    customAuth: {
      getJwt: getAccessTokenSilently,
    },
    ...(ethereumConfig && { ethereum: ethereumConfig }),
    ...(shouldCreateSolanaAccount && {
      solana: {
        createOnLogin: true,
      },
    }),
  } as Config;

  return <CDPHooksProvider config={config}>{children}</CDPHooksProvider>;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      cacheLocation="localstorage"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: "openid profile email",
      }}
    >
      <CDPWrapper>
        <App />
      </CDPWrapper>
    </Auth0Provider>
  </StrictMode>,
);
