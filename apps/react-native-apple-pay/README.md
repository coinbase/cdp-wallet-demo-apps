# React Native Expo Example

A React Native Expo example demonstrating CDP Embedded Wallet SDK integration with React Native hooks.

## Prerequisites

- Node.js 20+ and pnpm.
- For iOS: Xcode and iOS Simulator.
- For Android: Android Studio and Android emulator.

## Setup

### Setting up Simulators

#### iOS Simulator

1. Install [Xcode](https://developer.apple.com/xcode/).
2. On initial load, Xcode will ask which platforms you want to install. Select the iOS platform.
    - a. If you missed it on initial load, then open Xcode → Preferences → Components.
    - b. Install the iOS simulator version you want to test
3. Expo will automatically start the simulator when you run the app.

#### Android Emulator

1. Install Android Studio.
2. Open Android Studio → AVD Manager.
3. Create a new virtual device:
   - Choose a device definition (e.g., Pixel 7).
   - Select a system image (API level 30+).
   - Configure settings and finish.
4. Expo will automatically start the emulator when you run the app.

### Setting up the app

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

3. Fill in your CDP API credentials in `.env`.

## Running the App

**iOS:**
```bash
pnpm run ios
```

**Android:**
```bash
pnpm run android
```
