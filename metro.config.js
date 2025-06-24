const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Get Expo's default Metro config
let config = getDefaultConfig(__dirname);

// Add Firebase Auth fix
config.resolver.unstable_enablePackageExports = false;

// Wrap with NativeWind config
config = withNativeWind(config, {
  input: "./global.css",
});

// Export final config
module.exports = config;
