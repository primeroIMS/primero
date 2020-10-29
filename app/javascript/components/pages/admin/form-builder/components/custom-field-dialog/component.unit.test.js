import { setupMountedComponent } from "../../../../../../test";
import ActionDialog from "../../../../../action-dialog";
import ActionButton from "../../../../../action-button";
import CustomFieldSelectorDialog from "../custom-field-selector-dialog";

import CustomFieldDialog from "./component";

describe("<CustomFieldDialog />", () => {
  let component;
  const initialState = {
    ui: {
      dialogs: {
        dialog: "custom_field_dialog",
        open: true
      }
    }
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(CustomFieldDialog, {}, initialState));
  });

  it("should render the CustomFieldDialog component", () => {
    expect(component.find(CustomFieldDialog)).to.have.lengthOf(1);
    expect(component.find(ActionButton)).to.have.lengthOf(4);
    expect(component.find(ActionDialog)).to.have.lengthOf(2);
    expect(component.find(CustomFieldSelectorDialog)).to.have.lengthOf(1);
  });
});
