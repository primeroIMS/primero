import chai from "chai";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import sinonChai from "sinon-chai";
import chaiImmutable from "chai-immutable";
import 'mutationobserver-shim'

chai.use(chaiImmutable);
chai.use(sinonChai);

const storage = {};

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
    nodeName: 'BODY',
    ownerDocument: document,
  },
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
