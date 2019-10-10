// Packages
const path = require("path");
const { join } = require("path");
const { readdirSync } = require("fs");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const CleanWebpackPlugin = require("clean-webpack-plugin");
const PnpWebpackPlugin = require(`pnp-webpack-plugin`);
const ManifestPlugin = require('webpack-manifest-plugin')
// Constants
const APP_DIR = path.resolve(__dirname, "app", "javascript");
const OUTPUT_DIRNAME = "packs";
const PORT = 9000;

// ENV
const isDevelopment = process.env.NODE_ENV !== "production";

// Packages going into vendor bundle
const vendorDependencies = [
  "react",
  "react-dom",
  "redux",
  "@rematch/core",
  "prop-types",
  "react-router-dom",
  "lodash",
  "immutable",
  "history",
  "connected-react-router",
  "@material-ui/core",
  "@material-ui/styles",
  "yup",
  "axios",
  "react-share",
  "react-time-ago"
];

// Helper functions
const generateAliases = () => {
  const isDirectory = src => !path.basename(src).match(/^index.(js|jsx)$/);
  const aliases = readdirSync(APP_DIR)
    .map(name => join(APP_DIR, name))
    .filter(isDirectory)
    .map(dir => ({ [path.basename(dir, ".js")]: dir }));

  return Object.assign({}, ...aliases, {
    "@material-ui/styles": require.resolve("@material-ui/styles")
  });
};

// Entry
const entry = [
  path.resolve(APP_DIR, "packs", "application.jsx")
];

// Output
const output = {
  path: path.resolve(__dirname, OUTPUT_DIRNAME),
  filename: "[name].js",
  publicPath: "/"
};

// Resolve
const resolve = {
  extensions: ["*", ".jsx", ".js"],
  plugins: [PnpWebpackPlugin],
  alias: Object.assign({}, generateAliases(), {
    "react-dom": "@hot-loader/react-dom"
  })
};

// Resolve Loader
const resolveLoader = {
  plugins: [PnpWebpackPlugin.moduleLoader(module)]
};

// Dev server config
const devServer = {
  contentBase: path.resolve(__dirname, "public", OUTPUT_DIRNAME),
  compress: true,
  port: PORT,
  historyApiFallback: true,
  stats: "minimal",
  hot: true
};

// Plugins
const plugins = [
  new ManifestPlugin()
  // new CleanWebpackPlugin([OUTPUT_DIRNAME]),
  // new MiniCssExtractPlugin({
  //   filename: "[name].[contenthash:8].css",
  //   chunkFilename: "[name].[contenthash:8].chunk.css"
  // })
];

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
        loader: isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader
      },
      {
        loader: "css-loader",
        options: {
          modules: true,
          importLoaders: 1,
          getLocalIdent: (context, localIdentName, localName) => {
            if (context.resourcePath.match(/global/)) {
              return localName;
            }

            return generateScopedName(localName, context.resourcePath);
          }
        }
      },
      {
        loader: "postcss-loader",
        options: {
          config: {
            path: path.resolve(__dirname, "config", "postcss.config.js")
          }
        }
      }
    ]
  },
  {
    test: /\.(png|svg|jpg|jpeg|gif)$/,
    use: [
      {
        loader: require.resolve("file-loader"),
        options: {
          outputPath: "images"
        }
      }
    ]
  }
];

const optimization = {
  splitChunks: {
    cacheGroups: {
      commons: {
        test: /[\\/]node_modules[\\/]/,
        name: "vendors",
        chunks: "all"
      }
    }
  }
};

module.exports = {
  devtool: isDevelopment ? "source-map" : "none",
  entry,
  output,
  resolve,
  resolveLoader,
  optimization,
  module: { rules },
  plugins,
  devServer
};
