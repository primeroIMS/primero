const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { OUTPUT_DIR, CLIENT_APPLICATION, ID_APPLICATION } = require("./config");
const { InjectManifest } = require("workbox-webpack-plugin");

const svgPrefix = {
  toString: () =>
    `${Math.random()
      .toString(36)
      .substring(2, 8)}_`
};

const entry = {
  application: [CLIENT_APPLICATION],
  identity: [ID_APPLICATION]
};

const output = {
  path: OUTPUT_DIR,
  filename: "[name].[hash].js",
  chunkFilename: "[name].[chunkhash].js",
  publicPath: "/"
};

const resolve = {
  extensions: ["*", ".jsx", ".js"],
  alias: {
    "@material-ui/styles": path.resolve("node_modules", "@material-ui/styles")
  }
};

const plugins = [
  new CleanWebpackPlugin(),
  // new WebpackPwaManifest(PWA_MANIFEST_CONFIG),
  new InjectManifest({
    swSrc: path.join(__dirname, "..", "app/javascript/worker.js"),
    swDest: path.join(__dirname, "..", "public/worker.js")
  })
];

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
