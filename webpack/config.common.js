const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { 
  APPLICATION_DIR, 
  OUTPUT_DIR, 
  ENTRIES, 
  EXTERNAL_ENTRY, 
  APPLICATION_ENTRY,
  CLEAN_BEFORE_BUILD,
  MANIFEST_FILE_PATHS,
  ADDITIONAL_MANIFEST_FILE_PATHS
} = require("./config");
const WaitPlugin = require("./plugins/wait.js");
const BuildPrecacheManifest = require("./plugins/build-precache-manifest.js");

const chunkOutput = (hashMethod, data) => {
  return data && data.chunk.name === "worker" 
    ? "[name].js"
    : `[name].[${hashMethod}].js`
}

const svgPrefix = {
  toString: () =>
    `${Math.random()
      .toString(36)
      .substring(2, 8)}_`
};

const output = (name, outputDir) => ({
  path: outputDir || OUTPUT_DIR,
  filename: (chunkData) => chunkOutput("hash", chunkData),
  chunkFilename: chunkOutput("chunkhash"),
  publicPath: "/",
});

const resolve = {
  extensions: ["*", ".jsx", ".js"],
  alias: {
    "@material-ui/styles": path.resolve("node_modules", "@material-ui/styles"),
    "window": "self"
  }
};

const plugins = name => ([
  new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: CLEAN_BEFORE_BUILD[name]
  }),
  ...(EXTERNAL_ENTRY(name) ? [
    new BuildPrecacheManifest(MANIFEST_FILE_PATHS, ADDITIONAL_MANIFEST_FILE_PATHS),
    new WaitPlugin(MANIFEST_FILE_PATHS)
  ] : [])
]);

const optimization = name => ({
  usedExports: true,
  ...(APPLICATION_ENTRY(name) ? {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all"
        }
      }
    }
  } : {})
});

const rules = [
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: {
      loader: require.resolve("babel-loader")
    }
  },
  {
    test: /\.css$/,
    use: [
      {
        loader: "css-to-mui-loader"
      },
      {
        loader: "postcss-loader",
        options: {
          config: {
            path: path.resolve(__dirname, "..", "postcss.config.js")
          }
        }
      }
    ]
  },
  {
    test: /\.svg$/,
    loader: "react-svg-loader",
    options: {
      jsx: true,
      svgo: {
        plugins: [{ cleanupIDs: { prefix: svgPrefix } }]
      }
    }
  }
];

module.exports = ENTRIES.map(entry => {
  const { name, outputDir, ext, path: entryPath } = entry;

  return {
    config: {
      entry: {
        [name]: path.join(APPLICATION_DIR, entryPath, `${name}.${ext}` )
      },
      output: output(name, outputDir),
      resolve,
      plugins: plugins(name),
      module: { rules },
      mode: "production",
      optimization: optimization(name)
    },
    name
  }
})