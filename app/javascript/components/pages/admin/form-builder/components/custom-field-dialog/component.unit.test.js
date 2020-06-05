import { setupMountedComponent } from "../../../../../../test";
import ActionDialog from "../../../../../action-dialog";
import { FormAction } from "../../../../../form";

import CustomFieldDialog from "./component";

describe("<CustomFieldDialog />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(CustomFieldDialog, {}, {}));
  });

  it("should render the CustomFieldDialog component", () => {
    expect(component.find(CustomFieldDialog)).to.have.lengthOf(1);
    expect(component.find(FormAction)).to.have.lengthOf(1);
    expect(component.find(ActionDialog)).to.have.lengthOf(1);
  });
});
