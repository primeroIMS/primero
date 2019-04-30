const { environment } = require("@rails/webpacker");
const path = require("path");

module.exports = {
  resolve: {
    alias: {
      components: path.resolve(
        __dirname,
        "..",
        "..",
        "app/javascript/components"
      )
    }
  }
};

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
