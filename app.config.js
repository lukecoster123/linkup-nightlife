module.exports = ({ config }) => {
  const nativePlugins =
    process.env.EXPO_PLATFORM === 'native'
      ? [['expo-dev-client', { launchMode: 'most-recent' }], 'react-native-maps']
      : [];

  return {
    ...config,
    name: 'Sparkline',
    slug: 'sparkline',
    newArchEnabled: true,
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    scheme: 'sparkline',
    runtimeVersion: {
      policy: 'appVersion',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      supportsTablet: true,
      bundleIdentifier: 'me.bilt.sparkline',
    },
    android: {
      package: 'me.bilt.sparkline',
    },
    plugins: ['expo-router', 'expo-font', ...nativePlugins],
    experiments: {
      typedRoutes: false,
    },
  };
};
