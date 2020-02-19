import { expect } from "chai";
import { FormControlLabel, Checkbox } from "@material-ui/core";

import { setupMountedComponent } from "../../../../../test";

import TransferCheckbox from "./transfer-checkbox";

describe("<TransferCheckbox />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(TransferCheckbox, {
      checked: false,
      onChange: () => {},
      label: "Test Label",
      disabled: false
    }));
  });

  it("renders FormControlLabel", () => {
    expect(component.find(FormControlLabel)).to.have.length(1);
  });

  it("renders Checkbox", () => {
    expect(component.find(Checkbox)).to.have.length(1);
  });
});
