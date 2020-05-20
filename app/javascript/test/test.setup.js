import chai from "chai";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import sinonChai from "sinon-chai";
import chaiImmutable from "chai-immutable";
import "mutationobserver-shim";
import indexedDB from "fake-indexeddb";
import IDBKeyRange from "fake-indexeddb/lib/FDBKeyRange";
import IDBRequest from "fake-indexeddb/lib/FDBRequest";
import IDBTransaction from "fake-indexeddb/lib/FDBTransaction";
import IDBDatabase from "fake-indexeddb/lib/FDBDatabase";
import IDBObjectStore from "fake-indexeddb/lib/FDBObjectStore";
import IDBIndex from "fake-indexeddb/lib/FDBIndex";
import IDBCursor from "fake-indexeddb/lib/FDBCursor";

chai.use(chaiImmutable);
chai.use(sinonChai);

global.expect = chai.expect;

const storage = {};

global.window.indexedDB = indexedDB;
global.indexedDB = global.window.indexedDB;

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

global.window.I18n = { defaultLocale: "en", locale: "en", t: path => path };

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

global.window.matchMedia = query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {}
});

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

Enzyme.configure({ adapter: new Adapter() });
