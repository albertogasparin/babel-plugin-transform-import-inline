'use strict';

module.exports = {
  presets: [['@babel/preset-env'], '@babel/preset-typescript'],
  plugins: [],
  env: {
    test: {
      presets: ['@babel/preset-env', '@babel/preset-typescript'],
      plugins: ['@babel/plugin-transform-runtime'],
    },
  },
};
