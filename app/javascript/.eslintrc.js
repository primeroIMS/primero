const path = require("path");

const developmentEnv = process.env.NODE_ENV === "development";

module.exports = {
  parser: "babel-eslint",
  extends: ["airbnb", "prettier", "prettier/react"],
  plugins: ["react", "prettier", "react-hooks", "import"],
  rules: {
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
    "react/jsx-sort-default-props": [
      "error",
      {
        ignoreCase: true
      }
    ],
    "react/no-multi-comp": "warn",
    "react/require-default-props": "off",
    "react-hooks/exhaustive-deps": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react/sort-prop-types": "error",
    "import/no-extraneous-dependencies": "off"
  },
  env: {
    browser: true
  },
  overrides: [{
    "files": ["*.unit.test.js"],
    "env": {
      "mocha": true
    },
    "rules": {
      "no-unused-vars": [
        "error",
        {
          "varsIgnorePattern": "should|expect"
        }
      ]
    }
  }]
};
