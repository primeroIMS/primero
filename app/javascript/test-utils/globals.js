// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import "mutationobserver-shim";

import get from "lodash/get";
import { parseISO, format as formatDate } from "date-fns";

import { DATE_FORMATS } from "./constants";

global.html2pdf = {};

if (typeof jest !== "undefined") {
  global.window.fetch = jest.fn();
}

global.innerWidth = 2000;

document.head.insertBefore(document.createComment("emotion-insertion-point"), document.head.firstChild);

global.window.I18n = {
  defaultLocale: "en",
  locale: "en",
  t: path => path,
  l: (path, value) => formatDate(parseISO(value), get(DATE_FORMATS, path)),
  // eslint-disable-next-line no-unused-vars
  toTime: (path, _) => path,
  localizeDate: date => date,
  interpolate: (message, options) => {
    if (typeof message === "string") {
      return message.replace(/%{(\w+)}/g, (_, key) => options[key] || "");
    }

    return message;
  }
};
global.document.documentElement.lang = "en";

global.MutationObserver = window.MutationObserver;

global.window.defaultMediaQueryList = (args = {}) => ({
  matches: false,
  media: "",
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  ...args
});

global.window.matchMedia = query => window.defaultMediaQueryList({ media: query });

global.HTMLCanvasElement.prototype.getContext = () => {
  return {
    fillRect() {},
    clearRect() {},
    getImageData(x, y, w, h) {
      return {
        data: new Array(w * h * 4)
      };
    },
    putImageData() {},
    createImageData() {
      return [];
    },
    setTransform() {},
    drawImage() {},
    save() {},
    fillText() {},
    restore() {},
    beginPath() {},
    moveTo() {},
    lineTo() {},
    closePath() {},
    stroke() {},
    translate() {},
    scale() {},
    rotate() {},
    arc() {},
    fill() {},
    measureText() {
      return { width: 0 };
    },
    transform() {},
    rect() {},
    clip() {}
  };
};

global.cancelAnimationFrame = () => {};

global.window.locationManifest = "/test-locations.json";

global.URL.createObjectURL = () => {};
class Worker {
  constructor(stringUrl) {
    this.url = stringUrl;
    this.onmessage = () => {};
  }

  postMessage(msg) {
    this.onmessage(msg);
  }

  // eslint-disable-next-line class-methods-use-this
  addEventListener() {}
}
global.Worker = Worker;
