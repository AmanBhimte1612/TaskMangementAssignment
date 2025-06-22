const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// ✅ Fix for Firebase Auth issue
config.resolver.unstable_enablePackageExports = false;

// ✅ Include NativeWind integration
module.exports = withNativeWind(config, { input: './global.css' });
