// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import removeTotalKeys from "./remove-total-keys";

describe("<Report /> - utils", () => {
  describe("removeTotalKeys", () => {
    it("removes the total keys", () => {
      expect(
        removeTotalKeys("total", {
          prop1: { prop11: { total: 1 }, prop12: { total: 1 }, total: 2 }
        })
      ).toEqual([["prop1", "prop11"], ["prop1", "prop12"], ["prop1"]]);
    });
  });
});
