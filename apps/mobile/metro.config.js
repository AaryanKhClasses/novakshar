const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const path = require('path')
const { withNativeWind } = require("nativewind/metro")

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    watchFolders: [path.resolve(__dirname, '..', '..')],
    resolver: {
        nodeModulesPaths: [path.resolve(__dirname, '..', '..', 'node_modules'), path.resolve(__dirname, 'node_modules')],
        extraNodeModules: {
            'react': path.resolve(__dirname, '..', '..', 'node_modules', 'react'),
            'react/jsx-runtime': path.resolve(__dirname, '..', '..', 'node_modules', 'react', 'jsx-runtime.js'),
            'react/jsx-dev-runtime': path.resolve(__dirname, '..', '..', 'node_modules', 'react', 'jsx-dev-runtime.js'),
            'react-native': path.resolve(__dirname, '..', '..', 'node_modules', 'react-native'),
            '@babel/runtime': path.resolve(__dirname, '..', '..', 'node_modules', '@babel', 'runtime'),
            // '@novakshar/core': path.resolve(__dirname, 'packages', 'core'),
        },
    },
}

module.exports = withNativeWind(
    mergeConfig(getDefaultConfig(__dirname), config), {
        input: './index.css'
    }
)
