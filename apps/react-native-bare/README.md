# React Native Bare Example

This repo demonstrates how to use the CDP Embedded Wallet SDK in a bare React Native app.

## Setting up the app

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

3. Fetch your Project ID from [CDP Portal](https://portal.cdp.coinbase.com/) and update `CDP_PROJECT_ID` in `.env`.

   ```bash
   CDP_PROJECT_ID='your-project-id-here'
   ```

## Reproduction Steps

These were the steps taken to initialize this project and get it working:

1. Initialized the project.

```sh
npx @react-native-community/cli@latest init reactnativebare
```

2. Opened the project in Xcode and setup code signing to run on-device.

```sh
xed ios
```

3. Followed [Install Expo modules in an existing React Native project](https://docs.expo.dev/bare/installing-expo-modules/#automatic-installation) to setup the project to work with Expo modules.

   a. Installed Expo CLI.

   ```sh
   npx install-expo-modules@latest
   ```

   Then selected 'Y' to install Expo CLI.

   b. NOTE: This simply sets the project up to work with Expo packages, but it does not use Expo to manage the React Native project. The CDP SDK has a peer dependency on `expo-secure-store`.

4. Installed NPM dependencies:

```sh
npm install @coinbase/cdp-hooks react-native-quick-crypto react-native-get-random-values react-native-url-polyfill @react-native-async-storage/async-storage @ungap/structured-clone text-encoding viem
```

5. Installed Expo dependencies:

```sh
npx expo install expo-secure-store@^15 expo-clipboard
```

NOTE: `expo-clipboard` is just used in the application, it is not strictly necessary for the CDP SDK to work.

6. Added the polyfills in `index.js`:

```js
import structuredClone from "@ungap/structured-clone";
import { install } from "react-native-quick-crypto";
import "react-native-get-random-values";
import "text-encoding";
import "react-native-url-polyfill/auto";

// eslint-disable-next-line no-undef
if (!("structuredClone" in globalThis)) {
  // eslint-disable-next-line no-undef
  globalThis.structuredClone = structuredClone;
}

install();
```

7. Ensured native dependencies are installed and built.

```sh
cd ios
pod install
```

8. Ran `npm run ios` to build and run the project.

```sh
npm run ios
```

9. At this point, sanity checked that the project still builds and runs.

   a. In one terminal window start the Metro bundler

   ```sh
   npm start
   ```

   b. In another terminal window, build the iOS app.

   ```sh
   npx react-native run-ios
   ```

10. Copied ALL starter code from [CDP React Native Starter](https://github.com/coinbase/demo-react-native-expo).

11. Filled in CDP project id in `App.tsx` (replace `REPLACE_ME` with the project id).

12. At this point the project should build and run, and the user should be able to sign in with email or SMS.
