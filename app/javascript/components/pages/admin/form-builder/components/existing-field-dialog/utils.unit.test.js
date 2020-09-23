import { fromJS } from "immutable";

import * as utils from "./utils";

describe("<FormBuilder />/components/<ExistingFieldDialog /> - utils", () => {
  describe("isFieldInList", () => {
    const fieldList = [
      { id: 1, name: "field_1" },
      { id: 2, name: "field_2" },
      { id: 3, name: "field_3" }
    ];

    it("returns true if the field is the list", () => {
      const field2 = { id: 2, name: "field_2" };

      expect(utils.isFieldInList(field2, fieldList)).to.be.true;
    });

    it("returns false if the field is not the list", () => {
      const field5 = { id: 5, name: "field_5" };

      expect(utils.isFieldInList(field5, fieldList)).to.be.false;
    });
  });

  describe("buildSelectedFieldList", () => {
    const fieldList = [
      { id: 1, name: "field_1", display_name: { en: "Field 1" } },
      { id: 2, name: "field_2", display_name: { en: "Field 2" } },
      { id: 3, name: "field_3", display_name: { en: "Field 3" } }
    ];
    const selectedFields = fromJS(fieldList);

    it("should return a plain list of fields", () => {
      const expectedList = [
        { id: 1, name: "field_1" },
        { id: 2, name: "field_2" },
        { id: 3, name: "field_3" }
      ];

      expect(utils.buildSelectedFieldList(selectedFields)).to.deep.equal(expectedList);
    });
  });

  describe("buildExistingFields", () => {
    const selectedFieldList = [
      { id: 1, name: "field_1" },
      { id: 2, name: "field_2" },
      { id: 3, name: "field_3" }
    ];

    it("should return a list with the added fields", () => {
      const addedFields = [{ id: 4, name: "field_4" }];
      const removedFields = [];

      expect(utils.buildExistingFields(selectedFieldList, addedFields, removedFields)).to.deep.equal(
        selectedFieldList.concat(addedFields)
      );
    });

    it("should return a list without the removed fields", () => {
      const addedFields = [];
      const removedFields = [{ id: 3, name: "field_3" }];

      const expectedList = [
        { id: 1, name: "field_1" },
        { id: 2, name: "field_2" }
      ];

      expect(utils.buildExistingFields(selectedFieldList, addedFields, removedFields)).to.deep.equal(expectedList);
    });
  });

  describe("getExistingFieldNames", () => {
    const selectedFieldList = [
      { id: 1, name: "field_1" },
      { id: 2, name: "field_2" },
      { id: 3, name: "field_3" }
    ];

    it("should return a list of names", () => {
      const expectedList = ["field_1", "field_2", "field_3"];

      expect(utils.getExistingFieldNames(selectedFieldList)).to.deep.equal(expectedList);
    });
  });

  describe("removeFieldFromList", () => {
    const selectedFieldList = [
      { id: 1, name: "field_1" },
      { id: 2, name: "field_2" },
      { id: 3, name: "field_3" }
    ];

    it("should return a list without the removed field", () => {
      const removedField = { id: 2, name: "field_2" };
      const expectedList = [
        { id: 1, name: "field_1" },
        { id: 3, name: "field_3" }
      ];

      expect(utils.removeFieldFromList(removedField, selectedFieldList)).to.deep.equal(expectedList);
    });
  });
});
