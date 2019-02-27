const { environment } = require("@rails/webpacker");

environment.loaders.prepend("eslint", {
  test: /\.(js|jsx)$/,
  use: [{ 
    loader: "eslint-loader",
    options: {
      emitError: false
    }
  }]
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
