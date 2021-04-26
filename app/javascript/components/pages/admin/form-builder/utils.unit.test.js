import { fromJS } from "immutable";

import { translateOptions } from "../../../../test";
import { SAVE_METHODS } from "../../../../config";

import * as utils from "./utils";

describe("<FormBuilder /> - utils", () => {
  describe("convertToFieldsObject", () => {
    it("should return the fields as a single object", () => {
      const fields = [
        { name: "field_1", visible: false },
        { name: "field_2", visible: true }
      ];
      const expected = {
        field_1: { name: "field_1", visible: false },
        field_2: { name: "field_2", visible: true }
      };

      expect(utils.convertToFieldsObject(fields)).to.deep.equal(expected);
    });
  });

  describe("convertToFieldsArray", () => {
    it("should return the fields as an array", () => {
      const fields = {
        field_1: { name: "field_1", visible: false },
        field_2: { name: "field_2", visible: true }
      };

      const expected = [
        { name: "field_1", visible: false },
        { name: "field_2", visible: true }
      ];

      expect(utils.convertToFieldsArray(fields)).to.deep.equal(expected);
    });
  });

  describe("getOrderDirection", () => {
    it("should return the difference of order values", () => {
      expect(utils.getOrderDirection(1, 4)).to.equal(3);
    });
  });

  describe("affectedOrderRange", () => {
    describe("order is greater than current order", () => {
      it("should return the range of orders to be changed", () => {
        expect(utils.affectedOrderRange(1, 4)).to.deep.equal([1, 2, 3, 4]);
      });
    });

    describe("order is less than current order", () => {
      it("should return the range of orders to be changed", () => {
        expect(utils.affectedOrderRange(4, 2)).to.deep.equal([2, 3, 4]);
      });
    });

    describe("order is equal to current order", () => {
      it("should return an empty range of orders to be changed", () => {
        expect(utils.affectedOrderRange(2, 2)).to.deep.equal([]);
      });
    });
  });

  describe("buildOrderUpdater", () => {
    describe("order is greater than current order", () => {
      it("should return a function to decrease the order", () => {
        const orderUpdater = utils.buildOrderUpdater(1, 4);
        const currentOrder = fromJS({ order: 1 });
        const expectedOrder = fromJS({ order: 0 });

        expect(orderUpdater(currentOrder)).to.deep.equal(expectedOrder);
      });
    });

    describe("order is less than current order", () => {
      it("should increase the order", () => {
        const orderUpdater = utils.buildOrderUpdater(4, 1);
        const currentOrder = fromJS({ order: 1 });
        const expectedOrder = fromJS({ order: 2 });

        expect(orderUpdater(currentOrder)).to.deep.equal(expectedOrder);
      });
    });
  });

  describe("getFormRequestPath", () => {
    it("should return the correct path", () => {
      expect(utils.getFormRequestPath(1, SAVE_METHODS.update)).to.equal("forms/1");
    });
  });

  describe("getSubformErrorMessages", () => {
    it("should return an array of translated error messages", () => {
      const translations = {
        en: {
          "errors.models.form_section.unique_id": "The unique id '%{unique_id}' is already taken."
        }
      };
      const i18n = { t: (value, options) => translateOptions(value, options, translations) };
      const subformServerErrors = fromJS([
        {
          errors: [
            {
              status: 422,
              resource: "/api/v2/forms",
              detail: "unique_id",
              message: ["errors.models.form_section.unique_id"],
              value: "new_subform_1"
            },
            {
              status: 500,
              resource: "/api/v2/forms/1733",
              message: "Internal Server Error"
            }
          ]
        }
      ]);
      const expected = fromJS(["The unique id 'new_subform_1' is already taken.", "Internal Server Error"]);

      expect(utils.getSubformErrorMessages(subformServerErrors, i18n)).to.deep.equal(expected);
    });
  });

  describe("getLookupFormGroup", () => {
    it("should return the correct LookupFormGroup", () => {
      const formGroupCpCase = {
        id: 1,
        unique_id: "lookup-form-group-cp-case",
        name: {
          en: "Form Groups - CP Case"
        },
        values: [
          {
            id: "group_1",
            disabled: false,
            display_text: {
              en: "Group 1"
            }
          },
          {
            id: "group_2",
            disabled: false,
            display_text: {
              en: "Group 2"
            }
          }
        ]
      };
      const allFormGroupsLookups = [
        formGroupCpCase,
        {
          id: 2,
          unique_id: "lookup-nationality",
          name: {
            en: "Form Groups - CP Case"
          },
          values: [
            {
              id: "nationality_1",
              disabled: false,
              display_text: {
                en: "Nationality 1"
              }
            },
            {
              id: "nationality_2",
              disabled: false,
              display_text: {
                en: "Nationality 2"
              }
            }
          ]
        }
      ];

      expect(utils.getLookupFormGroup(allFormGroupsLookups, "primeromodule-cp", "case")).to.be.equal(formGroupCpCase);
    });

    it("returns empty object if missing parent form and module", () => {
      expect(utils.getLookupFormGroup()).to.deep.equal({});
    });
  });

  describe("formGroupsOptions", () => {
    it("should return the correct formGroupsOptions", () => {
      const formGroupCpCase = {
        id: 1,
        unique_id: "lookup-form-group-cp-case",
        name: {
          en: "Form Groups - CP Case"
        },
        values: [
          {
            id: "group_1",
            disabled: false,
            display_text: "Group 1"
          },
          {
            id: "group_2",
            disabled: false,
            display_text: "Group 2"
          }
        ]
      };
      const allFormGroupsLookups = [
        formGroupCpCase,
        {
          id: 2,
          unique_id: "lookup-nationality",
          name: {
            en: "Form Groups - CP Case"
          },
          values: [
            {
              id: "nationality_1",
              disabled: false,
              display_text: "Nationality 1"
            },
            {
              id: "nationality_2",
              disabled: false,
              display_text: "Nationality 2"
            }
          ]
        }
      ];

      const result = [
        { id: "group_1", display_text: "Group 1" },
        { id: "group_2", display_text: "Group 2" }
      ];

      expect(utils.formGroupsOptions(allFormGroupsLookups, "primeromodule-cp", "case", { locale: "en" })).to.deep.equal(
        result
      );
    });
  });
});
