const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const {
  PUBLIC_PATH,
  MANIFEST_OUTPUT_PATH,
  utils: { chunkOutput, isProduction }
} = require("./config");

const plugins = ({ name, clean }) => [
  new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: clean
  }),
  ...(isProduction
    ? [
        new MiniCssExtractPlugin({
          filename: chunkOutput("chunkhash", null, "css")
        })
      ]
    : []),
  new WebpackAssetsManifest({
    output: MANIFEST_OUTPUT_PATH(name),
    entrypoints: true,
    publicPath: isProduction ? "/packs/" : PUBLIC_PATH,
    writeToDisk: true
  }),
  new MiniCssExtractPlugin({
    filename: "[name].[contenthash:8].css",
    chunkFilename: "[name].[contenthash:8].chunk.css"
  })
];

module.exports = plugins;
