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
    },
    records: {
      admin: {
        forms: {
          selectedSubformField: {}
        }
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
    expect(component.find(ActionButton).at(2).text()).to.equal("fields.add_existing_field");
  });

  describe("When is a called from a subform", () => {
    const initialStateSubform = {
      ui: {
        dialogs: {
          dialog: "custom_field_dialog",
          open: true
        }
      },
      records: {
        admin: {
          forms: {
            selectedSubformField: {
              id: 20,
              description: {
                en: "Family Details Subform"
              },
              unique_id: "family_details_section",
              type: "subform",
              fields: []
            }
          }
        }
      }
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(CustomFieldDialog, {}, initialStateSubform));
    });

    it("should render only 3 ActionButton", () => {
      const actionButtons = component.find(ActionButton);

      expect(component.find(CustomFieldDialog)).to.have.lengthOf(1);
      expect(actionButtons).to.have.lengthOf(3);
      expect(actionButtons.at(0).text()).to.equal("fields.add_field");
      expect(actionButtons.at(1).text()).to.equal("fields.add_new_field");
      expect(actionButtons.at(2).text()).to.not.equal("fields.add_existing_field");
      expect(actionButtons.at(2).text()).to.equal("buttons.cancel");
    });
  });
});
