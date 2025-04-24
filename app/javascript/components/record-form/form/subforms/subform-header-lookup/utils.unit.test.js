// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as utils from "./utils";

describe("subform-header-lookup/utils.js", () => {
  describe("with exposed properties", () => {
    it("should have known methods", () => {
      const clone = { ...utils };

      ["getMultiSelectValues", "buildAssociatedViolationsLabels"].forEach(property => {
        expect(clone).toHaveProperty(property);
        expect(clone[property]).toBeInstanceOf(Function);
        delete clone[property];
      });
      expect(Object.keys(clone)).toHaveLength(0);
    });
  });

  describe("getMultiSelectValues", () => {
    const values = ["test_1", "test_2"];

    it("returns correct display_text when source contains a locale", () => {
      const source = [
        {
          id: "test_1",
          display_text: {
            en: "Test 1"
          }
        },
        {
          id: "test_2",
          display_text: {
            en: "Test 2"
          }
        },
        {
          id: "test_3",
          display_text: {
            en: "Test 2"
          }
        }
      ];

      expect(utils.getMultiSelectValues(values, source, "en")).toBe("Test 1, Test 2");
    });

    it("returns correct display_text when source does not contains a locale", () => {
      const source = [
        {
          id: "test_1",
          display_text: "Test 1"
        },
        {
          id: "test_2",
          display_text: "Test 2"
        },
        {
          id: "test_3",
          display_text: "Test 2"
        }
      ];

      expect(utils.getMultiSelectValues(values, source)).toBe("Test 1, Test 2");
    });

    it("returns empty string when values does exist in the source", () => {
      const source = [
        {
          id: "test_1",
          display_text: "Test 1"
        },
        {
          id: "test_2",
          display_text: "Test 2"
        }
      ];

      const randomValues = ["random_value"];

      expect(utils.getMultiSelectValues(randomValues, source)).toBe("");
    });
  });

  describe("buildAssociatedViolationsLabels", () => {
    it("return vioaltion name", () => {
      const associatedViolations = {
        killing: ["1"],
        maiming: ["2", "3"],
        denials: ["5", "6", "7"]
      };

      expect(utils.buildAssociatedViolationsLabels(associatedViolations, "7")).toBe("denials");
    });

    it("return null if get an empty associatedViolations", () => {
      expect(utils.buildAssociatedViolationsLabels({}, "7")).toBeNull();
    });
  });
});
