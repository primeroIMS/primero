const developmentEnv = process.env.NODE_ENV === "development";

module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["airbnb", "prettier", "plugin:react/recommended", "plugin:@typescript-eslint/recommended"],
  plugins: ["react", "prettier", "react-hooks", "import", "unused-imports", "@typescript-eslint"],
  rules: {
    // disable these TS rules temporarily to ease the transition
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-this-alias": "off",
    "arrow-body-style": "off",
    "react/no-array-index-key": "off",
    "react/jsx-key": "off",
    "import/no-namespace": "off",
    // <------>

    // assertions make this trigger
    "no-unused-expressions": "off",

    // Some testing uses empty functions; consider replacing with a noop function reference and re-enabling this rule
    "@typescript-eslint/no-empty-function": "off",

    // prefer TypeScript props interfaces
    "react/prop-types": "off",

    // function names contain stack-trace information
    "prefer-arrow-callback": "off",

    "react/jsx-uses-react": "off",
    "unused-imports/no-unused-imports": "error",
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": [
      1,
      {
        extensions: [".js", "jsx", ".ts", ".tsx"]
      }
    ],
    "id-length": ["error", { min: 1 }],
    "import/extensions": [
      "error",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
        json: "always"
      }
    ],
    "import/first": 2,
    "import/exports-last": 2,
    "import/newline-after-import": 2,
    "import/no-duplicates": 2,
    "import/no-namespace": 2,
    "import/no-named-default": 2,
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "parent", "sibling", "index"],
        "newlines-between": "always"
      }
    ],
    "import/prefer-default-export": 1,
    "no-debugger": developmentEnv ? "off" : "error",
    "no-underscore-dangle": "off",
    "no-unexpected-multiline": "off",
    "max-len": ["error", { code: 120 }],
    "padding-line-between-statements": [
      "error",
      { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
      {
        blankLine: "any",
        prev: ["const", "let", "var"],
        next: ["const", "let", "var"]
      },
      { blankLine: "always", prev: "*", next: "return" },
      { blankLine: "always", prev: "directive", next: "*" },
      { blankLine: "any", prev: "directive", next: "directive" }
    ],
    "prettier/prettier": "error",
    "react/display-name": ["error", { ignoreTranspilerName: true }],
    "react/forbid-prop-types": "off",
    "react/jsx-props-no-spreading": "off",
    "react/jsx-sort-default-props": [
      "error",
      {
        ignoreCase: true
      }
    ],
    "react/no-multi-comp": "warn",
    "react/require-default-props": "off",
    "react-hooks/exhaustive-deps": "off",
    "react-hooks/rules-of-hooks": "error",
    "react/sort-prop-types": "error",
    "import/no-extraneous-dependencies": "off"
  },
  env: {
    browser: true
  },
  overrides: [
    {
      files: ["*.unit.test.js"],
      env: {
        mocha: true
      },
      globals: {
        expect: "readonly"
      },
      rules: {
        "import/no-namespace": "off",
        "no-unused-expressions": "off",
        "no-unused-vars": [
          "error",
          {
            varsIgnorePattern: "should|expect"
          }
        ],
        "react/display-name": "off",
        "react/no-multi-comp": "off",
        "react/prop-types": "off"
      }
    },
    {
      files: ["worker.js"],
      globals: {
        workbox: "readonly"
      }
    }
  ]
};