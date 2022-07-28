module.exports = {
  env: {
    node: true,
    es2020: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "prettier"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "react-hooks"],
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    // quotes: ['error', 'single'],
    quotes: ["off", "single"],
    semi: ["error", "always"],
    "prettier/prettier": "error",
  },
}
