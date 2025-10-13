# CDP Standard Solana Wallet Example

This example demonstrates the CDP Standard Solana Wallet integration with the Wallet Standard ecosystem.

## Features

- 🔐 **Authentication**: Sign in with CDP to access embedded Solana accounts
- 💰 **Wallet Management**: View wallet details, accounts, and supported features
- 🖊️ **Signing Operations**: Sign messages, transactions, and send transactions
- 🌐 **Wallet Standard Integration**: Shows how CDP wallet appears in the standard ecosystem

## What This Example Demonstrates

1. **CDP Authentication**: How to authenticate users and access embedded wallets
2. **Hook Usage**: Using `useCdpSolanaStandardWallet` and `useSolanaStandardWallets` hooks
3. **Wallet Standard Compliance**: How CDP wallet integrates with other standard wallets
4. **Signing Operations**: Message signing, transaction signing, and transaction sending
5. **Real-time Updates**: How wallet state updates in response to authentication changes

## Setup

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Configure environment variables**:

   ```bash
   cp .env.example .env
   # Edit .env and set your CDP API key name
   ```

3. **Start the development server**:

   ```bash
   pnpm dev
   ```

4. **Open in browser**: Navigate to `http://localhost:3000`

## Usage Flow

1. **Sign In**: Click "Sign In with CDP" to authenticate
2. **View Wallet**: See your embedded Solana account details
3. **Test Signing**: Try signing messages and transactions
4. **Wallet Standard**: See how your CDP wallet appears alongside other wallets
5. **Integration Test**: Verify all components are working correctly

## Key Components

- **AuthSection**: Handles CDP authentication
- **WalletSection**: Displays CDP wallet details and accounts
- **SigningSection**: Interactive signing operations
- **WalletStandardSection**: Shows wallet standard integration

## Architecture

This example shows how to:

- Integrate CDP embedded wallets with React applications
- Use the wallet standard to make CDP wallets discoverable
- Implement signing workflows compatible with existing Solana dApps
- Provide a seamless user experience across different wallet types

## Development

The example is built with:

- **React 18** for the UI
- **TypeScript** for type safety
- **Vite** for fast development
- **CDP Core** for authentication and wallet access
- **CDP Standard Solana Wallet** for wallet standard integration
- **Solana Web3.js** for transaction creation

## Troubleshooting

- **No wallets detected**: Make sure you're signed in to CDP
- **Signing failures**: Check that you have sufficient SOL for transaction fees (on devnet)
- **Connection issues**: Verify your CDP API key configuration
