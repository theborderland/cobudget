module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    // https://github.com/cobudget/cobudget/issues/602
    //"plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
    "plugin:cypress/recommended",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: ["./ui/tsconfig.json"],
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    // not having to import 'React' in every file to use jsx (next does that)
    "react/react-in-jsx-scope": "off",
    // don't require components to define prop types
    "react/prop-types": "off",
    // don't require components to have a display name
    "react/display-name": "off",
  },
};
