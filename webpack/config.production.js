const common = require("./config.common");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

common.plugins.push(
  new WebpackAssetsManifest({
    entrypoints: true,
    publicPath: "/packs/"
  }),
  new MiniCssExtractPlugin({
    filename: "[name].[contenthash:8].css",
    chunkFilename: "[name].[contenthash:8].chunk.css"
  })
);

module.exports = common;
