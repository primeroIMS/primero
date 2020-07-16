import { setupMountedComponent } from "../../../../../test";
import NavGroup from "../nav-group";
import NavItem from "../nav-item";

import RecordInformation from "./component";

describe("<RecordInformation />", () => {
  let component;

  const props = {
    open: "record_information",
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

  it("renders a NavItem component />", () => {
    expect(component.find(NavGroup).find("ul").find(NavItem)).to.have.lengthOf(
      3
    );
  });
});
