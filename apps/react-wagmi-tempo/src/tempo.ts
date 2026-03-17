import { createPublicClient, http } from "viem";
import { tempoModerato } from "viem/chains";

export { tempoModerato };

/**
 * Viem public client configured for the Tempo Moderato testnet.
 * Used to read chain state (balances, nonces, fees) and broadcast signed transactions.
 */
export const tempoClient = createPublicClient({
  chain: tempoModerato,
  transport: http(),
});

/**
 * Address of the Tempo faucet contract.
 * Used as the recipient for demo transfers so the transaction has a visible effect on balances.
 */
export const FAUCET_ADDRESS = "0x5bc1473610754a5ca10749552b119df90c1a1877" as const;
