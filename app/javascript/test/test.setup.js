import chai from "chai";
import Enzyme from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import sinonChai from "sinon-chai";
import "mutationobserver-shim";
import chaiImmutable from "chai-immutable";
import indexedDB from "fake-indexeddb";
import IDBKeyRange from "fake-indexeddb/lib/FDBKeyRange";
import IDBRequest from "fake-indexeddb/lib/FDBRequest";
import IDBTransaction from "fake-indexeddb/lib/FDBTransaction";
import IDBDatabase from "fake-indexeddb/lib/FDBDatabase";
import IDBObjectStore from "fake-indexeddb/lib/FDBObjectStore";
import IDBIndex from "fake-indexeddb/lib/FDBIndex";
import IDBCursor from "fake-indexeddb/lib/FDBCursor";
import get from "lodash/get";
import { parseISO, format as formatDate } from "date-fns";

chai.use(chaiImmutable);
chai.use(sinonChai);

global.expect = chai.expect;

const storage = {};

const DATE_FORMATS = Object.freeze({
  date: Object.freeze({
    formats: Object.freeze({
      default: "dd-MMM-yyyy",
      with_time: "dd-MMM-yyyy HH:mm"
    })
  })
});

global.window.indexedDB = indexedDB;
global.indexedDB = global.window.indexedDB;
global.html2pdf = {};

global.window.IDBKeyRange = IDBKeyRange;
global.IDBKeyRange = global.window.IDBKeyRange;

global.window.IDBRequest = IDBRequest;
global.IDBRequest = global.window.IDBRequest;

global.window.IDBTransaction = IDBTransaction;
global.IDBTransaction = global.window.IDBTransaction;

global.window.IDBDatabase = IDBDatabase;
global.IDBDatabase = global.window.IDBDatabase;

global.window.IDBObjectStore = IDBObjectStore;
global.IDBObjectStore = global.window.IDBObjectStore;

global.window.IDBCursor = IDBCursor;
global.IDBCursor = global.window.IDBCursor;

global.window.IDBIndex = IDBIndex;
global.IDBIndex = global.window.IDBIndex;

global.window.I18n = {
  defaultLocale: "en",
  locale: "en",
  t: path => path,
  l: (path, value) => formatDate(parseISO(value), get(DATE_FORMATS, path)),
  toTime: (path, _) => path,
  localizeDate: date => date
};
global.document.documentElement.lang = "en";

global.MutationObserver = window.MutationObserver;

global.localStorage = {
  setItem: (key, value) => {
    storage[key] = value || "";
  },
  getItem: key => {
    return key in storage ? storage[key] : null;
  },
  removeItem: key => {
    delete storage[key];
  }
};

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

Enzyme.configure({ adapter: new Adapter() });
