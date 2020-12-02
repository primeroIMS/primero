import { fromJS } from "immutable";

import { FormSection, FormSectionField } from "../../../form";
import { setupMountedComponent } from "../../../../test";

import PasswordResetDialog from "./component";

describe("login/components/<PasswordResetDialog />", () => {
  let component;

  before(() => {
    component = setupMountedComponent(PasswordResetDialog, { open: true }, fromJS({})).component;
  });

  it("should render the password_reset_form", () => {
    expect(component.find(FormSection)).to.have.lengthOf(1);
    expect(component.find(FormSectionField)).to.have.lengthOf(1);
  });
});
