module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  globals: {
    Vue: 'readonly',
  },
  rules: {
    'linebreak-style': 0,
    'arrow-parens': [2, 'as-needed'],
  },
};
