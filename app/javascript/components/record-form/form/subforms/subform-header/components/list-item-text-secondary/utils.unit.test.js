// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { buildAssociatedViolationsKeys } from "./utils";

describe("buildCollapsedFields", () => {
  describe("when field is not individual_victims", () => {
    it("should return null", () => {
      const result = buildAssociatedViolationsKeys({}, []);

      expect(result).toEqual([]);
    });
  });

  describe("when field is individual_victims", () => {
    it("should return the values for subform", () => {
      const result = buildAssociatedViolationsKeys(
        {
          killing: [1],
          maiming: [2, 3],
          denials: [5, 6, 7]
        },
        [1, 3]
      );

      expect(result).toEqual(["killing", "maiming"]);
    });
  });
});
