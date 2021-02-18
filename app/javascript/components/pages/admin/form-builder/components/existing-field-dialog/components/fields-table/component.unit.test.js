import { fromJS } from "immutable";
import MUIDataTable from "mui-datatables";

import { FieldRecord, FormSectionRecord } from "../../../../../../../form/records";
import { mapEntriesToRecord } from "../../../../../../../../libs";
import { setupMockFormComponent } from "../../../../../../../../test";

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
      id: 1,
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

  const state = fromJS({
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

  it("should render the table", () => {
    const { component } = setupMockFormComponent(FieldsTable, {
      props: {
        fieldQuery: "",
        parentForm: "parent",
        primeroModule: "module-1",
        addField: () => {},
        removeField: () => {}
      },
      state
    });

    expect(component.find(FieldsTable)).to.have.lengthOf(1);
    expect(component.find(FieldsTable).find(MUIDataTable).find("tbody").find("tr")).to.have.lengthOf(3);
  });

  it("should render only those record that match the query", () => {
    const { component } = setupMockFormComponent(FieldsTable, {
      props: {
        fieldQuery: "Field 1",
        parentForm: "parent",
        primeroModule: "module-1",
        addField: () => {},
        removeField: () => {}
      },
      state
    });

    expect(component.find(FieldsTable).find(MUIDataTable).find("tbody").find("tr")).to.have.lengthOf(2);
  });

  it("should select the rows for the selected fields", () => {
    const { component } = setupMockFormComponent(FieldsTable, {
      props: {
        fieldQuery: "",
        parentForm: "parent",
        primeroModule: "module-1",
        selectedFields,
        addField: () => {},
        removeField: () => {}
      },
      state
    });

    const selectedRows = [0, 2];

    expect(component.find(FieldsTable).find(MUIDataTable).props().options.rowsSelected).to.deep.equal(selectedRows);
  });
});
