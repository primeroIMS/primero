const path = require("path");
const { join } = require("path");
const { readdirSync } = require("fs");
const { APPLICATION_DIR } = require("./config");

exports.generateAliases = () => {
  const isDirectory = src => !path.basename(src).match(/^index.(js|jsx)$/);
  const aliases = readdirSync(APPLICATION_DIR)
    .map(name => join(APPLICATION_DIR, name))
    .filter(isDirectory)
    .reduce((obj, item) => {
      obj[path.basename(item, ".js")] = item;
      return obj;
    }, {});

  return aliases;
};
