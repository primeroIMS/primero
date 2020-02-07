const fs = require("fs");
const crypto = require("crypto");
const ConcatSource = require("webpack-sources").ConcatSource;

class BuildPrecacheManifest {
  constructor(manifestFiles = [], additionalFilePaths = []) {
    this.manifestFiles = manifestFiles
    this.additionalFilePaths = additionalFilePaths
    this.hash = crypto.createHash('md5').update(new Date().toString()).digest("hex")
    this.EXCLUDE_PROPERTIES = [
      "entrypoints"
    ]
  }

  template(files = []) {
    return `self.__precacheManifest = (self.__precacheManifest || []).concat([\n  ${files.join(",\n  ")}\n]);`
  }

  readManifestFiles(compilation) {
    let promises = [];

    const files = [...this.manifestFiles, ...this.additionalFilePaths];

    files.forEach(manifest => {
      promises.push(
        new Promise((resolve, reject) => {
          fs.readFile(manifest, (error, data) => {
            if (error) return reject(error);

            resolve(this.formatData(data));
          })
        })
      );
    });

    return promises;
  }

  async writePrecacheFile(compilation) {
    const results = await Promise.all(this.readManifestFiles(compilation));
    const source = this.template(results.flat());

    compilation.assets[`precache-manifest.${this.hash}.js`] = {
      source: () => source,
      size: () => source.length
    };
  } 

  formatData(data) {
    if (data) {
      const isJSON = /^{/.test(data.toString());

      if (isJSON) {
        const json = JSON.parse(data);
    
        return Object.keys(json).reduce((prev, current) => {
          if (!this.EXCLUDE_PROPERTIES.includes(current)) {
            prev.push(`"${json[current]}"`);
          }
          return prev;
        }, []);
      } 

      return [`"/${data.toString()}"`]
    }

    return [];
  }
  
  apply(compiler) {
    compiler.hooks.afterCompile.tapPromise(
      this.constructor.name,
      compilation => this.handleEmit(compilation)
        .catch(error => compilation.errors.push(error))
    )
  }

  async handleEmit(compilation) {
    await this.writePrecacheFile(compilation).
      catch(error => compilation.errors.push(error));

    compilation.assets['worker.js'] = new ConcatSource(
      `importScripts("/precache-manifest.${this.hash}.js");`,
      compilation.assets['worker.js']
    )
  }
}

module.exports = BuildPrecacheManifest