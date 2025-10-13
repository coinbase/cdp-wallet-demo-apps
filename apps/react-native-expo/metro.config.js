const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.includes("zustand")) {
    const result = require.resolve(moduleName);
    return context.resolveRequest(context, result, platform);
  }

  if (moduleName.includes("rpc-websockets")) {
    const result = require.resolve(moduleName);
    return context.resolveRequest(context, result, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
