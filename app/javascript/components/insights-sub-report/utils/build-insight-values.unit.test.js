// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import buildInsightValues from "./build-insight-values";

describe("<InsightsSubReport />/utils/buildInsightValues", () => {
  describe("when is not grouped", () => {
    it("returns one row for each option", () => {
      const values = buildInsightValues.default({
        getLookupValue: (_key, value) => value.get("id"),
        key: "key",
        data: fromJS([
          { id: "option_1", total: 5 },
          { id: "option_2", total: 10 }
        ])
      });

      expect(values).toEqual([
        { colspan: 0, row: ["option_1", 5] },
        { colspan: 0, row: ["option_2", 10] }
      ]);
    });
  });

  describe("when is grouped by year", () => {
    it("returns the rows for each group", () => {
      const values = buildInsightValues.default({
        getLookupValue: (_key, value) => value.get("id"),
        key: "key",
        isGrouped: true,
        groupedBy: "year",
        data: fromJS([
          {
            group_id: 2022,
            data: [
              { id: "option_1", total: 1 },
              { id: "option_2", total: 2 }
            ]
          },
          {
            group_id: 2023,
            data: [
              { id: "option_1", total: 3 },
              { id: "option_2", total: 1 }
            ]
          },
          {
            group_id: 2024,
            data: [
              { id: "option_2", total: 2 },
              { id: "option_3", total: 8 }
            ]
          }
        ])
      });

      expect(values).toEqual([
        { colspan: 0, row: ["option_1", 1, 3, 0] },
        { colspan: 0, row: ["option_2", 2, 1, 2] },
        { colspan: 0, row: ["option_3", 0, 0, 8] }
      ]);
    });

    it("returns the rows for each group in alphabetical order", () => {
      const values = buildInsightValues.default({
        getLookupValue: (_key, value) =>
          ({ option_1: "First Option", option_2: "Second Option", option_4: "Fourth Option" }[value.get("id")]),
        key: "key",
        isGrouped: true,
        groupedBy: "year",
        data: fromJS([
          {
            group_id: 2022,
            data: [
              { id: "option_1", total: 1 },
              { id: "option_2", total: 2 }
            ]
          },
          {
            group_id: 2023,
            data: [
              { id: "option_1", total: 3 },
              { id: "option_2", total: 1 }
            ]
          },
          {
            group_id: 2024,
            data: [
              { id: "option_2", total: 2 },
              { id: "option_4", total: 8 }
            ]
          }
        ])
      });

      expect(values).toEqual([
        { colspan: 0, row: ["First Option", 1, 3, 0] },
        { colspan: 0, row: ["Fourth Option", 0, 0, 8] },
        { colspan: 0, row: ["Second Option", 2, 1, 2] }
      ]);
    });

    it("returns the rows for each group in age range order", () => {
      const values = buildInsightValues.default({
        getLookupValue: (_key, value) => value.get("id"),
        key: "key",
        isGrouped: true,
        groupedBy: "year",
        ageRanges: ["0 - 5", "6 - 11", "12 - 17", "18+"],
        data: fromJS([
          {
            group_id: 2022,
            data: [
              { id: "0 - 5", total: 1 },
              { id: "12 - 17", total: 2 }
            ]
          },
          {
            group_id: 2023,
            data: [
              { id: "0 - 5", total: 3 },
              { id: "18+", total: 1 }
            ]
          },
          {
            group_id: 2024,
            data: [
              { id: "12 - 17", total: 2 },
              { id: "18+", total: 8 }
            ]
          }
        ])
      });

      expect(values).toEqual([
        { colspan: 0, row: ["0 - 5", 1, 3, 0] },
        { colspan: 0, row: ["12 - 17", 2, 0, 2] },
        { colspan: 0, row: ["18+", 0, 1, 8] }
      ]);
    });
  });

  describe("when is grouped by month", () => {
    it("returns the rows for each group", () => {
      const values = buildInsightValues.default({
        getLookupValue: (_key, value) => value.get("id"),
        key: "key",
        isGrouped: true,
        groupedBy: "month",
        data: fromJS([
          {
            group_id: "2021-10",
            data: [
              { id: "option_2", total: 3 },
              { id: "option_3", total: 5 }
            ]
          },
          {
            group_id: "2021-12",
            data: [{ id: "option_2", total: 4 }]
          },
          {
            group_id: "2022-01",
            data: [
              { id: "option_1", total: 1 },
              { id: "option_2", total: 2 }
            ]
          },
          {
            group_id: "2022-02",
            data: [
              { id: "option_1", total: 3 },
              { id: "option_2", total: 1 }
            ]
          },
          {
            group_id: "2022-03",
            data: [
              { id: "option_1", total: 3 },
              { id: "option_2", total: 1 }
            ]
          }
        ])
      });

      expect(values).toEqual([
        { colspan: 0, row: ["option_1", 0, 0, 1, 3, 3] },
        { colspan: 0, row: ["option_2", 3, 4, 2, 1, 1] },
        { colspan: 0, row: ["option_3", 5, 0, 0, 0, 0] }
      ]);
    });

    it("returns the rows for each group and respects the lookup order", () => {
      const values = buildInsightValues.default({
        getLookupValue: (_key, value) => value.get("id"),
        key: "key",
        isGrouped: true,
        groupedBy: "month",
        lookupValues: [
          { id: "option_3", display_text: "option_3" },
          { id: "option_1", display_text: "option_1" },
          { id: "option_2", display_text: "option_2" }
        ],
        data: fromJS([
          {
            group_id: "2021-10",
            data: [
              { id: "option_2", total: 3 },
              { id: "option_3", total: 5 }
            ]
          },
          {
            group_id: "2021-12",
            data: [{ id: "option_2", total: 4 }]
          },
          {
            group_id: "2022-01",
            data: [
              { id: "option_1", total: 1 },
              { id: "option_2", total: 2 }
            ]
          },
          {
            group_id: "2022-02",
            data: [
              { id: "option_1", total: 3 },
              { id: "option_2", total: 1 }
            ]
          },
          {
            group_id: "2022-03",
            data: [
              { id: "option_1", total: 3 },
              { id: "option_2", total: 1 }
            ]
          }
        ])
      });

      expect(values).toEqual([
        { colspan: 0, row: ["option_3", 5, 0, 0, 0, 0] },
        { colspan: 0, row: ["option_1", 0, 0, 1, 3, 3] },
        { colspan: 0, row: ["option_2", 3, 4, 2, 1, 1] }
      ]);
    });
  });

  describe("when subColumnItems entry is present", () => {
    it("returns rows with subcolums items", () => {
      const values = buildInsightValues.default({
        getLookupValue: (_key, value) => value.get("id"),
        key: "key",
        isGrouped: true,
        groupedBy: "month",
        subColumnItems: ["boys", "girls", "total"],
        data: fromJS([
          {
            group_id: "2021-10",
            data: [
              { id: "option_2", boys: 2, girls: 1, total: 3 },
              { id: "option_3", boys: 2, girls: 3, total: 5 }
            ]
          },
          {
            group_id: "2021-12",
            data: [{ id: "option_2", boys: 2, girls: 2, total: 4 }]
          },
          {
            group_id: "2022-01",
            data: [
              { id: "option_1", boys: 2, total: 1 },
              { id: "option_2", boys: 2, girls: 1, total: 2 }
            ]
          },
          {
            group_id: "2022-02",
            data: [
              { id: "option_1", boys: 2, girls: 1, total: 3 },
              { id: "option_2", girls: 1, total: 1 }
            ]
          }
        ])
      });

      expect(values).toEqual([
        { colspan: 0, row: ["option_1", 0, 0, 0, 0, 0, 0, 2, 0, 1, 2, 1, 3] },
        { colspan: 0, row: ["option_2", 2, 1, 3, 2, 2, 4, 2, 1, 2, 0, 1, 1] },
        { colspan: 0, row: ["option_3", 2, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
      ]);
    });
  });

  describe("when is ghn_report", () => {
    it("returns one row for each option", () => {
      const values = buildInsightValues.ghn_report({
        data: fromJS([
          {
            id: "attack_on_schools",
            total: 1
          },
          {
            id: "denial_humanitarian_access",
            total: 5
          }
        ]),
        getLookupValue: (_key, value) => value.get("id"),
        key: "verified_information_violations"
      });

      expect(values).toEqual([
        {
          colspan: 0,
          row: ["attack_on_schools", 1]
        },
        {
          colspan: 0,
          row: ["denial_humanitarian_access", 5]
        }
      ]);
    });
  });
});
