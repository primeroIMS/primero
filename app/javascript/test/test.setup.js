import Enzyme from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

import './globals'
import '../test-utils/globals'

Enzyme.configure({ adapter: new Adapter() });
