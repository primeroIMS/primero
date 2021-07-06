import getSelectFieldDefaultValue from "./get-select-field-default-value";

describe("getSelectFieldDefaultValue", () => {
  context("when the selectedDefaultValue is null", () => {
    it("should return the selected default value for multi_select", () => {
      expect(getSelectFieldDefaultValue({ multi_select: true }, null)).to.deep.equal([]);
    });

    it("should return the selected default value for single select", () => {
      expect(getSelectFieldDefaultValue({}, null)).to.be.null;
    });
  });
});
