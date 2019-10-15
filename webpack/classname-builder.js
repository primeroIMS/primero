const md5 = require("blueimp-md5");

function ClassnameBuilder() {
  this.classnameCache = new Map();
  this.hashes = new Map();

  function minify(classname, incrementor) {
    const md5Hash = md5(classname + incrementor);
    const intHash = hashStrToInt(md5Hash);
    return encodeInt(intHash, 3, 3);
  }

  function hashStrToInt(s) {
    let h = 0;

    for (let i = 0; i < s.length; i += 1) {
      h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
    }

    return h;
  }

  function encodeInt(int, minLength, maxLength) {
    let remainder = int;
    let result = "";

    while (remainder > 0 || result.length < minLength) {
      result =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"[
          remainder & 63
        ] + result;
      remainder >>>= 6;
    }

    return result.substr(-maxLength);
  }

  this.getMinifiedClassname = classname => {
    const existingCacheEntry = this.classnameCache.get(classname);

    if (existingCacheEntry) {
      return existingCacheEntry;
    }

    let hash;
    let incrementor = 0;

    do {
      hash = minify(classname, incrementor);
      incrementor += 1;
    } while (this.hashes.has(hash) || "0123456789-".includes(hash[0]));

    this.hashes.set(hash, classname);
    this.classnameCache.set(classname, hash);

    return hash;
  };
}

module.exports = new ClassnameBuilder();
