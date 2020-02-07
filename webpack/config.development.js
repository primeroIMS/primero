const common = require("./config.common");
const { DEV_SERVER_CONFIG, PUBLIC_PATH, EXTERNAL_ENTRY, MANIFEST_OUTPUT_PATH } = require("./config");
const WebpackAssetsManifest = require("webpack-assets-manifest");

const plugins = name => ([
  ...(!EXTERNAL_ENTRY(name) 
      ? [ 
          new WebpackAssetsManifest({
            output: MANIFEST_OUTPUT_PATH(name),
            entrypoints: true,
            publicPath: PUBLIC_PATH,
            writeToDisk: true
          })
        ] 
      : [])
]);

const rules = [
  {
    test: /\.(png|svg|jpg|jpeg|gif)$/,
    use: [
      {
        loader: require.resolve("file-loader"),
        options: {
          outputPath: "images",
        }
      }
    ]
  }
];

module.exports = common.map(entry => {
  const  { config, name } = entry;

  return Object.assign({}, config, {
    devServer: DEV_SERVER_CONFIG,
    devtool: "source-map",
    output: Object.assign({}, config.output, {
      publicPath: PUBLIC_PATH
    }),
    plugins: [...config.plugins, ...plugins(name)],
    module: {
      rules: [...config.module.rules, ...rules]
    },
    mode: "development",
  });
});