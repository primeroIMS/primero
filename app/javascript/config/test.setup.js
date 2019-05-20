// eslint-disable

import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

global.window.I18n = { defaultLocale: "en", t: () => {} };

Enzyme.configure({ adapter: new Adapter() });
