import { object } from "yup";

import { SUBFORM_SECTION, TEXT_FIELD } from "../constants";

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
  });
});
