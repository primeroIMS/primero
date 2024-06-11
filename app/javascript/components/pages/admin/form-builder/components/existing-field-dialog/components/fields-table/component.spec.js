// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { FieldRecord, FormSectionRecord } from "../../../../../../../form/records";
import { mapEntriesToRecord } from "../../../../../../../../libs";
import { mountedComponent, screen } from "../../../../../../../../test-utils";

import FieldsTable from "./component";

describe("<FieldsTable />", () => {
  const fields = {
    1: {
      id: 1,
      name: "field_1",
      display_name: { en: "Field 1 " },
      form_section_id: 1
    },
    2: {
      id: 2,
      name: "field_2",
      display_name: { en: "Field 10 " },
      form_section_id: 1
    },
    3: {
      id: 3,
      name: "field_3",
      display_name: { en: "Field 3 " },
      form_section_id: 2
    },
    4: {
      id: 4,
      name: "field_4",
      display_name: { en: "Field 4 " },
      form_section_id: 3
    }
  };
  const formSections = {
    1: {
      id: 1,
      unique_id: "form_1",
      parent_form: "parent",
      module_ids: ["module-1"],
      fields: [1, 2]
    },
    2: {
      id: 2,
      unique_id: "form_2",
      parent_form: "parent",
      module_ids: ["module-1"],
      fields: [3]
    },
    3: {
      id: 3,
      unique_id: "form_3",
      parent_form: "parent",
      module_ids: ["module-2"],
      fields: [4]
    }
  };
  const selectedFields = [
    {
      id: 1,
      name: "field_1",
      display_name: { en: "Field 1" }
    },
    {
      id: 3,
      name: "field_3",
      display_name: { en: "Field 3" }
    }
  ];

  const initialState = fromJS({
    ui: { dialogs: { admin_fields_dialog: true } },
    records: {
      admin: {
        forms: {
          formSections: mapEntriesToRecord(formSections, FormSectionRecord),
          fields: mapEntriesToRecord(fields, FieldRecord)
        }
      }
    }
  });

  const props = {
    fieldQuery: "",
    parentForm: "parent",
    primeroModule: "module-1",
    addField: () => {},
    removeField: () => {}
  };

  it("should render the table", () => {
    mountedComponent(<FieldsTable {...props} />, initialState);

    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("should render only those record that match the query", () => {
    mountedComponent(<FieldsTable {...{ ...props, fieldQuery: "Field 1" }} />, initialState);

    expect(screen.getAllByText(/Field 1.*/i)).toHaveLength(2);
  });

  it("should select the rows for the selected fields", () => {
    mountedComponent(<FieldsTable {...{ ...props, selectedFields }} />, initialState);

    expect(document.getElementsByClassName("mui-row-selected")).toHaveLength(2);
  });
});
