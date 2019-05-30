import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

global.window.I18n = { defaultLocale: "en", t: () => {} };

global.window.matchMedia = query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {}
});

Enzyme.configure({ adapter: new Adapter() });
