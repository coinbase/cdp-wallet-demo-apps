# Auth0 + CDP Developer JWT Test App

A React + TypeScript app for testing **Auth0 authentication** and **CDP Developer-Delegated JWT** integration.

## Purpose

This app demonstrates the authentication flow for integrating Auth0 with Coinbase Developer Platform (CDP) Embedded Wallets using developer-delegated authentication. It shows:

- How to authenticate users with Auth0
- How JWTs are structured (ID tokens vs Access tokens)
- What claims CDP will receive and validate
- The raw JWT access token that will be sent to CDP APIs

## Tech Stack

- **React 19** with TypeScript
- **Vite** - Build tool and dev server
- **Auth0 React SDK** - Authentication
- **React Router** - Routing

## Architecture

### Authentication Flow

1. User logs in via Auth0 (email/password, social, etc.)
2. Auth0 issues:
   - **ID Token** - Contains user profile (name, email, picture)
   - **Access Token** - Contains claims for API authorization
3. Access token is signed with **RS256** and includes custom `audience`
4. CDP will validate the JWT using Auth0's JWKS endpoint

### Key Concepts

**ID Token** - Proves who the user is
- Audience: Your Auth0 Client ID
- Contains: User profile information
- Used for: Displaying user info in your app

**Access Token** - Authorizes API access
- Audience: Your API identifier (e.g., `test-app`)
- Contains: Authorization claims, scopes, user ID (`sub`)
- Used for: Calling protected APIs (like CDP)

**JWKS URL** - Public keys for JWT validation
```
https://{your-auth0-domain}/.well-known/jwks.json
```

## Setup

### 1. Environment Variables

Create `.env` file (copy from `.env.example`):

```bash
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
```

### 2. Configure Auth0

#### Create an Application
1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. **Applications** → **Create Application**
3. Choose **Single Page Application**
4. Configure:
   - **Allowed Callback URLs**: `http://localhost:3000`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`

#### Create an API
1. **Applications** → **APIs** → **Create API**
2. Configure:
   - **Name**: `CDP Test App` (or your choice)
   - **Identifier**: `test-app` (this becomes the `aud` claim)
   - **Signing Algorithm**: **RS256**

This API identifier must match the `audience` in `src/main.tsx`.

#### Enable Skip Consent (Optional)
To avoid the consent screen on every login:
1. Go to your application settings
2. **Advanced Settings** → **OAuth**
3. Enable **"Allow Skipping User Consent"**

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## What the App Shows

### Before Login
- Welcome screen with login button

### After Login
- **User Profile** - Picture, name, email from Auth0
- **User Object** - Full ID token claims (left card)
- **JWT Claims** - Access token claims that CDP will validate (right card)
  - `iss` - Issuer (your Auth0 domain)
  - `sub` - User ID (unique identifier)
  - `exp` - Expiration timestamp
  - `iat` - Issued at timestamp
  - `aud` - Audience (your API identifier, optional)
- **Access Token** - Raw JWT string to send to CDP APIs

## For CDP Integration

When configuring CDP's developer-delegated authentication, you'll need:

**JWKS URL:**
```
https://dev-example.us.auth0.com/.well-known/jwks.json
```

**Expected Claims:**
- `iss`: `https://dev-example.us.auth0.com/`
- `aud`: `test-app` (or your API identifier)
- `sub`: Unique user identifier from Auth0

**Signing Algorithm:** RS256

## Key Files

**`src/main.tsx`** - Auth0 configuration
```typescript
<Auth0Provider
  domain={import.meta.env.VITE_AUTH0_DOMAIN}
  clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
  authorizationParams={{
    redirect_uri: window.location.origin,
    audience: 'test-app',
    scope: 'openid profile email'
  }}
>
```

**`src/App.tsx`** - Fetches and decodes JWT
```typescript
const token = await getAccessTokenSilently()
const payload = token.split('.')[1]
const claims = JSON.parse(atob(payload))
```

## Wallet Configuration

This app supports multiple blockchain wallet types: **Solana**, **EVM EOA**, and **EVM Smart Accounts**.

### Current Configuration

Currently configured for **Solana** wallets (see `src/main.tsx` line 19).

### How to Switch Wallet Types

Edit `src/main.tsx` and update the `CDPHooksProvider` config:

#### For Solana Only
```tsx
<CDPHooksProvider
  config={{
    projectId: import.meta.env.VITE_CDP_PROJECT_ID,
    basePath: import.meta.env.VITE_CDP_BASE_PATH,
    customAuth: {
      getJwt: getAccessTokenSilently
    },
    solana: { createOnLogin: true }
  }}
>
```

#### For EVM EOA (Externally Owned Account)
```tsx
<CDPHooksProvider
  config={{
    projectId: import.meta.env.VITE_CDP_PROJECT_ID,
    basePath: import.meta.env.VITE_CDP_BASE_PATH,
    customAuth: {
      getJwt: getAccessTokenSilently
    },
    ethereum: {
      createOnLogin: 'eoa'
    }
  }}
>
```

#### For EVM Smart Account
```tsx
<CDPHooksProvider
  config={{
    projectId: import.meta.env.VITE_CDP_PROJECT_ID,
    basePath: import.meta.env.VITE_CDP_BASE_PATH,
    customAuth: {
      getJwt: getAccessTokenSilently
    },
    ethereum: {
      createOnLogin: 'smart'
    }
  }}
>
```

#### For Multiple Wallet Types
```tsx
<CDPHooksProvider
  config={{
    projectId: import.meta.env.VITE_CDP_PROJECT_ID,
    basePath: import.meta.env.VITE_CDP_BASE_PATH,
    customAuth: {
      getJwt: getAccessTokenSilently
    },
    ethereum: {
      createOnLogin: 'eoa'  // or 'smart'
    },
    solana: {
      createOnLogin: true
    }
  }}
>
```

### What Changes When You Switch

The app will automatically:
1. Create the appropriate wallet type(s) during authentication
2. Display the correct wallet information cards
3. Show the appropriate wallet action buttons:
   - **Solana**: Sign Message, Sign Transaction, Send Transaction
   - **EVM (EOA/Smart)**: Sign Message, Send Transaction

### Testing Different Configurations

1. Update the config in `src/main.tsx`
2. Restart the dev server: `npm run dev`
3. Log out and log back in with Auth0
4. Click "Authenticate with CDP" to create the new wallet type

### Network Configuration

- **Solana**: Uses `solana-devnet`
- **EVM**: Uses `base-sepolia` testnet

You can modify the network in:
- `src/components/SolanaWalletActions.tsx` (line 103)
- `src/components/EvmWalletActions.tsx` (line 48)

## Resources

- [JWT Specification](https://jwt.io/)
- [CDP Developer Documentation](https://docs.cdp.coinbase.com/)
