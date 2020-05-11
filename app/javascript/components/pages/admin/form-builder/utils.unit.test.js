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
});
