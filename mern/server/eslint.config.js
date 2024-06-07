import pluginJs from "@eslint/js";

export default [
  {
    ignorePatterns: ['logs', 'eslint.config.js'],
    env: {
      node: true,
      es2021: true,
    },
    parserOptions: {
      ecmaVersion: 12,
      sourceType: "module"
    },
    plugins: [
      "eslint",
      "import",
    ],
    extends: [
      "eslint:recommended",
      "plugin:import/errors", 
      "plugin:import/warnings",
      pluginJs.configs.recommended
    ],
    rules: {
      // Best Practices
      "eqeqeq": ["error", "always"],
      "no-multi-spaces": "error",

      // Variables
      "no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],

      // Stylistic Issues
      "indent": ["error", 2],
      "quotes": ["error", "single"],  // always use single quotes
      "semi": ["error", "always"],  // always use semicolons
      "no-multiple-empty-lines": ["error", { "max": 1 }],  // at most 2 consecutive blank row
      "padding-line-between-statements": [
        "error",
        { "blankLine": "always", "prev": "import", "next": "*", "ignoreConsecutive": true },  // 1 blank row after import
        { "blankLine": "always", "prev": "*", "next": "export", "ignoreConsecutive": true }   // 1 blank row before export
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