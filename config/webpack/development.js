process.env.NODE_ENV = process.env.NODE_ENV || "development";

const environment = require("./environment");
const path = require("path");

environment.loaders.append("eslint", {
  test: /\.(js|jsx)$/,
  use: [
    {
      loader: "eslint-loader",
      options: {
        eslint: {
          emitError: false,
          failOnError: process.env.NODE_ENV === "production",
          cache: false,
          configFile: path.resolve(
            __dirname,
            "..",
            "..",
            "app/javascript/.eslintrc.js"
          )
        }
      }
    }
  ]
});

environment.config.devtool = 'source-map'

module.exports = environment.toWebpackConfig();
