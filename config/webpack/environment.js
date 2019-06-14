const { environment } = require("@rails/webpacker");
const path = require("path");
const _ = require("lodash");

const babelLoader = environment.loaders.get("babel");
const fileLoader = environment.loaders.get("file");
const svgPrefix = {};

svgPrefix.toString = () => `${_.uniqueId()}_`;

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

environment.loaders.get("css").use = [
  {
    loader: "css-to-mui-loader"
  },
  {
    loader: "postcss-loader",
    ident: "postcss",
    options: {
      config: { path: path.resolve(__dirname, "postcss.config.js") }
    }
  }
];

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

environment.loaders.insert(
  "svg",
  {
    test: /\.svg$/,
    use: babelLoader.use.concat([
      {
        loader: "react-svg-loader",
        options: {
          jsx: true,
          svgo: {
            plugins: [{ cleanupIDs: { prefix: svgPrefix } }]
          }
        }
      }
    ])
  },
  { after: "file" }
);

fileLoader.exclude = /\.(svg)$/i;

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
