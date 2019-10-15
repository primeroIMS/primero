const path = require("path");

const developmentEnv = process.env.NODE_ENV === "development";

module.exports = {
  parser: "babel-eslint",
  extends: ["airbnb", "prettier", "prettier/react"],
  plugins: ["react", "prettier", "react-hooks"],
  rules: {
    "react/jsx-filename-extension": [
      1,
      {
        extensions: [".js", "jsx"]
      }
    ],
    "prettier/prettier": "error",
    "max-len": ["error", 100],
    "react/require-default-props": "off",
    "react/forbid-prop-types": "off",
    "import/prefer-default-export": "off",
    "no-underscore-dangle": "off",
    "no-debugger": developmentEnv ? "off" : "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
  env: {
    browser: true
  },
  settings: {
    "import/resolver": {
      alias: {
        map: [
          ["libs", path.resolve(__dirname, "libs")],
          ["config", path.resolve(__dirname, "config")],
          ["db", path.resolve(__dirname, "db")],
          ["components", path.resolve(__dirname, "components")],
          ["middleware", path.resolve(__dirname, "middleware")],
          ["images", path.resolve(__dirname, "images")],
          ["test", path.resolve(__dirname, "test")]
        ],
        extensions: [".js", ".jsx"]
      }
    }
  }
};
