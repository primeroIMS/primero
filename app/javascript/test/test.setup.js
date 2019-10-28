import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import chai from "chai";
import sinonChai from "sinon-chai";

var storage = {};
chai.use(sinonChai);

global.window.I18n = { defaultLocale: "en", locale: "en", t: path => path };

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
export { expect } from "chai";
