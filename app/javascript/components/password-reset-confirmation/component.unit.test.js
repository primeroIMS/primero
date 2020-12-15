import { fromJS } from "immutable";

import { setupMountedComponent } from "../../test";
import ActionDialog from "../action-dialog";

import PasswordResetConfirmation from "./component";

describe("<PasswordResetConfirmation>", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(PasswordResetConfirmation, { open: true }, fromJS({})));
  });

  it("should render the ActionDialog", () => {
    expect(component.find(ActionDialog)).to.have.lengthOf(1);
  });

  it("should render the text", () => {
    expect(component.find(ActionDialog).find("p")).to.have.lengthOf(1);
  });
});
