import React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import "config/test.setup";

import AgencyLogo from "./component";
import UnicefLogo from "images/unicef.png";

describe("<AgencyLogo />", () => {
  it("renders agency logo from props", () => {
    const props = {
      logo: "http://primero.com/img.png",
      agency: "usng"
    };
    const component = shallow(<AgencyLogo {...props} />);

    expect(component.find("img").prop("src")).to.equal(props.logo);
    expect(component.find("img").prop("alt")).to.equal(props.agency);
  });

  it("renders default agency logo", () => {
    const component = shallow(<AgencyLogo />);

    expect(component.find("img").prop("src")).to.equal(UnicefLogo);
    expect(component.find("img").prop("alt")).to.equal("unicef");
  });
});
