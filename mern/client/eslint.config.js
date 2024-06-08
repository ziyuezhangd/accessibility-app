import pluginJs from "@eslint/js";

export default [
  {
    ignorePatterns: ['dist', 'eslint.config.js', 'node_modules'],
    env: {
      browser: true,
      es2021: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 12,
      sourceType: "module",
      ecmaFeatures: { jsx: true },
    }, 
    plugins: [
      "react",
      "react-hooks",
      "import",
      "jsx-a11y",
    ],
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:import/errors",
      "plugin:import/warnings",
      "plugin:jsx-a11y/recommended",
      "airbnb",
      "plugin:@typescript-eslint/recommended",
      pluginJs.configs.recommended,
    ],
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
        alias: {
          map: [["@", "./src"]],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      // Best Practices
      "eqeqeq": ["error", "always"],
      "no-multi-spaces": "error",

      // Variables
      "no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],

      // Stylistic Issues
      "indent": ["error", 2],
      "quotes": ["error", "single"], // always use single quotes
      "semi": ["error", "always"], // always use semicolons
      "no-multiple-empty-lines": ["error", { "max": 1 }], // at most 1 consecutive blank row
      "padding-line-between-statements": [
        "error",
        { "blankLine": "always", "prev": "import", "next": "*", "ignoreConsecutive": true }, // 1 blank row after import
        { "blankLine": "always", "prev": "*", "next": "export", "ignoreConsecutive": true }, // 1 blank row before export
      ],

      // React
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      'react-refresh/only-export-components': ["warn", { allowConstantExport: true }],

      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Accessibility
      'jsx-a11y/anchor-is-valid': 'warn',

      // ES6
      "prefer-const": ["error", {
        "destructuring": "all",
        "ignoreReadBeforeAssign": true,
      }],
      "arrow-spacing": ["error", { "before": true, "after": true }],
    },
  }
];
