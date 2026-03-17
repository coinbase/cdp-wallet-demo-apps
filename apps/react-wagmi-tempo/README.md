# CDP Embedded Wallets + Tempo

A demo app showing how to integrate [Tempo](https://tempo.xyz) with [CDP Embedded Wallets](https://docs.cdp.coinbase.com/embedded-wallets/docs/welcome) using React and wagmi.

Tempo is a stablecoin payments blockchain. All value is held in ERC-20 tokens — there is no native token balance. This demo covers the four key integration points below.

## Tempo integration

### 1. Wagmi + CDP config (`src/config.ts`)

Configure the CDP wagmi connector with `tempoModerato` as the chain and set `createOnLogin: "eoa"`. Tempo has its own native account abstraction model and does not support ERC-4337 smart accounts, so EOA is required.

```ts
import { tempoModerato } from "viem/chains";

export const cdpConfig: Config = {
  projectId: "...",
  ethereum: { createOnLogin: "eoa" }, // smart accounts are not supported on Tempo
  authMethods: ["email"],
};

const connector = createCDPEmbeddedWalletConnector({
  cdpConfig,
  providerConfig: {
    chains: [tempoModerato],
    transports: { [tempoModerato.id]: http() },
  },
});
```

### 2. Viem public client (`src/tempo.ts`)

Create a viem `PublicClient` pointed at the Tempo RPC. This client is used for all read operations (balances, nonces, gas estimation) and for broadcasting signed transactions.

```ts
import { createPublicClient, http } from "viem";
import { tempoModerato } from "viem/chains";

export const tempoClient = createPublicClient({
  chain: tempoModerato,
  transport: http(),
});
```

### 3. Reading token balances (`src/Balances.tsx`)

Tempo has no native token. Query balances by calling `balanceOf` on each ERC-20 token contract directly via `tempoClient.readContract`. All Tempo stablecoins use 6 decimals.

```ts
const balance = await tempoClient.readContract({
  address: token.address,
  abi: ERC20_BALANCE_OF_ABI,
  functionName: "balanceOf",
  args: [address],
});
```

### 4. Signing and sending transactions (`src/Transaction.tsx`)

CDP Embedded Wallets sign transactions server-side. Use `useSignEvmTransaction` from `@coinbase/cdp-hooks` to get a signed transaction back from CDP, then broadcast it yourself via `tempoClient.sendRawTransaction`. This two-step approach is necessary because the signer lives in the CDP backend, not in an injected browser wallet.

```ts
const { signedTransaction } = await signEvmTransaction({
  evmAccount: eoaAddress,
  transaction: {
    to: tokenAddress,
    data, // encoded ERC-20 transfer calldata
    chainId: tempoModerato.id,
    type: "eip1559",
    nonce,
    gas: gasLimit,
    maxFeePerGas,
    maxPriorityFeePerGas,
  },
});

const hash = await tempoClient.sendRawTransaction({
  serializedTransaction: signedTransaction as Hex,
});
```

---

## Prerequisites

You will need Node.js v20 or higher and pnpm installed on your machine.

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

3. Fetch your Project ID from [CDP Portal](https://portal.cdp.coinbase.com/) and update `VITE_CDP_PROJECT_ID` in `.env`.

   ```bash
   VITE_CDP_PROJECT_ID='your-project-id-here'
   ```

## Running the app

```bash
pnpm dev
```
