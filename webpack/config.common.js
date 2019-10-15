const vendor = require("./vendor");
const path = require("path");
const { generateAliases, generateScopedName } = require("./utils");
const WebpackAssetsManifest = require("webpack-assets-manifest");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const isDevelopment = process.env.NODE_ENV !== "production";

const OUTPUT_DIRNAME = "packs";
const OUTPUT_DIR = path.resolve(__dirname, "../public", OUTPUT_DIRNAME);
const CLIENT_APPLIATION = path.resolve(
  __dirname,
  "../app/javascript/packs/application.jsx"
);

const entry = {
  application: [CLIENT_APPLIATION]
};

const output = {
  path: OUTPUT_DIR,
  filename: "[name].[hash].js",
  chunkFilename: "[name].[chunkhash].js",
  publicPath: "/"
};

const resolve = {
  extensions: ["*", ".jsx", ".js"],
  alias: Object.assign({}, generateAliases(), {
    // "react-dom": "@hot-loader/react-dom"
  })
};

const plugins = [
  // new CleanWebpackPlugin(),
  new WebpackAssetsManifest({
    entrypoints: true,
    publicPath: "http://localhost:9000"
  })
  // new MiniCssExtractPlugin({
  //   filename: "[name].[contenthash:8].css",
  //   chunkFilename: "[name].[contenthash:8].chunk.css"
  // })
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
    test: path.resolve(__dirname, "../app/javascript/i18n/i18n.js"),
    use: "imports-loader?this=>window"
  },
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
      // {
      //   loader: isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader
      // },
      // {
      //   loader: "css-loader",
      //   options: {
      //     modules: true,
      //     importLoaders: 1,
      //     getLocalIdent: (context, localIdentName, localName) => {
      //       if (context.resourcePath.match(/global/)) {
      //         return localName;
      //       }

      //       return generateScopedName(localName, context.resourcePath);
      //     }
      //   }
      // },
      {
        loader: "css-to-mui-loader"
      },
      {
        loader: "postcss-loader",
        options: {
          config: {
            path: path.resolve(__dirname, "../postcss.config.js")
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

module.exports = {
  entry,
  output,
  resolve,
  plugins,
  module: { rules },
  optimization
};
