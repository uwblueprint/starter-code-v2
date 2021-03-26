module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    project: "./tsconfig.json",
    createDefaultProgram: true,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  extends: ["airbnb-typescript", "prettier", "plugin:prettier/recommended"],
  // This needs to be added to work on Windows Machines
  rules: {
    "prettier/prettier": ["error", { "endOfLine": "auto" }]
  }
};
