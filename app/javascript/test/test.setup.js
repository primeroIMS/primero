import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

var storage = {};

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

Enzyme.configure({ adapter: new Adapter() });
