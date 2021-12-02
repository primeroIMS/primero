import { fromJS } from "immutable";

import ActionButton from "../../../action-button";
import { setupMountedComponent } from "../../../../test";

import PasswordResetForm from "./component";

describe("<PasswordResetForm />", () => {
  it("does not render action buttons when modal is true", () => {
    const { component } = setupMountedComponent(PasswordResetForm, { modal: true }, fromJS({}));

    expect(component.find(ActionButton)).to.have.lengthOf(0);
  });

  it("renders action buttons when modal is false", () => {
    const { component } = setupMountedComponent(PasswordResetForm, { modal: false }, fromJS({}));

    expect(component.find(ActionButton)).to.have.lengthOf(2);
  });
});
