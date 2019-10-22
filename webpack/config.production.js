const common = require("./config.common");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { OUTPUT_DIRNAME } = require("./config");
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

common.module.rules.push({
  test: /\.(png|svg|jpg|jpeg|gif)$/,
  use: [
    {
      loader: require.resolve("file-loader"),
      options: {
        outputPath: "images",
        publicPath: `/${OUTPUT_DIRNAME}/images/`
      }
    }
  ]
});

module.exports = common;
