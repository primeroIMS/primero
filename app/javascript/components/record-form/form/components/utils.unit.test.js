import * as utils from "./utils";

describe("<RecordForm>/form/components - utils", () => {
  describe("removeEmptyArrays", () => {
    it("removes empty arrays from object", () => {
      const current = {
        field1: "value field1",
        field2: [],
        field3: [{ subfield1: "value subfield1" }]
      };
      const expected = {
        field1: "value field1",
        field3: [{ subfield1: "value subfield1" }]
      };

      expect(utils.removeEmptyArrays(current)).to.deep.equal(expected);
    });
  });
});
