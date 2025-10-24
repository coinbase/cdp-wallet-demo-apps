# React Native Expo Example with Wagmi

A React Native Expo example demonstrating CDP Embedded Wallet SDK integration with React Native hooks and Wagmi. This app was generated via `pnpm create @coinbase/cdp-app@latest`. See the [CDP React Native Quickstart](https://docs.cdp.coinbase.com/embedded-wallets/react-native/quickstart) for more details.

## Prerequisites

You will need Node.js v20 or higher and pnpm installed on your machine.

This project uses development builds via Expo's [Continuous Native Generation](https://docs.expo.dev/workflow/continuous-native-generation/) feature. To learn how to set up your environment, check out Expo's [environment setup guide](https://docs.expo.dev/get-started/set-up-your-environment/?mode=development-build&buildEnv=local).

> [!NOTE]
>
> The link to the environment setup guide is pre-filled with the correct mode ("Development build") and build environment (disabled "Build with Expo Application Services (EAS)"). Feel free to change the device type / platform but make sure to keep the mode and build environment as-is.

## Setting up the app

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

3. Fetch your Proejct ID from [CDP Portal](https://portal.cdp.coinbase.com/) and update `EXPO_PUBLIC_CDP_PROJECT_ID` in `.env`.

   ```bash
   EXPO_PUBLIC_CDP_PROJECT_ID='your-project-id-here'
   ```

## Running the App

**iOS:**

```bash
# Run on device
pnpm run ios --device

# Or run on simulator
pnpm run ios
```

**Android:**

```bash
# Run on device
pnpm run android --device

# Or run on emulator
pnpm run android
```
