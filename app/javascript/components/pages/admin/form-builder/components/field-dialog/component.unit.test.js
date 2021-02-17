import { fromJS } from "immutable";
import { DialogTitle } from "@material-ui/core";

import { setupMockFormComponent } from "../../../../../../test";
import { SUBFORM_SECTION, SELECT_FIELD } from "../../../../../form";
import OrderableOptionsField from "../../../../../form/fields/orderable-options-field";
import SwitchInput from "../../../../../form/fields/switch-input";
import DraggableOption from "../../../../../form/components/draggable-option";
import FieldsList from "../fields-list";

import FieldDialog from "./component";

describe("<FieldDialog />", () => {
  const state = fromJS({
    ui: { dialogs: { dialog: "admin_fields_dialog", open: true } },
    records: {
      admin: {
        forms: {
          selectedField: {
            name: "field_1",
            type: SUBFORM_SECTION,
            subform_section_id: 1,
            form_section_id: 1
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
    const { component } = setupMockFormComponent(FieldDialog, {
      props: { mode: "edit" },
      state
    });

    expect(component.find(FieldDialog)).to.have.lengthOf(1);
  });

  it("should render the FieldList if selectedField is subform", () => {
    const { component } = setupMockFormComponent(FieldDialog, {
      props: { mode: "edit" },
      state
    });

    expect(component.find(FieldsList)).to.have.lengthOf(1);
  });

  describe("when is new mode", () => {
    const initialStateNewMode = fromJS({
      ui: { dialogs: { dialog: "admin_fields_dialog", open: true } },
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
      const { component } = setupMockFormComponent(FieldDialog, {
        props: { mode: "new" },
        state: initialStateNewMode
      });

      expect(component.find(FieldDialog).find(DialogTitle).text()).to.equal(`fields.add_field_type`);
    });
  });

  describe("when is a SELECT_FIELD with option_strings_text", () => {
    const initialStateSelectField = fromJS({
      ui: { dialogs: { dialog: "admin_fields_dialog", open: true } },
      records: {
        admin: {
          forms: {
            selectedField: {
              multi_select: false,
              editable: true,
              guiding_questions: { en: "", fr: "", ar: "" },
              display_name: { en: "Recommendation", fr: "", ar: "" },
              date_validation: "default_date_validation",
              name: "best_interest_recommendation",
              help_text: { en: "", fr: "", ar: "" },
              order: 2,
              form_section_id: 7,
              visible: true,
              option_strings_text: [
                {
                  id: "medical",
                  disabled: false,
                  display_text: { ar: "", en: "Medical", fr: "fr3" }
                },
                {
                  id: "repatriation",
                  disabled: false,
                  display_text: { ar: "", en: "Repatriation", fr: "fr4" }
                },
                {
                  id: "reunification",
                  disabled: false,
                  display_text: { ar: "", en: "Reunification", fr: "fr6" }
                }
              ],
              type: SELECT_FIELD,
              id: 104,
              disabled: false
            }
          }
        }
      }
    });

    it("should render the FieldDialog with OrderableOptionsField", () => {
      const { component } = setupMockFormComponent(FieldDialog, {
        props: { mode: "edit", formId: "field-dialog-form" },
        state: initialStateSelectField
      });

      expect(component.find(FieldDialog)).to.have.lengthOf(1);
      expect(component.find(OrderableOptionsField)).to.have.lengthOf(1);
      expect(component.find(DraggableOption)).to.have.lengthOf(3);
      expect(component.find(FieldDialog).find(DialogTitle).text()).to.equal(`fields.edit_label`);
      expect(component.find(DraggableOption).find(SwitchInput)).to.have.lengthOf(3);
    });
  });

  describe("when is edit mode", () => {
    const initialStateEditMode = fromJS({
      ui: { dialogs: { dialog: "admin_fields_dialog", open: true } },
      records: {
        admin: {
          forms: {
            selectedField: {
              id: 1,
              name: "field_1",
              type: SELECT_FIELD,
              multi_select: true,
              form_section_id: 1
            }
          }
        }
      }
    });

    it("should render text saying the field was copied from another form", () => {
      const { component } = setupMockFormComponent(FieldDialog, {
        props: { mode: "edit", formId: "5" },
        state: initialStateEditMode
      });

      expect(component.find(FieldDialog).find("p").first().text()).to.equal("fields.copy_from_another_form");
    });

    it("should not render text saying the field was copied from another form", () => {
      const { component } = setupMockFormComponent(FieldDialog, {
        props: { mode: "edit", formId: "1" },
        state: initialStateEditMode
      });

      expect(component.find(FieldDialog).find("p").first().text()).to.not.equal("fields.copy_from_another_form");
    });
  });
});
