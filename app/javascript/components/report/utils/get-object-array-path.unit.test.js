// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import getObjectArrayPath from "./get-object-array-path";

describe("<Report /> - utils", () => {
  describe("getObjectArrayPath", () => {
    it("should return all the keys for an object", () => {
      expect(getObjectArrayPath("total", { prop1: { total: 1 }, prop2: { total: 2 } })).toEqual([
        ["prop1", "total"],
        ["prop2", "total"],
        ["total"]
      ]);
    });

    it("should return all the keys for nested objects", () => {
      expect(
        getObjectArrayPath("total", {
          prop1: { prop11: { total: 1 }, prop12: { total: 1 }, total: 2 },
          prop2: { prop21: { total: 2 }, prop22: { total: 1 }, total: 3 }
        })
      ).toEqual([
        ["prop1", "prop11", "total"],
        ["prop1", "prop12", "total"],
        ["prop1", "total"],
        ["prop2", "prop21", "total"],
        ["prop2", "prop22", "total"],
        ["prop2", "total"],
        ["total"]
      ]);
    });
  });
});
