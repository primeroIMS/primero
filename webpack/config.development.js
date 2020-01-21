const common = require("./config.common");
const path = require("path");
const { OUTPUT_DIR, PORT, WEB_SERVER_HOST } = require("./config");
const WebpackAssetsManifest = require("webpack-assets-manifest");

const publicPath = `http://${WEB_SERVER_HOST}:${PORT}/`;

const devServer = {
  contentBase: OUTPUT_DIR,
  compress: true,
  port: PORT,
  historyApiFallback: true,
  stats: "minimal",
  hot: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
  },
  writeToDisk: (filePath) => {
    return /worker\.js$/.test(filePath);
  }
};

common.plugins.push(
  new WebpackAssetsManifest({
    entrypoints: true,
    publicPath: publicPath
  })
);

common.output.publicPath = publicPath;

common.module.rules.push({
  test: /\.(png|svg|jpg|jpeg|gif)$/,
  use: [
    {
      loader: require.resolve("file-loader"),
      options: {
        outputPath: "images",
      }
    }
  ]
});

module.exports = Object.assign({}, common, {
  devtool: "source-map",
  devServer
});
