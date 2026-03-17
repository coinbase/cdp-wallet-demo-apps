export const TOKENS = [
  { symbol: "pathUSD", address: "0x20c0000000000000000000000000000000000000" as const },
  { symbol: "AlphaUSD", address: "0x20c0000000000000000000000000000000000001" as const },
  { symbol: "BetaUSD", address: "0x20c0000000000000000000000000000000000002" as const },
  { symbol: "ThetaUSD", address: "0x20c0000000000000000000000000000000000003" as const },
] as const;

export type Token = (typeof TOKENS)[number];

// All USD tokens on Tempo use 6 decimals.
export const TOKEN_DECIMALS = 6;
