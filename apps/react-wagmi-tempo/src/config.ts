import { type Config } from "@coinbase/cdp-react";
import { createCDPEmbeddedWalletConnector } from "@coinbase/cdp-wagmi";
import { QueryClient } from "@tanstack/react-query";
import { createConfig, http } from "wagmi";
import { tempoModerato } from "viem/chains";

export const cdpConfig: Config = {
  projectId: import.meta.env.VITE_CDP_PROJECT_ID,
  ethereum: {
    createOnLogin: "eoa",
  },
  authMethods: ["email"],
  showCoinbaseFooter: true,
};

const connector = createCDPEmbeddedWalletConnector({
  cdpConfig,
  providerConfig: {
    chains: [tempoModerato],
    transports: {
      [tempoModerato.id]: http(),
    },
  },
});

export const wagmiConfig = createConfig({
  connectors: [connector],
  chains: [tempoModerato],
  transports: {
    [tempoModerato.id]: http(),
  },
});

export const queryClient = new QueryClient();
