// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { object } from "yup";

import { SELECT_FIELD, SUBFORM_SECTION, TEXT_FIELD, TALLY_FIELD } from "../constants";

import * as validations from "./validations";

describe("<RecordForm>/form/validations", () => {
  describe("fieldValidations", () => {
    describe("when the field is a subform with required fields", () => {
      const i18n = { t: value => value, locale: "en" };

      const subformField = {
        name: "subform_1",
        type: SUBFORM_SECTION,
        subform_section_id: {
          fields: [
            {
              name: "field_1",
              display_name: { en: "Field 1" },
              required: true,
              type: TEXT_FIELD
            }
          ]
        }
      };

      const subformField2 = {
        name: "subform_2",
        type: SUBFORM_SECTION,
        subform_section_id: {
          fields: [
            {
              name: "field_1",
              display_name: { en: "Field 1" },
              required: false,
              type: TEXT_FIELD
            },
            {
              name: "field_2",
              display_name: { en: "Field 1" },
              required: true,
              type: TEXT_FIELD,
              display_conditions_subform: { eq: { field_1: "test-value" } }
            }
          ]
        }
      };

      const schema = object().shape(validations.fieldValidations(subformField, { i18n, online: true }));
      const schema2 = object().shape(validations.fieldValidations(subformField2, { i18n, online: true }));

      describe("when the required field is present", () => {
        it("should be valid", () => {
          const formData = { subform_1: [{ field_1: "Person 1" }] };

          expect(schema.isValidSync(formData)).toBe(true);
        });
      });

      describe("when the required field is not present", () => {
        it("should be invalid", () => {
          const formData = { subform_1: [{}] };

          expect(schema.isValidSync(formData)).toBe(false);
        });

        it("should be valid if the subform will be destroyed", () => {
          const formData = { subform_1: [{ _destroy: true }] };

          expect(schema.isValidSync(formData)).toBe(true);
        });
      });

      describe("when there are invalid subforms", () => {
        it("should be invalid and return the information of the fields that failed", () => {
          const formData = { subform_1: [{ _destroy: true }, {}, { field_1: "Person 1" }] };

          try {
            schema.validateSync(formData);
            expect.fail("This should be invalid");
          } catch (e) {
            expect(e.path).toBe("subform_1[1].field_1");
          }
        });
      });

      describe("conditional subform fields", () => {
        it("not valid when condition met and no corresponding value", () => {
          const formData = { subform_2: [{ field_1: "test-value" }, {}] };

          expect(schema2.isValidSync(formData)).toBe(false);
        });

        it("valid when condition met and corresponding value", () => {
          const formData = { subform_2: [{}, { field_1: "test-value", field_2: "test-value-2" }] };

          expect(schema2.isValidSync(formData)).toBe(true);
        });

        it("valid when condition not met", () => {
          const formData = { subform_2: [{ field_1: "test-value-not-eq" }] };

          expect(schema2.isValidSync(formData)).toBe(true);
        });
      });
    });

    describe("when a subform is required", () => {
      const i18n = { t: value => value, locale: "en" };

      const subformField = {
        name: "subform_1",
        display_name: { en: "Subform 1" },
        type: SUBFORM_SECTION,
        required: true,
        subform_section_id: {
          fields: [
            {
              name: "field_1",
              display_name: { en: "Field 1" },
              required: true,
              type: TEXT_FIELD
            }
          ]
        }
      };

      const schema = object().shape(validations.fieldValidations(subformField, { i18n, online: true }));

      describe("when the required field is present", () => {
        it("should be valid", () => {
          const formData = { subform_1: [{ field_1: "Person 1" }] };

          expect(schema.isValidSync(formData)).toBe(true);
        });
      });

      describe("when the required field is not present", () => {
        it("should be invalid", () => {
          const formData = { subform_1: [{}] };

          expect(schema.isValidSync(formData)).toBe(false);
        });

        it("should be valid if the subform will be destroyed", () => {
          const formData = { subform_1: [{ _destroy: true }] };

          expect(schema.isValidSync(formData)).toBe(false);
        });

        it("should be valid if the subform will be destroyed and has other subforms", () => {
          const formData = { subform_1: [{ _destroy: true }, { field_1: "Person 1" }] };

          expect(schema.isValidSync(formData)).toBe(true);
        });
      });
    });

    describe("when the field is a multi select", () => {
      describe("when it is required", () => {
        const i18n = { t: value => value, locale: "en" };

        const selectField = {
          name: "cities",
          display_name: { en: "Cities" },
          type: SELECT_FIELD,
          multi_select: true,
          required: true
        };

        it("should not be valid if it is empty array", () => {
          const schema = object().shape(validations.fieldValidations({ ...selectField, required: true }, { i18n }));
          const formData = { cities: [] };

          expect(schema.isValidSync(formData)).toBe(false);
        });

        it("should not be valid if it is null or undefined", () => {
          const schema = object().shape(validations.fieldValidations({ ...selectField, required: true }, { i18n }));

          expect(schema.isValidSync({ cities: null })).toBe(false);
          expect(schema.isValidSync({ cities: undefined })).toBe(false);
          expect(schema.isValidSync({})).toBe(false);
        });

        it("should not be valid if it is not present", () => {
          const schema = object().shape(validations.fieldValidations({ ...selectField, required: true }, { i18n }));
          const formData = {};

          expect(schema.isValidSync(formData)).toBe(false);
        });

        describe("select with a display condition", () => {
          const selectFieldWithDisplayCondition = {
            name: "cities",
            display_name: { en: "Cities" },
            type: SELECT_FIELD,
            multi_select: true,
            required: true,
            display_conditions_record: {
              eq: { testField: 1 }
            }
          };

          it("should not validate", () => {
            const schema = object().shape(
              validations.fieldValidations({ ...selectFieldWithDisplayCondition, required: true }, { i18n })
            );
            const formData = {};

            expect(schema.isValidSync(formData)).toBe(true);
          });

          it("should validate", () => {
            const schema = object().shape(
              validations.fieldValidations({ ...selectFieldWithDisplayCondition, required: true }, { i18n })
            );
            const formData = { testField: 1 };

            expect(schema.isValidSync(formData)).toBe(false);
          });
        });
      });

      describe("when it is not required", () => {
        const i18n = { t: value => value, locale: "en" };

        const selectField = {
          name: "cities",
          display_name: { en: "Cities" },
          type: SELECT_FIELD,
          multi_select: true
        };

        it("should be valid if it is empty", () => {
          const schema = object().shape(validations.fieldValidations(selectField, { i18n }));
          const formData = { cities: [] };

          expect(schema.isValidSync(formData)).toBe(true);
        });

        it("should be valid if it is null", () => {
          const schema = object().shape(validations.fieldValidations(selectField, { i18n }));
          const formData = { cities: null };

          expect(schema.isValidSync(formData)).toBe(true);
        });

        it("should be valid if it is not present", () => {
          const schema = object().shape(validations.fieldValidations(selectField, { i18n }));
          const formData = {};

          expect(schema.isValidSync(formData)).toBe(true);
        });
      });
    });

    describe("when the field is required ", () => {
      const i18n = { t: value => value, locale: "en" };

      const textField = {
        name: "first_name",
        display_name: { en: "First Name" },
        type: TEXT_FIELD,
        required: true
      };

      describe("and the field is empty", () => {
        it("should be invalid if the field is visible", () => {
          const schema = object().shape(validations.fieldValidations(textField, { i18n }));
          const formData = { first_name: null };

          expect(schema.isValidSync(formData)).toBe(false);
        });

        it("should be valid if the field is not visible", () => {
          const schema = object().shape(validations.fieldValidations({ ...textField, visible: false }, { i18n }));
          const formData = { first_name: null };

          expect(schema.isValidSync(formData)).toBe(true);
        });
      });
    });

    describe("when the field is tally", () => {
      const i18n = { t: value => value, locale: "en" };
      const tallyField = {
        name: "tally_name",
        display_name: { en: "Tally Field" },
        type: TALLY_FIELD,
        tally: [
          { id: "test1", display_text: { en: "Test 1" } },
          { id: "test2", display_text: { en: "Test 2" } }
        ]
      };

      describe("and it is not required", () => {
        it("should be valid if it is empty", () => {
          const schema = object().shape(validations.fieldValidations(tallyField, { i18n }));
          const formData = { tally_name: {} };

          expect(schema.isValidSync(formData)).toBe(true);
        });
        it("should be valid if it the children's values are empty", () => {
          const schema = object().shape(validations.fieldValidations(tallyField, { i18n }));
          const formData = { tally_name: { test1: "" } };

          expect(schema.isValidSync(formData)).toBe(true);
        });
        it("should be valid if it at least one of its childrens have values", () => {
          const schema = object().shape(validations.fieldValidations({ ...tallyField }, { i18n }));
          const formData = { tally_name: { test1: 1, test2: "" } };

          expect(schema.isValidSync(formData)).toBe(true);
        });
      });

      describe("and it is required", () => {
        it("should not be valid if it is empty", () => {
          const schema = object().shape(validations.fieldValidations({ ...tallyField, required: true }, { i18n }));
          const formData = { tally_name: {} };

          expect(schema.isValidSync(formData)).toBe(false);
        });
        it("should NOT be valid if it the children's values are empty", () => {
          const schema = object().shape(validations.fieldValidations({ ...tallyField, required: true }, { i18n }));
          const formData = { tally_name: { test1: "", test2: "" } };

          expect(schema.isValidSync(formData)).toBe(false);
        });
        it("should be valid if it at least one of its childrens have values", () => {
          const schema = object().shape(validations.fieldValidations({ ...tallyField, required: true }, { i18n }));
          const formData = { tally_name: { test1: 1, test2: "" } };

          expect(schema.isValidSync(formData)).toBe(true);
        });
      });

      describe("and check min and max values", () => {
        it("should be invalid if one of its childrens have values not between min and max", () => {
          const schema = object().shape(validations.fieldValidations({ ...tallyField }, { i18n }));
          const formData = { tally_name: { test1: 1, test2: -2 } };

          expect(schema.isValidSync(formData)).toBe(false);
        });
        it("should be valid if one of its childrens have values between min and max", () => {
          const schema = object().shape(validations.fieldValidations({ ...tallyField }, { i18n }));
          const formData = { tally_name: { test1: 1, test2: 3 } };

          expect(schema.isValidSync(formData)).toBe(true);
        });
      });

      describe("and has conditions display", () => {
        const tallyFieldWithDisplayConditions = {
          ...tallyField,
          required: true,
          display_conditions_record: {
            or: [
              {
                in: {
                  violation_category: ["killing"]
                }
              },
              {
                in: {
                  violation_category: ["maiming"]
                }
              }
            ]
          }
        };

        it("should be invalid if field is empty and conditions make it required", () => {
          const schema = object().shape(validations.fieldValidations(tallyFieldWithDisplayConditions, { i18n }));
          const formData = { violation_category: ["killing"] };

          expect(schema.isValidSync(formData)).toBe(false);
        });

        it("should be valid if field is NOT empty and it is required by other field", () => {
          const schema = object().shape(validations.fieldValidations(tallyFieldWithDisplayConditions, { i18n }));
          const formData = { tally_name: { test1: 1, test2: 3 }, violation_category: ["killing"] };

          expect(schema.isValidSync(formData)).toBe(true);
        });

        it("should be valid if field is empty and conditions make it NOT required", () => {
          const schema = object().shape(validations.fieldValidations(tallyFieldWithDisplayConditions, { i18n }));
          const formData = { violation_category: ["test"] };

          expect(schema.isValidSync(formData)).toBe(true);
        });
      });

      describe("and display conditions are empty", () => {
        const tallyFieldWithDisplayConditions = {
          ...tallyField,
          required: true,
          display_conditions_record: {}
        };

        it("is invalid if field is empty", () => {
          const schema = object().shape(validations.fieldValidations(tallyFieldWithDisplayConditions, { i18n }));
          const formData = {};

          expect(schema.isValidSync(formData)).toBe(false);
        });
      });

      describe("and display conditions are disabled", () => {
        const tallyFieldWithDisplayConditions = {
          ...tallyField,
          required: true,
          display_conditions_record: { disabled: true }
        };

        it("is valid if is NOT empty", () => {
          const schema = object().shape(validations.fieldValidations(tallyFieldWithDisplayConditions, { i18n }));
          const formData = { tally_name: { test1: 1, test2: 3 } };

          expect(schema.isValidSync(formData)).toBe(true);
        });

        it("is not valid if is empty", () => {
          const schema = object().shape(validations.fieldValidations(tallyFieldWithDisplayConditions, { i18n }));
          const formData = {};

          expect(schema.isValidSync(formData)).toBe(false);
        });
      });
    });
  });
});
