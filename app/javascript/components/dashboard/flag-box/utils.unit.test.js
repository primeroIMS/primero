// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import * as utils from "./utils";

describe("components/dashboard/flag-box/utils.unit.test.js", () => {
  describe("with exposed properties", () => {
    it("should have known methods", () => {
      const clone = { ...utils };

      ["showId"].forEach(property => {
        expect(clone).toHaveProperty(property);
        expect(clone[property]).toBeInstanceOf(Function);
        delete clone[property];
      });
      expect(Object.keys(clone)).toHaveLength(0);
    });
  });

  describe("with showId", () => {
    it("should return false if any flagged is passed in", () => {
      expect(utils.showId()).toBe(false);
    });

    it("should return false if name prop contains less than 7 asterisks", () => {
      const flag = fromJS({
        name: "Test User"
      });

      expect(utils.showId(flag)).toBe(false);
    });

    it("should return true if name prop contains 7 asterisks", () => {
      const flag = fromJS({
        name: "*******"
      });

      expect(utils.showId(flag)).toBe(true);
    });

    it("should return true if flag's name is null", () => {
      const flag = fromJS({
        name: null
      });

      expect(utils.showId(flag)).toBe(true);
    });
  });
});
