const common = require("./config.common");
const path = require("path")
const OUTPUT_DIRNAME = "packs";
const PORT = 9000;

const devServer = {
  contentBase: path.resolve(__dirname, "../public", OUTPUT_DIRNAME),
  compress: true,
  port: PORT,
  historyApiFallback: true,
  stats: "minimal",
  hot: true
};

module.exports = Object.assign({}, common, {
  devtool: "source-map",
  devServer
});
