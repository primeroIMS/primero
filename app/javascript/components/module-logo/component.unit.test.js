import React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import "config/test.setup";

import ModuleLogo from "./component";
import PrimeroLogo from "images/primero-logo.png";
import MRMLogo from "images/mrm-logo.png";

describe("<ModuleLogo />", () => {
  it("renders a default primero module logo", () => {
    const component = shallow(<ModuleLogo />);
    expect(component.find("img").prop("src")).to.equal(PrimeroLogo);
  });

  it("renders a primero module logo from props", () => {
    const component = shallow(<ModuleLogo moduleLogo="mrm" />);
    expect(component.find("img").prop("src")).to.equal(MRMLogo);
  });
});
