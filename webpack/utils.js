const path = require("path");
const { join } = require("path");
const { readdirSync } = require("fs");
const classnameBuilder = require("./classname-builder");

const APP_DIR = path.resolve(__dirname, "../app/javascript");

const generateClassName = (rule, sheet) => {
  let counter = 0;

  const hash = classnameBuilder.getMinifiedClassname(
    `${sheet.options.meta}:${rule.key}:${counter++}`
  );

  return hash;
};

exports.generateAliases = () => {
  const isDirectory = src => !path.basename(src).match(/^index.(js|jsx)$/);
  const aliases = readdirSync(APP_DIR)
    .map(name => join(APP_DIR, name))
    .filter(isDirectory)
    .map(dir => ({ [path.basename(dir, ".js")]: dir }));

  // return Object.assign({}, ...aliases, {
  //   "@material-ui/styles": require.resolve("@material-ui/styles")
  // });

  return Object.assign({}, ...aliases, {});
};

exports.generateScopedName = (name, resourcePath) => {
  const dir = path.relative(__dirname, resourcePath);
  const hash = `${dir}:${name}`;
  return classnameBuilder.getMinifiedClassname(hash);
};
