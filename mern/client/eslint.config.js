import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import pluginReactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import pluginImport from 'eslint-plugin-import';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  {
    ignores: ['dist', 'eslint.config.js', 'node_modules']
  },
  pluginJs.configs.recommended,
  pluginReactConfig,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        google: "readonly",
        "import.meta": "readonly",
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
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
    plugins: {
      "import": pluginImport,
      "react-hooks": pluginReactHooks,
      "jsx-a11y": pluginJsxA11y,
      "react-refresh": reactRefresh,
    },
    rules: {
      // Import
      "import/no-unresolved": "error",
      "import/named": "error",
      "import/no-named-export": "warn",
      "import/first": "error",
      "import/order": ["error", {
        groups: [
          "builtin",
          "external",
          "object",
        ],
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      }],

      // Best Practice
      "no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
      "eqeqeq": ["error", "always"],

      // Stylistic Issues
      "indent": ["error", 2],
      "quotes": ["error", "single", { "allowTemplateLiterals": true }],  // always use single quotes
      "semi": ["error", "always"],  // always use semicolons
      "no-multiple-empty-lines": ["error", { "max": 1 }],  // at most 2 consecutive blank row
      "no-multi-spaces": "error",
      "padding-line-between-statements": [
        "error",
        { "blankLine": "always", "prev": "import", "next": "*" },  // 1 blank row after import
        { "blankLine": "never", "prev": "import", "next": "import" },  // no blank row for consecutive import statements
        { "blankLine": "always", "prev": "*", "next": "export" }   // 1 blank row before export
      ],

      // ES6
      "prefer-const": ["error", {
        "destructuring": "all",
        "ignoreReadBeforeAssign": true
      }],
      "arrow-spacing": ["error", { "before": true, "after": true }],

      // React
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      // React Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Accessibility
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/label-has-associated-control": "warn",
      "jsx-a11y/no-autofocus": "warn",
      "jsx-a11y/no-redundant-roles": "warn",
      "jsx-a11y/interactive-supports-focus": "warn",
    },
  },
];