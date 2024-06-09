import pluginJs from "@eslint/js";
import globals from "globals";
import pluginImport from "eslint-plugin-import";

export default [
  {
    ignores: ["logs", "eslint.config.js", "node_modules"]
  },
  pluginJs.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        process: "writable",
        __dirname: "writable",  // readonly?
      },
    },
    plugins: {
      "import": pluginImport,
    },
    rules: {
      // Import
      "import/no-unresolved": "error",
      "import/named": "error",
      "import/no-named-export": "error",
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
      
      // Variables
      "no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
      "eqeqeq": ["error", "always"],

      // Stylistic Issues
      "indent": ["error", 2],
      "quotes": ["error", "single"],  // always use single quotes
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
    }
  },
];