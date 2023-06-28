import { getSubColumnItems } from ".";

describe("getSubcolumnItems", () => {
  describe("when subColumnLookups is defined", () => {
    it("returns the lookup values", () => {
      const lookupValues = [{ id: "value1", display_text: "Value 1" }];
      const subcolumns = getSubColumnItems({
        hasTotalColumn: false,
        subColumnLookups: { indicator: lookupValues },
        valueKey: "indicator"
      });

      expect(subcolumns).to.deep.equals(lookupValues);
    });
  });

  describe("when ageRanges is defined", () => {
    it("returns the age ranges", () => {});
  });

  describe("when indicatorSubcolumns is defined", () => {});

  describe("when hasTotalCoumn", () => {});
});
