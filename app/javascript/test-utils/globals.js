import "mutationobserver-shim";
import get from "lodash/get";
import { parseISO, format as formatDate } from "date-fns";

import { DATE_FORMATS } from "./constants";

const storage = {};

global.html2pdf = {};

document.head.insertBefore(document.createComment("jss-insertion-point"), document.head.firstChild);

global.window.I18n = {
  defaultLocale: "en",
  locale: "en",
  t: path => path,
  l: (path, value) => formatDate(parseISO(value), get(DATE_FORMATS, path)),
  // eslint-disable-next-line no-unused-vars
  toTime: (path, _) => path,
  localizeDate: date => date
};
global.document.documentElement.lang = "en";

global.MutationObserver = window.MutationObserver;

// global.localStorage = {
//   setItem: (key, value) => {
//     storage[key] = value || "";
//   },
//   getItem: key => {
//     return key in storage ? storage[key] : null;
//   },
//   removeItem: key => {
//     delete storage[key];
//   }
// };

global.window.defaultMediaQueryList = (args = {}) => ({
  matches: false,
  media: "",
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  ...args
});

global.window.matchMedia = query => window.defaultMediaQueryList({ media: query });

global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: "BODY",
    ownerDocument: document
  }
});

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
