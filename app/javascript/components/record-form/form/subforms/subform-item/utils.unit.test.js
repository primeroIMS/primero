// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { FormSectionRecord, FieldRecord } from "../../../records";

import * as helpers from "./utils";

describe("<SubformItem /> - utils", () => {
  describe("Verifying utils", () => {
    it("should have known utils", () => {
      const clonedHelpers = { ...helpers };

      ["buildFormViolations"].forEach(property => {
        expect(clonedHelpers).toHaveProperty(property);
        delete clonedHelpers[property];
      });

      expect(clonedHelpers).toEqual({});
    });
  });

  describe("buildFormViolations", () => {
    const violationFields = {
      name: "violationField",
      subform_section_id: {
        fields: [{ name: "violation_tally" }, { name: "test_field" }, { name: "second_test_field" }]
      }
    };
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
        name: "violationField",
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

      // TODO: Certain records all of a sudden require toJS
      expect(result.toJS()).toEqual(expected.toJS());
    });

    describe("When is denial_humanitarian_access field", () => {
      const violationDenialHumanitarianAccess = {
        name: "denial_humanitarian_access",
        subform_section_id: {
          fields: [
            { name: "violation_tally" },
            { name: "test_field" },
            { name: "second_test_field" },
            { name: "violation_tally_estimated" }
          ]
        }
      };
      const formsDenialHumanitarianAccess = fromJS({
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

      it("should return a form with specific order", () => {
        const result = helpers.buildFormViolations(violationDenialHumanitarianAccess, formsDenialHumanitarianAccess);

        const expected = ["violation_tally", "violation_tally_estimated", "test_field", "second_test_field"];

        expect(result.subform_section_id.fields.map(field => field.name)).toEqual(expected);
      });
    });
  });
});
