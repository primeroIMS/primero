import { setupMountedComponent } from "../../../../../../test";
import ActionDialog from "../../../../../action-dialog";

import CustomFieldSelectorDialog from "./component";

describe("<CustomFieldSelectorDialog />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(CustomFieldSelectorDialog, {}, {}));
  });

  it("should render the CustomFieldSelectorDialog component", () => {
    expect(component.find(CustomFieldSelectorDialog)).to.have.lengthOf(1);
    expect(component.find(ActionDialog)).to.have.lengthOf(1);
  });
});
