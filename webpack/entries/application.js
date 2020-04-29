const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

const common = require("../config.common");
const config = require("../config");

const {
  ADDITIONAL_PRECACHE_MANIFEST_FILES,
  TRANSLATION_MANIFEST_FILES,
  ENTRIES,
  ENTRY_NAMES,
  utils: { isProduction, projectPath }
} = config;

const NAME = ENTRY_NAMES.APPLICATION;

const entry = common(NAME, ENTRIES[NAME]);

const cacheFile = file => {
  try {
    const filePath = path.join(projectPath, "public");
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

  return false;
};

const additionalFiles = originalManifest => {
  const warnings = [];
  const manifest = originalManifest;

  TRANSLATION_MANIFEST_FILES.forEach(file => {
    const additionalFile = cacheFile(file);

    if (additionalFile) {
      manifest.push({ url: additionalFile });
    }
  });

  ADDITIONAL_PRECACHE_MANIFEST_FILES.forEach(file => {
    try {
      const revision = crypto.createHash("sha256");
      const isIndexFile = file === "/";

      if (!isIndexFile) {
        revision.update(
          fs.readFileSync(path.join(projectPath, "public", file), "utf8"),
          "utf8"
        );
      }
      manifest.push({
        url: isIndexFile ? file : `/${file}`,
        revision: revision.digest("hex")
      });
    } catch (error) {
      throw new Error(
        `Failure adding file to precache-manifest: ${error.message}`
      );
    }
  });

  return { manifest, warnings };
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
    exclude: [/\*.json$/],
    manifestTransforms: [additionalFiles]
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
