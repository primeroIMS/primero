const path = require("path");
const fs = require("fs");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

const common = require("../config.common");
const config = require("../config");

const {
  ENTRIES,
  ENTRY_NAMES,
  utils: { isProduction, projectPath }
} = config;

const NAME = ENTRY_NAMES.APPLICATION;

const entry = common(NAME, ENTRIES[NAME]);

const cacheFile = file => {
  try {
    const filePath = path.join(projectPath, "public/packs");
    const buildFiles = fs.readdirSync(filePath);

    if (buildFiles) {
      const fileSearch = buildFiles.filter(buildFile =>
        new RegExp(file).test(buildFile)
      );

      if (fileSearch) {
        return fileSearch[0];
      }
    }
  } catch (e) {
    throw new Error(e);
  }
};

entry.optimization = {
  ...entry.optimization,
  splitChunks: {
    cacheGroups: {
      commons: {
        test: /[\\/]node_modules[\\/]/,
        name: "vendor",
        chunks: "all"
      }
    }
  }
};

entry.plugins.push(
  new WorkboxPlugin.InjectManifest({
    swDest: path.join(projectPath, "public/worker.js"),
    swSrc: path.join(projectPath, "app/javascript/worker.js"),
    exclude: [/\*.json$/]
  })
);

if (isProduction) {
  entry.plugins.push(
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash:8].css",
      chunkFilename: "[name].[contenthash:8].chunk.css"
    })
  );
}

module.exports = entry;
