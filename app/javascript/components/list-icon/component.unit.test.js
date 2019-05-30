/* eslint-disable */

import React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import "config/test.setup";

import ListIcon from "./component";
import { CasesIcon, IncidentsIcon } from "images/primero-icons";

describe("<ListIcon />", () => {
  it("renders correct icon", () => {
    const component = shallow(<ListIcon icon="cases" />);
    expect(component.find(CasesIcon)).to.have.length(1);
    component.setProps({ icon: "incidents" });
    expect(component.find(IncidentsIcon)).to.have.length(1);
  });
});
