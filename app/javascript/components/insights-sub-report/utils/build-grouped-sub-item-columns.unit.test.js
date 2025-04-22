// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import buildGroupedSubItemColumns from "./build-grouped-sub-item-columns";

describe("<InsightsSubReport />/utils/buildGroupedSubItemColumns", () => {
  describe("when subItems is not present in columns", () => {
    it("return subitems object", () => {
      const columns = [
        {
          label: "2021",
          items: ["Q2", "Q3", "Q4"],
          subItems: null,
          colspan: 3
        },
        {
          label: "2022",
          items: ["Q1", "Q2"],
          subItems: null,
          colspan: 2
        }
      ];
      const result = buildGroupedSubItemColumns(columns);
      const expected = {};

      expect(result).toEqual(expected);
    });
  });

  describe("when subItems is present in columns", () => {
    it("return subitems object", () => {
      const columns = [
        {
          label: "2021",
          items: ["Q4"],
          subItems: ["boys", "girls", "total"],
          colspan: 12
        },
        {
          label: "2022",
          items: ["Q1", "Q2"],
          subItems: ["boys", "girls", "total"],
          colspan: 8
        }
      ];
      const result = buildGroupedSubItemColumns(columns);
      const expected = {
        "2021-Q4": ["boys", "girls", "total"],
        "2022-Q1": ["boys", "girls", "total"],
        "2022-Q2": ["boys", "girls", "total"]
      };

      expect(result).toEqual(expected);
    });
  });
});
