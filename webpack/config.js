const path = require("path");

const OUTPUT_DIRNAME = "packs";

exports.APPLICATION_DIR = path.resolve(__dirname, "../app/javascript");

exports.OUTPUT_DIRNAME = OUTPUT_DIRNAME;

exports.OUTPUT_DIR = path.resolve(__dirname, "..", "public", OUTPUT_DIRNAME);

exports.PORT = 9000;

exports.WEB_SERVER_HOST = "localhost";

exports.CLIENT_APPLICATION = path.resolve(
  __dirname,
  "..",
  "app/javascript/packs/application.jsx"
);

exports.ID_APPLICATION = path.resolve(
  __dirname,
  "..",
  "app/javascript/packs/identity.jsx"
);