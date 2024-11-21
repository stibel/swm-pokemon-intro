// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    quotes: ['error', 'single'],
  },
  ignorePatterns: [
    '/android/',
    '/ios/',
    '/scripts/',
    '/node_modules/',
    '/.expo/',
  ],
};
