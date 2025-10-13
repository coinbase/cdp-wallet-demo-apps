# CDP Standard Solana Wallet Example - Usage Guide

## 🚀 Quick Start

1. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env and set your CDP project ID
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start the development server**:
   ```bash
   pnpm dev
   ```

4. **Open your browser**: Navigate to `http://localhost:3000`

## 📱 How to Use the Example

### Step 1: Authentication
- Click "Sign In with CDP" to authenticate with your CDP account
- You'll go through the email/SMS verification process
- Once authenticated, you'll see your user information

### Step 2: Wallet Overview
- The **CDP Wallet Section** shows your embedded Solana wallet details
- You'll see:
  - Wallet name, version, and supported chains
  - Your Solana account addresses
  - Supported wallet standard features

### Step 3: Test Signing Operations
- **Sign Message**: Signs a "Hello" message with your wallet
- **Sign Transaction**: Creates and signs a test Solana transfer transaction
- **Sign & Send Transaction**: Creates, signs, and submits a transaction to Solana devnet
- **Connect/Disconnect**: Test wallet standard connection flow

### Step 4: Wallet Standard Integration
- The **Wallet Standard Section** shows all wallets detected through the standard
- You'll see your CDP wallet listed alongside any other installed wallets
- The integration test verifies all components are working correctly

## 🔍 What You'll Learn

### CDP Standard Solana Wallet Hook
```tsx
import { useCdpSolanaStandardWallet } from '@coinbase/cdp-solana-standard-wallet'

function MyComponent() {
  const { ready, wallet } = useCdpSolanaStandardWallet()

  if (ready && wallet) {
    // Use the wallet for signing operations
    const result = await wallet.features['solana:signMessage'].signMessage({
      account: wallet.accounts[0],
      message: new TextEncoder().encode('Hello!')
    })
  }
}
```

### Wallet Standard Discovery
```tsx
import { useSolanaStandardWallets } from '@coinbase/cdp-solana-standard-wallet'

function WalletList() {
  const { wallets } = useSolanaStandardWallets()

  return (
    <div>
      {wallets.map(wallet => (
        <div key={wallet.name}>
          {wallet.name} {wallet.features['cdp:'] ? '(CDP)' : ''}
        </div>
      ))}
    </div>
  )
}
```

### Authentication State
```tsx
import { useCurrentUser } from '@coinbase/cdp-hooks'

function AuthStatus() {
  const { currentUser } = useCurrentUser()

  return (
    <div>
      {currentUser ? `Signed in as ${currentUser.username}` : 'Not signed in'}
    </div>
  )
}
```

## 🛠️ Key Features Demonstrated

1. **Wallet Registration**: How CDP wallet automatically registers with the wallet standard
2. **Account Discovery**: How dapps can discover and use CDP embedded accounts
3. **Signing Operations**: All three Solana signing methods (message, transaction, sign+send)
4. **Error Handling**: Proper error handling for authentication and signing failures
5. **Real-time Updates**: How wallet state updates when authentication changes
6. **Multi-wallet Support**: How CDP wallet coexists with other wallets in the ecosystem

## 🔧 Configuration

The example uses the CDP React Provider with Solana configuration:

```tsx
import { CDPReactProvider } from '@coinbase/cdp-react'

const config = {
  projectId: process.env.VITE_CDP_PROJECT_ID,
  solana: {
    createOnLogin: true  // Automatically create Solana account on login
  }
}

<CDPReactProvider config={config}>
  <App />
</CDPReactProvider>
```

## 🎯 Integration Points

This example shows how to integrate CDP wallets into existing Solana dApps:

1. **Replace wallet selection UI**: CDP wallet appears in standard wallet lists
2. **Use standard interfaces**: All signing operations use wallet standard methods
3. **Seamless UX**: Users get embedded wallets without browser extension setup
4. **Developer friendly**: Same API as other Solana wallets

## 🐛 Troubleshooting

- **"No wallets detected"**: Make sure you're signed in to CDP first
- **Signing failures**: Check you have sufficient SOL for fees (devnet transactions)
- **Connection issues**: Verify your CDP project ID is configured correctly
- **Build errors**: Ensure all workspace dependencies are properly installed

## 🚀 Next Steps

- Integrate into your existing Solana dApp
- Customize the UI to match your application
- Add additional wallet standard features
- Deploy to production with your CDP project credentials