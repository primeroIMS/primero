import { Box, Fab } from "@material-ui/core";

import { setupMountedComponent } from "../../../../../test";

import SubformEmptyData from "./component";

describe("<SubformEmptyData />", () => {
  let component;

  const props = {
    handleClick: () => {},
    i18n: { t: value => value },
    mode: { isEdit: true },
    subformName: "Test"
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(SubformEmptyData, props, {}));
  });

  it("should render the Box component", () => {
    expect(component.find(Box)).to.have.lengthOf(1);
  });

  it("should render the Fab component", () => {
    expect(component.find(Fab)).to.have.lengthOf(1);
  });
});
