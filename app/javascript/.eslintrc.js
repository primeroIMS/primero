const path = require('path');

module.exports = {
  extends: ["airbnb", "prettier", "prettier/react"],
  plugins: ["react", "prettier"],
  rules: {
    "react/jsx-filename-extension": [
      1,
      {
        "extensions": [".js", "jsx"]
      }
    ],
    "prettier/prettier": "error",
    "max-len": ["error", 100],
    "react/require-default-props": "off",
    "react/forbid-prop-types": "off",
    "import/prefer-default-export": "off",
    "no-underscore-dangle": "off"
  },
  env: {
    "browser": true
  },
  settings: {
    "import/resolver": {
      alias: {
        map: [
          ["libs", path.resolve(__dirname, "libs")],
          ["config", path.resolve(__dirname, "config")],
          ["components", path.resolve(__dirname, "components")]
        ],
        extensions: [".js", ".jsx"]
      }
    }
  }
}
