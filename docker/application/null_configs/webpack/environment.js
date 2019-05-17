const { environment } = require("@rails/webpacker");
const path = require("path");

environment.loaders.append("eslint", {
  test: /\.(js|jsx)$/,
  use: [
    {
      loader: "eslint-loader",
      options: {
        eslint: {
          emitError: false,
          failOnError: process.env.NODE_ENV !== "production",
          cache: false,
          configFile: path.resolve(__dirname, "app/javascript/.eslintrc.json")
        }
      }
    }
  ]
});

environment.splitChunks(config =>
  Object.assign({}, config, {
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "initial"
          }
        }
      }
    }
  })
);

// Don't compile es6 code in /node_modules/
environment.loaders.delete("nodeModules");

module.exports = environment;
