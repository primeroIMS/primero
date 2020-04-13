import React from "react";
import { shallow } from "enzyme";

import { CasesIcon, IncidentsIcon } from "../../images/primero-icons";

import ListIcon from "./component";

describe("<ListIcon />", () => {
  it("renders correct icon", () => {
    const component = shallow(<ListIcon icon="cases" />);

    expect(component.find(CasesIcon)).to.have.lengthOf(1);
    component.setProps({ icon: "incidents" });
    expect(component.find(IncidentsIcon)).to.have.lengthOf(1);
  });
});
