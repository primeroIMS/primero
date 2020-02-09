const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WebpackAssetsManifest = require("webpack-assets-manifest");

const config = require("./config");

const {
  APPLICATION_DIR,
  DEV_SERVER_CONFIG,
  OUTPUT_DIR,
  OUTPUT_DIRNAME,
  PUBLIC_PATH,
  MANIFEST_OUTPUT_PATH,
  utils: { chunkOutput, isProduction, svgPrefix }
} = config;

const resolve = {
  extensions: ["*", ".jsx", ".js"],
  alias: {
    "@material-ui/styles": path.resolve("node_modules", "@material-ui/styles"),
    window: "self"
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
  },
  {
    test: /\.(png|svg|jpg|jpeg|gif)$/,
    use: [
      {
        loader: require.resolve("file-loader"),
        options: {
          outputPath: "images",
          ...(isProduction && { publicPath: `/${OUTPUT_DIRNAME}/images/` })
        }
      }
    ]
  }
];

module.exports = (name, entry) => {
  const { ext, path: entryPath, clean, outputDir } = entry;

  const entryConfig = {
    mode: "production",
    devtool: "none",
    entry: {
      [name]: path.join(APPLICATION_DIR, entryPath, `${name}.${ext}`)
    },
    output: {
      path: outputDir || OUTPUT_DIR,
      filename: chunkData => chunkOutput("hash", chunkData),
      chunkFilename: chunkOutput("chunkhash"),
      publicPath: isProduction ? "/packs/" : PUBLIC_PATH
    },
    plugins: [
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: clean
      }),
      new WebpackAssetsManifest({
        output: MANIFEST_OUTPUT_PATH(name),
        entrypoints: true,
        publicPath: isProduction ? "/packs/" : PUBLIC_PATH,
        writeToDisk: true
      })
    ],
    resolve,
    module: { rules },
    optimization: {
      usedExports: true
    },
    ...(!isProduction && {
      mode: "development",
      devServer: DEV_SERVER_CONFIG,
      devtool: "eval-cheap-module-source-map"
    })
  };

  return entryConfig;
};
