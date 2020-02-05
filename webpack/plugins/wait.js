const WebpackBeforeBuildPlugin = require("before-build-webpack")
const fs = require("fs")

class WaitPlugin extends WebpackBeforeBuildPlugin {
  constructor(files = [], interval = 100, timeout = 100000) {
    super((stats, callback) => {
      let start = Date.now();

      const hasFiles = () => {
        return files.map(file => fs.existsSync(file)).every(val => val === true)
      }

      const poll = () => {
        if (hasFiles()) {
          callback();
        } else if (Date.now() - start > timeout) {
          throw Error(`WaitPlugin: Timeout missing files ${files.join(', ')}`);
        } else {
          setTimeout(poll, interval);
        }
      }

      poll();
    })
  }
}

module.exports = WaitPlugin;