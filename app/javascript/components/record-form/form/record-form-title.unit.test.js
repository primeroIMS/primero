import { IconButton } from "@material-ui/core";
import MenuOpen from "@material-ui/icons/MenuOpen";

import { setupMountedComponent } from "../../../test";

import RecordFormTitle from "./record-form-title";

describe("<RecordFormTitle />", () => {
  const props = {
    displayText: "Test title",
    handleToggleNav: () => {},
    mobileDisplay: true
  };

  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(RecordFormTitle, props, {}));
  });

  it("renders a <IconButton />", () => {
    expect(component.find(IconButton)).to.have.lengthOf(1);
  });

  it("renders a <MenuOpen />", () => {
    expect(component.find(MenuOpen)).to.have.lengthOf(1);
  });

  it("renders a valid text passed as a prop", () => {
    expect(component.text()).to.be.equal("Test title");
  });
});
