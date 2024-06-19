// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

const path = require("path");

const {
  APPLICATION_DIR,
  DEV_SERVER_CONFIG,
  OUTPUT_DIR,
  PUBLIC_PATH,
  utils: { chunkOutput, isProduction },
  ENTRY_NAMES
} = require("./config");
const rules = require("./rules");
const plugins = require("./plugins");

const resolve = {
  extensions: ["*", ".jsx", ".js"],
  alias: {
    "@mui/material/styles": path.resolve("node_modules", "@mui/material/styles"),
    "@mui/cache": path.resolve("node_modules", "@mui/styled-engine/node_modules/@emotion/cache"),
    "tss-react": path.resolve("node_modules", "tss-react"),
    window: "self"
  }
};

module.exports = (name, entry) => {
  const { ext, path: entryPath, clean, outputDir } = entry;

  const entryConfig = {
    experiments: {
      topLevelAwait: true
    },
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
    ...(!isProduction &&
      name === ENTRY_NAMES.APPLICATION && {
        mode: "development",
        devServer: DEV_SERVER_CONFIG,
        devtool: "inline-source-map"
      })
  };

  return entryConfig;
};
