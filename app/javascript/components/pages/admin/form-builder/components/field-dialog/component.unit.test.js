import { fromJS } from "immutable";
import { DialogTitle } from "@material-ui/core";

import { setupMockFormComponent } from "../../../../../../test";
import { SUBFORM_SECTION, SELECT_FIELD } from "../../../../../form";
import FieldsList from "../fields-list";

import FieldDialog from "./component";

describe("<FieldDialog />", () => {
  const initialState = fromJS({
    ui: { dialogs: { admin_fields_dialog: true } },
    records: {
      admin: {
        forms: {
          selectedField: {
            name: "field_1",
            type: SUBFORM_SECTION,
            subform_section_id: 1
          },
          selectedFieldSubform: {
            id: 1,
            unique_id: "subform_1",
            fields: [
              {
                name: "sub_field_1",
                display_name: { en: "Subform Field 1" }
              }
            ]
          }
        }
      }
    }
  });

  it("should render the dialog", () => {
    const { component } = setupMockFormComponent(
      FieldDialog,
      { mode: "edit" },
      {},
      initialState
    );

    expect(component.find(FieldDialog)).to.have.lengthOf(1);
  });

  it("should render the FieldList if selectedField is subform", () => {
    const { component } = setupMockFormComponent(
      FieldDialog,
      { mode: "edit" },
      {},
      initialState
    );

    expect(component.find(FieldsList)).to.have.lengthOf(1);
  });

  describe("when is new mode", () => {
    const initialStateNewMode = fromJS({
      ui: { dialogs: { admin_fields_dialog: true } },
      records: {
        admin: {
          forms: {
            selectedField: {
              name: "field_1",
              type: SELECT_FIELD,
              multi_select: true
            }
          }
        }
      }
    });

    it("should render the dialog", () => {
      const { component } = setupMockFormComponent(
        FieldDialog,
        { mode: "new" },
        {},
        initialStateNewMode
      );

      expect(component.find(FieldDialog).find(DialogTitle).text()).to.equal(
        `fields.add_field_type`
      );
    });
  });
});
