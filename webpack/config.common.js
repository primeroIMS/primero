const path = require("path");

const {
  APPLICATION_DIR,
  DEV_SERVER_CONFIG,
  OUTPUT_DIR,
  PUBLIC_PATH,
  utils: { chunkOutput, isProduction }
} = require("./config");
const rules = require("./rules");
const plugins = require("./plugins");

const resolve = {
  extensions: ["*", ".jsx", ".js"],
  alias: {
    "@material-ui/styles": path.resolve("node_modules", "@material-ui/styles"),
    window: "self"
  }
};

module.exports = (name, entry) => {
  const { ext, path: entryPath, clean, outputDir } = entry;

  const entryConfig = {
    mode: "production",
    devtool: false,
    entry: {
      [name]: path.join(APPLICATION_DIR, entryPath, `${name}.${ext}`)
    },
    output: {
      path: outputDir || OUTPUT_DIR,
      filename: chunkData => chunkOutput("fullhash", chunkData),
      chunkFilename: chunkOutput("chunkhash"),
      publicPath: isProduction ? "/packs/" : PUBLIC_PATH
    },
    plugins: plugins({ name, clean }),
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
