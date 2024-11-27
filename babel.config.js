module.exports = {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
        [
            'react-native-worklets-core/plugin',
            { globals: ['__detectObjects'] }
        ],
        [
            'react-native-reanimated/plugin',
            { globals: ['__detectObjects'] }
        ],
    ],
};