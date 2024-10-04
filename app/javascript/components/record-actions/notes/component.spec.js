// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../test-utils";
import { FormSectionRecord } from "../../form";
import { FieldRecord } from "../../record-form";

import Notes from "./component";

describe("<Notes />", () => {
  const initialState = fromJS({
    forms: {
      formSections: {
        1: FormSectionRecord({
          id: 1,
          unique_id: "notes_form",
          name: { en: "Notes Form" },
          visible: true,
          is_first_tab: true,
          order: 20,
          order_form_group: 10,
          parent_form: "case",
          editable: true,
          module_ids: ["primeromodule-pm"],
          form_group_id: "notes",
          form_group_name: { en: "Notes" },
          fields: [1],
          is_nested: false,
          subform_prevent_item_removal: false
        }),
        2: FormSectionRecord({
          id: 2,
          unique_id: "nested_notes_form",
          name: { en: "Nested Notes Form" },
          visible: false,
          is_first_tab: true,
          order: 10,
          order_form_group: 10,
          parent_form: "case",
          editable: true,
          module_ids: ["primeromodule-pm"],
          form_group_id: "nested_notes",
          form_group_name: { en: "Nested Notes" },
          fields: [2, 3, 4, 5],
          is_nested: true,
          subform_prevent_item_removal: false
        })
      },
      fields: {
        1: FieldRecord({
          id: 1,
          name: "notes_section",
          visible: true,
          type: "subform",
          display_text: { en: "Notes Section Field" },
          subform_section_id: 2
        }),
        2: FieldRecord({
          id: 2,
          name: "note_date",
          visible: true,
          type: "date_field",
          display_name: { en: "Date" }
        }),
        3: FieldRecord({
          id: 3,
          name: "note_subject",
          visible: true,
          type: "text_field",
          display_name: { en: "Subject" }
        }),
        4: FieldRecord({
          id: 4,
          name: "note_created_by",
          visible: true,
          type: "text_field",
          display_name: { en: "Manager" }
        }),
        5: FieldRecord({
          id: 5,
          name: "note_text",
          visible: true,
          type: "text_field",
          display_name: { en: "Notes" }
        })
      }
    }
  });

  const props = {
    open: true,
    recordType: "cases",
    primeroModule: "primeromodule-pm",
    setPending: () => {},
    pending: false
  };

  it("renders Notes form", () => {
    mountedComponent(<Notes {...props} />, initialState);

    expect(screen.getByRole("textbox", { name: "Subject" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Notes" })).toBeInTheDocument();
  });

  it("does not render the note_date and note_created_by fields", () => {
    mountedComponent(<Notes {...props} />, initialState);

    expect(screen.queryByText("Date")).not.toBeInTheDocument();
    expect(screen.queryByText("Manager")).not.toBeInTheDocument();
  });
});
