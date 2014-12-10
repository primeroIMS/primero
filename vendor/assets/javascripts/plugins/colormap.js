!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.Colormap=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var colormap = require('colormap');
module.exports = function(opts){
  return colormap(opts);
}

},{"colormap":3}],2:[function(require,module,exports){
module.exports={"jet":[{"index":0,"rgb":[0,0,131]},{"index":0.125,"rgb":[0,60,170]},{"index":0.375,"rgb":[5,255,255]},{"index":0.625,"rgb":[255,255,0]},{"index":0.875,"rgb":[250,0,0]},{"index":1,"rgb":[128,0,0]}],"hsv":[{"index":0,"rgb":[255,0,0]},{"index":0.169,"rgb":[253,255,2]},{"index":0.173,"rgb":[247,255,2]},{"index":0.337,"rgb":[0,252,4]},{"index":0.341,"rgb":[0,252,10]},{"index":0.506,"rgb":[1,249,255]},{"index":0.671,"rgb":[2,0,253]},{"index":0.675,"rgb":[8,0,253]},{"index":0.839,"rgb":[255,0,251]},{"index":0.843,"rgb":[255,0,245]},{"index":1,"rgb":[255,0,6]}],"hot":[{"index":0,"rgb":[0,0,0]},{"index":0.3,"rgb":[230,0,0]},{"index":0.6,"rgb":[255,210,0]},{"index":1,"rgb":[255,255,255]}],"cool":[{"index":0,"rgb":[0,255,255]},{"index":1,"rgb":[255,0,255]}],"spring":[{"index":0,"rgb":[255,0,255]},{"index":1,"rgb":[255,255,0]}],"summer":[{"index":0,"rgb":[0,128,102]},{"index":1,"rgb":[255,255,102]}],"autumn":[{"index":0,"rgb":[255,0,0]},{"index":1,"rgb":[255,255,0]}],"winter":[{"index":0,"rgb":[0,0,255]},{"index":1,"rgb":[0,255,128]}],"bone":[{"index":0,"rgb":[0,0,0]},{"index":0.376,"rgb":[84,84,116]},{"index":0.753,"rgb":[169,200,200]},{"index":1,"rgb":[255,255,255]}],"copper":[{"index":0,"rgb":[0,0,0]},{"index":0.804,"rgb":[255,160,102]},{"index":1,"rgb":[255,199,127]}],"greys":[{"index":0,"rgb":[0,0,0]},{"index":1,"rgb":[255,255,255]}],"yignbu":[{"index":0,"rgb":[8,29,88]},{"index":0.125,"rgb":[37,52,148]},{"index":0.25,"rgb":[34,94,168]},{"index":0.375,"rgb":[29,145,192]},{"index":0.5,"rgb":[65,182,196]},{"index":0.625,"rgb":[127,205,187]},{"index":0.75,"rgb":[199,233,180]},{"index":0.875,"rgb":[237,248,217]},{"index":1,"rgb":[255,255,217]}],"greens":[{"index":0,"rgb":[0,68,27]},{"index":0.125,"rgb":[0,109,44]},{"index":0.25,"rgb":[35,139,69]},{"index":0.375,"rgb":[65,171,93]},{"index":0.5,"rgb":[116,196,118]},{"index":0.625,"rgb":[161,217,155]},{"index":0.75,"rgb":[199,233,192]},{"index":0.875,"rgb":[229,245,224]},{"index":1,"rgb":[247,252,245]}],"yiorrd":[{"index":0,"rgb":[128,0,38]},{"index":0.125,"rgb":[189,0,38]},{"index":0.25,"rgb":[227,26,28]},{"index":0.375,"rgb":[252,78,42]},{"index":0.5,"rgb":[253,141,60]},{"index":0.625,"rgb":[254,178,76]},{"index":0.75,"rgb":[254,217,118]},{"index":0.875,"rgb":[255,237,160]},{"index":1,"rgb":[255,255,204]}],"bluered":[{"index":0,"rgb":[0,0,255]},{"index":1,"rgb":[255,0,0]}],"rdbu":[{"index":0,"rgb":[5,10,172]},{"index":0.35,"rgb":[106,137,247]},{"index":0.5,"rgb":[190,190,190]},{"index":0.6,"rgb":[220,170,132]},{"index":0.7,"rgb":[230,145,90]},{"index":1,"rgb":[178,10,28]}],"picnic":[{"index":0,"rgb":[0,0,255]},{"index":0.1,"rgb":[51,153,255]},{"index":0.2,"rgb":[102,204,255]},{"index":0.3,"rgb":[153,204,255]},{"index":0.4,"rgb":[204,204,255]},{"index":0.5,"rgb":[255,255,255]},{"index":0.6,"rgb":[255,204,255]},{"index":0.7,"rgb":[255,153,255]},{"index":0.8,"rgb":[255,102,204]},{"index":0.9,"rgb":[255,102,102]},{"index":1,"rgb":[255,0,0]}],"rainbow":[{"index":0,"rgb":[150,0,90]},{"index":0.125,"rgb":[0,0,200]},{"index":0.25,"rgb":[0,25,255]},{"index":0.375,"rgb":[0,152,255]},{"index":0.5,"rgb":[44,255,150]},{"index":0.625,"rgb":[151,255,0]},{"index":0.75,"rgb":[255,234,0]},{"index":0.875,"rgb":[255,111,0]},{"index":1,"rgb":[255,0,0]}],"portland":[{"index":0,"rgb":[12,51,131]},{"index":0.25,"rgb":[10,136,186]},{"index":0.5,"rgb":[242,211,56]},{"index":0.75,"rgb":[242,143,56]},{"index":1,"rgb":[217,30,30]}],"blackbody":[{"index":0,"rgb":[0,0,0]},{"index":0.2,"rgb":[230,0,0]},{"index":0.4,"rgb":[230,210,0]},{"index":0.7,"rgb":[255,255,255]},{"index":1,"rgb":[160,200,255]}],"earth":[{"index":0,"rgb":[0,0,130]},{"index":0.1,"rgb":[0,180,180]},{"index":0.2,"rgb":[40,210,40]},{"index":0.4,"rgb":[230,230,50]},{"index":0.6,"rgb":[120,70,20]},{"index":1,"rgb":[255,255,255]}],"electric":[{"index":0,"rgb":[0,0,0]},{"index":0.15,"rgb":[30,0,100]},{"index":0.4,"rgb":[120,0,100]},{"index":0.6,"rgb":[160,90,0]},{"index":0.8,"rgb":[230,200,0]},{"index":1,"rgb":[255,250,220]}], "alpha": [{"index":0, "rgb": [255,255,255,0]},{"index":0, "rgb": [255,255,255,1]}]}

},{}],3:[function(require,module,exports){
/*
 * Ben Postlethwaite
 * January 2013
 * License MIT
 */
'use strict';
var at = require('arraytools');
var colorScale = require('./colorScales.json');


module.exports = function (spec) {

  /*
   * Default Options
   */
    var indicies, rgba, fromrgba, torgba,
        nsteps, cmap, colormap, format,
        nshades, colors, alpha, index, i,
        r = [],
        g = [],
        b = [],
        a = [];

    if ( !at.isPlainObject(spec) ) spec = {};
    if (!spec.colormap) colormap = 'jet';
    if (!Array.isArray(spec.alpha)) {
        if (typeof spec.alpha === 'number') spec.alpha = [spec.alpha, spec.alpha];
        else spec.alpha = [1, 1];
    } else if (spec.alpha.length !== 2) spec.alpha = [1, 1];
    if (typeof spec.colormap === 'string') {
        colormap = spec.colormap.toLowerCase();

        if (!(colormap in colorScale)) {
            throw Error(colormap + ' not a supported colorscale');
        }
        cmap = colorScale[colormap];

    } else if (Array.isArray(spec.colormap)) {
        cmap = spec.colormap;
    }

    nshades = spec.nshades || 72;
    format = spec.format || 'hex';
    alpha = spec.alpha;

    if (cmap.length > nshades) {
        throw new Error(colormap +
                        ' map requires nshades to be at least size ' +
                        cmap.length);
    }

    /*
     * map index points from 0->1 to 0 -> n-1
     */
    indicies = cmap.map(function(c) {
        return Math.round(c.index * nshades);
    });

    /*
     * Add alpha channel to the map
     */
    if (alpha[0] < 0) alpha[0] = 0;
    if (alpha[1] < 0) alpha[0] = 0;
    if (alpha[0] > 1) alpha[0] = 1;
    if (alpha[1] > 1) alpha[0] = 1;

    for (i = 0; i < indicies.length; ++i) {
        index = cmap[i].index;
        rgba = cmap[i].rgb;
        // if user supplies their own map use theirs
        if (rgba.length === 4 && rgba[3] >= 0 && rgba[3] <= 1) continue;
        rgba[3] = alpha[0] + (alpha[1] - alpha[0])*index;
    }

    /*
     * map increasing linear values between indicies to
     * linear steps in colorvalues
     */
    for (i = 0; i < indicies.length-1; ++i) {
        nsteps = indicies[i+1] - indicies[i];
        fromrgba = cmap[i].rgb;
        torgba = cmap[i+1].rgb;
        r = r.concat(at.linspace(fromrgba[0], torgba[0], nsteps ) );
        g = g.concat(at.linspace(fromrgba[1], torgba[1], nsteps ) );
        b = b.concat(at.linspace(fromrgba[2], torgba[2], nsteps ) );
        a = a.concat(at.linspace(fromrgba[3], torgba[3], nsteps ) );
    }

    r = r.map( Math.round );
    g = g.map( Math.round );
    b = b.map( Math.round );

    colors = at.zip(r, g, b, a);

    if (format === 'hex') colors = colors.map( rgb2hex );
    if (format === 'rgbaString') colors = colors.map( rgbaStr );

    return colors;
};


function rgb2hex (rgba) {
    var dig, hex = '#';
    for (var i = 0; i < 3; ++i) {
        dig = rgba[i];
        dig = dig.toString(16);
        hex += ('00' + dig).substr( dig.length );
    }
    return hex;
}

function rgbaStr (rgba) {
    return 'rgba(' + rgba.join(',') + ')';
}

},{"./colorScales.json":2,"arraytools":4}],4:[function(require,module,exports){
'use strict';

var arraytools  = function () {

  var that = {};

  var RGB_REGEX =  /^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,.*)?\)$/;
  var RGB_GROUP_REGEX = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,?\s*(.*)?\)$/;

  function isPlainObject (v) {
    return !Array.isArray(v) && v !== null && typeof v === 'object';
  }

  function linspace (start, end, num) {
    var inc = (end - start) / (num - 1);
    var a = [];
    for( var ii = 0; ii < num; ii++)
      a.push(start + ii*inc);
    return a;
  }

  function zip () {
      var arrays = [].slice.call(arguments);
      var lengths = arrays.map(function (a) {return a.length;});
      var len = Math.min.apply(null, lengths);
      var zipped = [];
      for (var i = 0; i < len; i++) {
          zipped[i] = [];
          for (var j = 0; j < arrays.length; ++j) {
              zipped[i][j] = arrays[j][i];
          }
      }
      return zipped;
  }

  function zip3 (a, b, c) {
      var len = Math.min.apply(null, [a.length, b.length, c.length]);
      var result = [];
      for (var n = 0; n < len; n++) {
          result.push([a[n], b[n], c[n]]);
      }
      return result;
  }

  function sum (A) {
    var acc = 0;
    accumulate(A, acc);
    function accumulate(x) {
      for (var i = 0; i < x.length; i++) {
        if (Array.isArray(x[i]))
          accumulate(x[i], acc);
        else
          acc += x[i];
      }
    }
    return acc;
  }

  function copy2D (arr) {
    var carr = [];
    for (var i = 0; i < arr.length; ++i) {
      carr[i] = [];
      for (var j = 0; j < arr[i].length; ++j) {
        carr[i][j] = arr[i][j];
      }
    }

    return carr;
  }


  function copy1D (arr) {
    var carr = [];
    for (var i = 0; i < arr.length; ++i) {
      carr[i] = arr[i];
    }

    return carr;
  }


  function isEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
      return false;
    for(var i = arr1.length; i--;) {
      if(arr1[i] !== arr2[i])
        return false;
    }

    return true;
  }


  function str2RgbArray(str, twoFiftySix) {
    // convert hex or rbg strings to 0->1 or 0->255 rgb array
    var rgb,
        match;

    if (typeof str !== 'string') return str;

    rgb = [];
    // hex notation
    if (str[0] === '#') {
      str = str.substr(1) // remove hash
      if (str.length === 3) str += str // fff -> ffffff
      match = parseInt(str, 16);
      rgb[0] = ((match >> 16) & 255);
      rgb[1] = ((match >> 8) & 255);
      rgb[2] = (match & 255);
    }

    // rgb(34, 34, 127) or rgba(34, 34, 127, 0.1) notation
    else if (RGB_REGEX.test(str)) {
      match = str.match(RGB_GROUP_REGEX);
      rgb[0] = parseInt(match[1]);
      rgb[1] = parseInt(match[2]);
      rgb[2] = parseInt(match[3]);
    }

    if (!twoFiftySix) {
      for (var j=0; j<3; ++j) rgb[j] = rgb[j]/255
    }


    return rgb;
  }


  function str2RgbaArray(str, twoFiftySix) {
    // convert hex or rbg strings to 0->1 or 0->255 rgb array
    var rgb,
        match;

    if (typeof str !== 'string') return str;

    rgb = [];
    // hex notation
    if (str[0] === '#') {
      str = str.substr(1) // remove hash
      if (str.length === 3) str += str // fff -> ffffff
      match = parseInt(str, 16);
      rgb[0] = ((match >> 16) & 255);
      rgb[1] = ((match >> 8) & 255);
      rgb[2] = (match & 255);
    }

    // rgb(34, 34, 127) or rgba(34, 34, 127, 0.1) notation
    else if (RGB_REGEX.test(str)) {
      match = str.match(RGB_GROUP_REGEX);
      rgb[0] = parseInt(match[1]);
      rgb[1] = parseInt(match[2]);
      rgb[2] = parseInt(match[3]);
      if (match[4]) rgb[3] = parseFloat(match[4]);
      else rgb[3] = 1.0;
    }



    if (!twoFiftySix) {
      for (var j=0; j<3; ++j) rgb[j] = rgb[j]/255
    }


    return rgb;
  }





  that.isPlainObject = isPlainObject;
  that.linspace = linspace;
  that.zip3 = zip3;
  that.sum = sum;
  that.zip = zip;
  that.isEqual = isEqual;
  that.copy2D = copy2D;
  that.copy1D = copy1D;
  that.str2RgbArray = str2RgbArray;
  that.str2RgbaArray = str2RgbaArray;

  return that

}


module.exports = arraytools();

},{}]},{},[1])(1)
});