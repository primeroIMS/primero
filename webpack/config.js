const path = require("path");

const projectPath = path.join(__dirname, "..");

const OUTPUT_DIRNAME = "packs";

const WEB_SERVER_HOST = "localhost";

const PORT = 9000;

const OUTPUT_DIR = path.resolve(projectPath, "public", OUTPUT_DIRNAME);

const MANIFEST_FILES = ["application.json", "identity.json"];

const APPLICATION_DIR = path.join(projectPath, "app/javascript");

const PUBLIC_PATH = `http://${WEB_SERVER_HOST}:${PORT}/`;

const ENTRY_NAMES = {
  APPLICATION: "application",
  IDENTITY: "identity"
};

const ENTRIES = {
  [ENTRY_NAMES.IDENTITY]: {
    ext: "jsx",
    path: "/packs",
    clean: ["identity*"]
  },
  [ENTRY_NAMES.APPLICATION]: {
    ext: "jsx",
    path: "/packs",
    clean: ["application*", "vendor*", "precache-manifest*"]
  }
};

const DEV_SERVER_CONFIG = {
  contentBase: OUTPUT_DIR,
  compress: true,
  port: PORT,
  historyApiFallback: true,
  stats: "minimal",
  hot: false,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers":
      "X-Requested-With, content-type, Authorization"
  },
  writeToDisk: filePath => {
    return /(worker\.js|application\.json|identity\.json|precache-manifest.*\.js)$/.test(
      filePath
    );
  }
};

const ADDITIONAL_PRECACHE_MANIFEST_FILES = ["^translations-.*.js$"];

const MANIFEST_OUTPUT_PATH = name =>
  path.join(projectPath, "public/manifests", `${name}.json`);

const MANIFEST_FILE_PATHS = MANIFEST_FILES.map(file =>
  path.join(projectPath, "public/manifests/", file)
);

const isProduction = process.env.NODE_ENV === "production";

const chunkOutput = (hashMethod, data) => {
  return data && data.chunk.name === "worker"
    ? "[name].js"
    : `[name].[${hashMethod}].js`;
};

const svgPrefix = {
  toString: () =>
    `${Math.random()
      .toString(36)
      .substring(2, 8)}_`
};

module.exports = {
  utils: {
    projectPath,
    chunkOutput,
    svgPrefix,
    isProduction
  },
  ADDITIONAL_PRECACHE_MANIFEST_FILES,
  APPLICATION_DIR,
  DEV_SERVER_CONFIG,
  ENTRIES,
  ENTRY_NAMES,
  MANIFEST_FILE_PATHS,
  MANIFEST_OUTPUT_PATH,
  OUTPUT_DIR,
  OUTPUT_DIRNAME,
  PUBLIC_PATH
};
