// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { SUBFORM_SECTION, SELECT_FIELD } from "../../../../../form";

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
    mountedComponent(<FieldDialog mode="edit" />, state);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should render the FieldList if selectedField is subform", () => {
    mountedComponent(<FieldDialog mode="edit" />, state);
    expect(screen.getAllByTestId("form-fields")).toHaveLength(1);
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
      mountedComponent(<FieldDialog mode="new" />, initialStateNewMode);
      expect(screen.getByText("fields.add_field_type")).toBeInTheDocument();
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
      const props = { mode: "edit", formId: "field-dialog-form" };

      mountedComponent(<FieldDialog {...props} />, initialStateSelectField);
      expect(screen.getByText("fields.edit_label")).toBeInTheDocument();
      expect(screen.getAllByTestId("orderable-options-field")).toBeTruthy();
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
      const props = { mode: "edit", formId: "5" };

      mountedComponent(<FieldDialog {...props} />, initialStateEditMode);

      expect(screen.getByText("fields.copy_from_another_form")).toBeInTheDocument();
    });

    it("should not render text saying the field was copied from another form", () => {
      const props = { mode: "edit", formId: "1" };

      mountedComponent(<FieldDialog {...props} />, initialStateEditMode);

      expect(screen.queryByText("fields.copy_from_another_form")).not.toBeInTheDocument();
    });
  });
});
