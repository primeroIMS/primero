import { fromJS } from "immutable";

import { FormSectionRecord, FieldRecord } from "../../../records";

import * as helpers from "./utils";

describe("<SubformItem /> - utils", () => {
  describe("Verifying utils", () => {
    it("should have known utils", () => {
      const clonedHelpers = { ...helpers };

      ["buildFormViolations"].forEach(property => {
        expect(clonedHelpers).to.have.property(property);
        delete clonedHelpers[property];
      });

      expect(clonedHelpers).to.deep.equal({});
    });
  });

  describe("buildFormViolations", () => {
    const violationFields = [{ name: "violation_tally" }, { name: "test_field" }, { name: "second_test_field" }];
    const forms = fromJS({
      formSections: {
        1: {
          id: 1,
          name: {
            en: "Form Section 1"
          },
          unique_id: "form_section_1",
          module_ids: ["some_module"],
          visible: true,
          is_nested: false,
          parent_form: "cases",
          fields: [1, 2, 3]
        }
      },
      fields: {
        1: {
          id: 1,
          name: "field_1",
          display_name: {
            en: "Field 1"
          },
          type: "text_field",
          required: true,
          visible: true
        },
        2: {
          id: 2,
          name: "field_2",
          display_name: {
            en: "Field 2"
          },
          type: "subform",
          visible: true
        }
      }
    });

    it("should return a form for violations", () => {
      const result = helpers.buildFormViolations(violationFields, forms);

      const expected = FieldRecord({
        subform_section_id: FormSectionRecord({
          fields: [
            {
              name: "violation_tally"
            },
            {
              name: "test_field"
            },
            {
              name: "second_test_field"
            }
          ]
        })
      });

      expect(result).to.deep.equal(expected);
    });
  });
});
