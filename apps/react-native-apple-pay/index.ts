import structuredClone from "@ungap/structured-clone";
import { registerRootComponent } from "expo";
import { install } from "react-native-quick-crypto";
import "react-native-get-random-values";
import { Buffer } from "buffer";

if (!("structuredClone" in globalThis)) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.structuredClone = structuredClone as any;
}

// Setup Buffer global for Solana Web3.js compatibility
if (!("Buffer" in globalThis)) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.Buffer = Buffer as any;
}

install();

import App from "./App";

/*
 * registerRootComponent calls AppRegistry.registerComponent('main', () => App);
 * It also ensures that whether you load the app in Expo Go or in a native build,
 * the environment is set up appropriately
 */
registerRootComponent(App);
