# Solana Standard Wallet - Standalone Example

This example demonstrates Solana wallet integration using the Wallet Standard with CDP core API directly - no hooks, no providers, no wrappers.

## Features

- 🔐 **Real CDP Authentication**: Email + OTP authentication using CDP core API
- 🌐 **Wallet Standard Integration**: Detect and connect to any Wallet Standard-compatible wallets
- 💰 **CDP Wallet Creation**: Create real CDP Solana wallets from authenticated users
- 🖊️ **Full Signing Operations**: Sign messages, transactions, and send transactions
- 🔄 **Real-time Updates**: Auth state changes and wallet detection

## What This Example Demonstrates

1. **CDP Core API**: Direct usage of `initialize`, `signInWithEmail`, `verifyEmailOTP`, `getCurrentUser`, `onAuthStateChange`
2. **Manual Wallet Creation**: Creating `CdpSolanaWallet` instances directly with user's Solana addresses
3. **Real Authentication Flow**: Complete email + OTP authentication without any React wrappers
4. **No Dependencies on Hooks/Providers**: Zero usage of `@coinbase/cdp-react` or `@coinbase/cdp-hooks`
5. **Pure React State Management**: All state managed with `useState` and `useEffect`

## Key Differences from CDP Hooks Example

- ❌ **No CDPReactProvider**: No React context provider wrapper
- ❌ **No CDP Hooks**: No `useCdpSolanaStandardWallet`, `useCurrentUser`, or any hooks
- ❌ **No `@coinbase/cdp-react`**: No AuthButton or other React components
- ❌ **No `@coinbase/cdp-hooks`**: No hook dependencies at all
- ✅ **Direct Core API**: Uses `@coinbase/cdp-core` functions directly
- ✅ **Manual Initialization**: Calls `initialize(config)` manually
- ✅ **Custom Auth UI**: Custom email/OTP input forms instead of AuthButton
- ✅ **Manual Wallet Creation**: Direct `new CdpSolanaWallet(addresses)` instantiation

## Setup

1. **Install dependencies**:

```bash
pnpm install
```

2. **Set up environment**:

```bash
cp .env.example .env
# Edit .env and set your CDP project ID
```

3. Fetch your Project ID from [CDP Portal](https://portal.cdp.coinbase.com/) and update `VITE_CDP_PROJECT_ID` in `.env`

```bash
VITE_CDP_PROJECT_ID='your-project-id-here'
```

4. **Start the development server**:

```bash
pnpm dev
```

5. **Open in browser**: Navigate to `http://localhost:3000`

## Usage Flow

1. **Wallet Detection**: The app automatically detects any installed Wallet Standard-compatible wallets
2. **Select Wallet**: Choose a wallet from the list of available wallets
3. **Inspect Details**: View wallet information, accounts, and supported features
4. **Test Operations**: Try connecting, signing messages, and sending transactions
5. **Multi-wallet Testing**: Switch between different wallets to test compatibility

## Key Components

- **WalletStandardSection**: Displays all detected wallets and allows selection
- **WalletSection**: Shows selected wallet details and accounts
- **SigningSection**: Interactive signing operations and wallet connection controls

## Architecture

This standalone example:

- Uses the Wallet Standard API directly via `@wallet-standard/base`
- Implements wallet detection and registration listeners
- Provides a simple React interface for wallet interaction
- Demonstrates cross-wallet compatibility without vendor lock-in

## Supported Operations

- **Connect/Disconnect**: Basic wallet connection management
- **Message Signing**: Sign arbitrary messages with wallet private keys
- **Transaction Signing**: Sign Solana transactions for later submission
- **Sign & Send**: Sign and immediately broadcast transactions to Solana devnet

## Technology Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast development and building
- **Wallet Standard** - Universal wallet interface
- **Solana Web3.js** - Solana blockchain interaction

## Development Notes

- Transactions are configured for Solana devnet by default
- The example creates minimal transfer transactions (1 lamport) for testing
- All signing operations include proper error handling and loading states
- Wallet selection persists until manually changed

## Troubleshooting

- **No wallets detected**: Install a Wallet Standard-compatible Solana wallet (Phantom, Solflare, etc.)
- **Connection failures**: Ensure the wallet extension is unlocked and accessible
- **Signing errors**: Check that the wallet supports the requested operation
- **Transaction failures**: Verify sufficient SOL balance for transaction fees on devnet

## Compatible Wallets

This example works with any wallet that implements the Wallet Standard, including:

- Phantom
- Solflare
- Backpack
- Glow
- Slope
- And many others

## Extending the Example

You can extend this example by:

- Adding support for additional Solana features (token transfers, NFT operations)
- Implementing custom transaction types
- Adding mainnet support (update RPC endpoints)
- Integrating with DeFi protocols or dApps
- Adding wallet preference persistence
