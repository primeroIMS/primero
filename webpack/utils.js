const path = require("path");
const { join } = require("path");
const { readdirSync } = require("fs");

const APP_DIR = path.resolve(__dirname, "app", "javascript");

exports.generateAliases = () => {
  const isDirectory = src => !path.basename(src).match(/^index.(js|jsx)$/);
  const aliases = readdirSync(APP_DIR)
    .map(name => join(APP_DIR, name))
    .filter(isDirectory)
    .map(dir => ({ [path.basename(dir, ".js")]: dir }));

  return Object.assign({}, ...aliases, {
    "@material-ui/styles": require.resolve("@material-ui/styles")
  });
};
