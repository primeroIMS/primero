process.env.NODE_ENV = process.env.NODE_ENV || "development";

const environment = require("./environment");

environment.config.devtool = 'cheap-eval-source-map'

module.exports = environment.toWebpackConfig();
