import { expect } from "chai";
import { object } from "yup";

import { SELECT_FIELD, SUBFORM_SECTION, TEXT_FIELD } from "../constants";

import * as validations from "./validations";

describe("<RecordForm>/form/validations", () => {
  describe("fieldValidations", () => {
    context("when the field is a subform with required fields", () => {
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

      const schema = object().shape(validations.fieldValidations(subformField, i18n));

      context("when the required field is present", () => {
        it("should be valid", () => {
          const formData = { subform_1: [{ field_1: "Person 1" }] };

          expect(schema.isValidSync(formData)).to.be.true;
        });
      });

      context("when the required field is not present", () => {
        it("should be invalid", () => {
          const formData = { subform_1: [{}] };

          expect(schema.isValidSync(formData)).to.be.false;
        });

        it("should be valid if the subform will be destroyed", () => {
          const formData = { subform_1: [{ _destroy: true }] };

          expect(schema.isValidSync(formData)).to.be.true;
        });
      });

      context("when there are invalid subforms", () => {
        it("should be invalid and return the information of the fields that failed", () => {
          const formData = { subform_1: [{ _destroy: true }, {}, { field_1: "Person 1" }] };

          try {
            schema.validateSync(formData);
            expect.fail("This should be invalid");
          } catch (e) {
            expect(e.path).to.equals("subform_1[1].field_1");
          }
        });
      });
    });

    context("when the field is a multi select", () => {
      context("when it is required", () => {
        const i18n = { t: value => value, locale: "en" };

        const selectField = {
          name: "cities",
          display_name: { en: "Cities" },
          type: SELECT_FIELD,
          multi_select: true,
          required: true
        };

        it("should not be valid if it is empty", () => {
          const schema = object().shape(validations.fieldValidations({ ...selectField, required: true }, i18n));
          const formData = { cities: [] };

          expect(schema.isValidSync(formData)).to.be.false;
        });

        it("should not be valid if it is null", () => {
          const schema = object().shape(validations.fieldValidations({ ...selectField, required: true }, i18n));
          const formData = { cities: null };

          expect(schema.isValidSync(formData)).to.be.false;
        });

        it("should not be valid if it is not present", () => {
          const schema = object().shape(validations.fieldValidations({ ...selectField, required: true }, i18n));
          const formData = {};

          expect(schema.isValidSync(formData)).to.be.false;
        });
      });

      context("when it is not required", () => {
        const i18n = { t: value => value, locale: "en" };

        const selectField = {
          name: "cities",
          display_name: { en: "Cities" },
          type: SELECT_FIELD,
          multi_select: true
        };

        it("should be valid if it is empty", () => {
          const schema = object().shape(validations.fieldValidations(selectField, i18n));
          const formData = { cities: [] };

          expect(schema.isValidSync(formData)).to.be.true;
        });

        it("should be valid if it is null", () => {
          const schema = object().shape(validations.fieldValidations(selectField, i18n));
          const formData = { cities: null };

          expect(schema.isValidSync(formData)).to.be.true;
        });

        it("should be valid if it is not present", () => {
          const schema = object().shape(validations.fieldValidations(selectField, i18n));
          const formData = {};

          expect(schema.isValidSync(formData)).to.be.true;
        });
      });
    });

    context("when the field is required ", () => {
      const i18n = { t: value => value, locale: "en" };

      const textField = {
        name: "first_name",
        display_name: { en: "First Name" },
        type: TEXT_FIELD,
        required: true
      };

      context("and the field is empty", () => {
        it("should be invalid if the field is visible", () => {
          const schema = object().shape(validations.fieldValidations(textField, i18n));
          const formData = { first_name: null };

          expect(schema.isValidSync(formData)).to.be.false;
        });

        it("should be valid if the field is not visible", () => {
          const schema = object().shape(validations.fieldValidations({ ...textField, visible: false }, i18n));
          const formData = { first_name: null };

          expect(schema.isValidSync(formData)).to.be.true;
        });
      });
    });
  });
});
