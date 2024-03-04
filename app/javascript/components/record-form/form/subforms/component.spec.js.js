import { mountedComponent, screen } from "../../../../test-utils";
import { RECORD_TYPES } from "../../../../config";
import { TEXT_FIELD_NAME } from "../constants";

import SubformField from "./component";

describe("<SubformField />", () => {
  const props = {
    form: { unique_id: "form_1" },
    field: {
      subform_section_id: {
        id: 1,
        name: {
          en: "Form Section 1"
        },
        unique_id: "form_section_1",
        module_ids: ["some_module"],
        visible: true,
        is_nested: false,
        parent_form: RECORD_TYPES.cases,
        collapsed_field_names: [],
        fields: [
          {
            id: 1,
            name: "field_1",
            display_name: {
              en: "Field 2"
            },
            type: TEXT_FIELD_NAME,
            visible: true
          }
        ]
      },
      name: "section_1",
      display_name: {
        en: "Section 1"
      }
    },
    mode: { isShow: true },
    formSection: {},
    forms: {},
    recordModuleID: "primeromodule-cp",
    recordType: "cases",
    parentTitle: "Parent Title",
    parentValues: {},
    violationOptions: [{ id: 1, display_text: "Test" }]
  };

  it("should render the subform field", () => {
    mountedComponent(<SubformField {...props} />, {}, [], {}, { initialValues: { section_1: [{ field_1: "test" }] } });
    expect(screen.getByTestId("subform-field-array")).toBeInTheDocument();
  });
});
