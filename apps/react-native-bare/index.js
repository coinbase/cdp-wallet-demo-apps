import structuredClone from '@ungap/structured-clone';
import { install } from 'react-native-quick-crypto';
import 'react-native-get-random-values';
import 'text-encoding';
import 'react-native-url-polyfill/auto';

// eslint-disable-next-line no-undef
if (!('structuredClone' in globalThis)) {
  // eslint-disable-next-line no-undef
  globalThis.structuredClone = structuredClone;
}

install();
/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
