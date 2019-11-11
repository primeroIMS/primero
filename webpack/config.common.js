const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { OUTPUT_DIR, CLIENT_APPLICATION } = require("./config");

const svgPrefix = {
  toString: () =>
    `${Math.random()
      .toString(36)
      .substring(2, 8)}_`
};

const entry = {
  application: [CLIENT_APPLICATION]
};

const output = {
  path: OUTPUT_DIR,
  filename: "[name].[hash].js",
  chunkFilename: "[name].[chunkhash].js",
  publicPath: "/"
};

const resolve = {
  extensions: ["*", ".jsx", ".js"],
};

const plugins = [new CleanWebpackPlugin()];

const optimization = {
  splitChunks: {
    cacheGroups: {
      commons: {
        test: /[\\/]node_modules[\\/]/,
        name: "vendor",
        chunks: "all"
      }
    }
  }
};

const rules = [
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: {
      loader: require.resolve("babel-loader")
    }
  },
  {
    test: /\.css$/,
    use: [
      {
        loader: "css-to-mui-loader"
      },
      {
        loader: "postcss-loader",
        options: {
          config: {
            path: path.resolve(__dirname, "..", "postcss.config.js")
          }
        }
      }
    ]
  },
  {
    test: /\.svg$/,
    loader: "react-svg-loader",
    options: {
      jsx: true,
      svgo: {
        plugins: [{ cleanupIDs: { prefix: svgPrefix } }]
      }
    }
  }
];

module.exports = {
  entry,
  output,
  resolve,
  plugins,
  module: { rules },
  optimization
};
