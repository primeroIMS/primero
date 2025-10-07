// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { getSubColumnItems } from ".";

describe("getSubcolumnItems", () => {
  describe("when subColumnLookups is defined", () => {
    it("returns the lookup values", () => {
      const lookupValues = [{ id: "value1", display_text: "Value 1" }];
      const subcolumns = getSubColumnItems({
        hasTotalColumn: false,
        subColumnLookups: { indicator: lookupValues },
        indicatorSubColumnKeys: [],
        valueKey: "indicator"
      });

      expect(subcolumns).toEqual(lookupValues);
    });
  });

  describe("when ageRanges is defined", () => {
    it("returns the age ranges", () => {});
  });

  describe("when indicatorSubcolumns is defined", () => {});

  describe("when hasTotalCoumn", () => {});

  describe("when indicatorSubColumnKeys is defined", () => {
    it("return all keys even if they don't have lookup values", () => {
      const lookupValues = [{ id: "value1", display_text: "Value 1" }];
      const subcolumns = getSubColumnItems({
        hasTotalColumn: false,
        subColumnLookups: { indicator: lookupValues },
        indicatorSubColumnKeys: ["value1", "value2"],
        valueKey: "indicator"
      });

      expect(subcolumns).toEqual([...lookupValues, { id: "value2", display_text: "value2" }]);
    });
  });
});
