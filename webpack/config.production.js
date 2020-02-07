const common = require("./config.common");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { OUTPUT_DIRNAME, EXTERNAL_ENTRY, MANIFEST_OUTPUT_PATH } = require("./config");

const plugins = name => ([
  ...(!EXTERNAL_ENTRY(name) 
      ? [ 
          new WebpackAssetsManifest({
            output: MANIFEST_OUTPUT_PATH(name),
            entrypoints: true,
            publicPath: "/packs/"
          })
        ]
      : []),
  new MiniCssExtractPlugin({
    filename: "[name].[contenthash:8].css",
    chunkFilename: "[name].[contenthash:8].chunk.css"
  })
]);

const rules = [{
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
}];

module.exports = common.map(entry => {
  const { config, name } = entry;

  return Object.assign({}, config, {
    plugins: [...config.plugins, ...plugins(name)],
    module: {
      rules: [...config.module.rules, ...rules]
    }
  });
});
