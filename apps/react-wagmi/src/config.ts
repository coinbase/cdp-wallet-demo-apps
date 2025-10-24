import { type Config } from "@coinbase/cdp-react";
import { createCDPEmbeddedWalletConnector } from "@coinbase/cdp-wagmi";
import { QueryClient } from "@tanstack/react-query";
import { createConfig, http } from "wagmi";
import { baseSepolia } from "viem/chains";
import { createPublicClient } from "viem";

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
    chains: [baseSepolia],
    transports: {
      [baseSepolia.id]: http(),
    },
  },
});

export const wagmiConfig = createConfig({
  connectors: [connector],
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});

export const queryClient = new QueryClient();

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});
