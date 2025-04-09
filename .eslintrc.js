// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

const developmentEnv = process.env.NODE_ENV === "development";

module.exports = {
  parser: "@babel/eslint-parser",
  extends: ["airbnb", "prettier"],
  plugins: ["react", "prettier", "react-hooks", "import", "unused-imports", "jest"],
  rules: {
    "react/jsx-uses-react": "off",
    "unused-imports/no-unused-imports": "error",
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": [
      1,
      {
        extensions: [".js", "jsx"]
      }
    ],
    "id-length": ["error", { min: 1 }],
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
    "react/sort-default-props": [
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
    "import/no-extraneous-dependencies": "off",
    "default-param-last": "off",
    "arrow-body-style": "off",
    "react/function-component-definition": [2, { namedComponents: "function-declaration" }],
    "no-restricted-exports": "off",
    "no-import-assign": "off",
    "react/jsx-no-useless-fragment": "off",
    "react/jsx-no-constructed-context-values": "off",
    "no-constructor-return": "off",
    "react/destructuring-assignment": "off",
    "react/no-unstable-nested-components": "off",
    "no-unsafe-optional-chaining": "off",
    "no-promise-executor-return": "off",
    "import/no-unresolved": [2, { ignore: ["test-utils"] }]
  },
  env: {
    browser: true,
    "jest/globals": true
  },
  overrides: [
    {
      files: ["*.unit.test.js", "*.spec.js"],

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
