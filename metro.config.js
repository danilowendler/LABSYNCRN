const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Garantir que assets sejam incluídos corretamente
config.resolver.assetExts.push('png', 'jpg', 'jpeg', 'webp', 'gif', 'svg');

module.exports = config;

