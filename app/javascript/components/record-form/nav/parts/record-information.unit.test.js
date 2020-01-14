import { expect } from "chai";

import NavGroup from "../NavGroup";
import { setupMountedComponent } from "../../../../test";

import RecordInformation from "./record-information";

describe("<RecordInformation />", () => {
  let component;

  const props = {
    open: {},
    handleClick: () => {},
    selectedForm: ""
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(RecordInformation, props, {}));
  });

  it("renders a RecordInformation component />", () => {
    expect(component.find(RecordInformation)).to.have.lengthOf(1);
  });

  it("renders a NavGroup component />", () => {
    expect(component.find(NavGroup)).to.have.lengthOf(1);
  });
});
