const vendor = require("./vendor");
const path = require("path");
const { generateAliases } = require("./utils");

const OUTPUT_DIRNAME = "packs";

const entry = {
  vendor
};

const output = {
  path: path.resolve(__dirname, OUTPUT_DIRNAME),
  filename: "[name].js",
  publicPath: "/"
};

const resolve = {
  extensions: ["*", ".jsx", ".js"],
  alias: Object.assign({}, generateAliases(), {
    "react-dom": "@hot-loader/react-dom"
  })
};

const plugins = [
  new ManifestPlugin()
  // new CleanWebpackPlugin([OUTPUT_DIRNAME]),
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
        name: "vendors",
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

module.exports = {
  entry,
  output,
  resolve,
  plugins,
  module: { rules },
  optimization
};
