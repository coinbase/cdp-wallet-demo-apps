import type { Config } from "@coinbase/cdp-hooks";
import { createCDPEmbeddedWalletConnector } from "@coinbase/cdp-wagmi";
import { createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { QueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { deserialize, serialize } from "wagmi";

export const cdpConfig: Config = {
  projectId: process.env.EXPO_PUBLIC_CDP_PROJECT_ID,
  ethereum: {
    createOnLogin: "smart",
  },
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
  multiInjectedProviderDiscovery: false,
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1_000 * 60 * 60 * 24, // 24 hours
    },
  },
}); // For use with react-query

export const persister = createAsyncStoragePersister({
  serialize,
  storage: AsyncStorage,
  deserialize,
});
