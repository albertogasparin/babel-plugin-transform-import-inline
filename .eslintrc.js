module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: false,
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'latest',
    },
  },
  ignorePatterns: ['**/__fixtures__'],
  plugins: [],
  rules: {},
  overrides: [
    {
      // Enable a jest environment for test files
      files: ['*.test.{js,ts,tsx}'],
      env: {
        jest: true,
      },
    },
  ],
};
