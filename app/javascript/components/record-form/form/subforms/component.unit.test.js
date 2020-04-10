import { expect, setupMountedComponent } from "../../../../test";
import { RECORD_TYPES } from "../../../../config";
import { TEXT_FIELD_NAME } from "../constants";

import SubformField from "./component";

describe("<SubformField />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(
      SubformField,
      {
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
        mode: { isShow: true }
      },
      {},
      [],
      { initialValues: { section_1: [{ field_1: "test" }] } }
    ));
  });

  it("should render the subform field", () => {
    expect(component.find(SubformField)).to.have.lengthOf(1);
  });
});
