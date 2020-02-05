const path = require("path");

const EXTERNAL_ENTRIES = [
  "worker"
]

const OUTPUT_DIRNAME = "packs";

const WEB_SERVER_HOST = "localhost";

const PORT = 9000;

const OUTPUT_DIR = path.resolve(__dirname, "..", "public", OUTPUT_DIRNAME);

const MANIFEST_FILES = [
  "application.json",
  "identity.json"
];

exports.APPLICATION_DIR = path.join(__dirname, "..", "app/javascript");

exports.OUTPUT_DIRNAME = OUTPUT_DIRNAME;

exports.OUTPUT_DIR = OUTPUT_DIR;

exports.PUBLIC_PATH = `http://${WEB_SERVER_HOST}:${PORT}/`;

exports.ENTRIES = [
  {
    name:  "identity",
    ext: "jsx",
    path: "/packs"
  },
  {
    name:  "application",
    ext: "jsx",
    path: "/packs"
  },
  {
    name:  "worker",
    ext: "js",
    path: "",
    outputDir: path.resolve(__dirname, "..", "public")
  }
]

exports.CLEAN_BEFORE_BUILD = {
  worker: [
    "precache-manifest*",
    "worker.js"
  ],
  application: [
    "packs/application*",
    "packs/vendor*",
  ],
  identity: [
    "packs/identity*",
  ]
};

exports.DEV_SERVER_CONFIG = {
  contentBase: OUTPUT_DIR,
  compress: true,
  port: PORT,
  historyApiFallback: true,
  stats: "minimal",
  hot: false,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
  },
  writeToDisk: (filePath) => {
    return /(worker\.js|application\.json|identity\.json|precache-manifest.*\.js)$/.test(filePath);
  }
};

exports.EXTERNAL_ENTRY = name => EXTERNAL_ENTRIES.includes(name);

exports.APPLICATION_ENTRY = name => name === "application";

exports.MANIFEST_OUTPUT_PATH = name => path.join(__dirname, "..", "public/manifests", `${name}.json`);

exports.MANIFEST_FILE_PATHS = MANIFEST_FILES.map(file => path.join(__dirname, "..", "public/manifests/", file));

exports.ADDITIONAL_MANIFEST_FILE_PATHS = [
  path.join(__dirname, "..", "config/i18n-manifest.txt")
]