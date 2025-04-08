// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { format } from "date-fns";

import buildInsightColumns from "./build-insight-columns";

describe("<InsightsSubReport />/utils/buildInsightColumns", () => {
  describe("when is not grouped", () => {
    it("returns an empty array", () => {
      const columns = buildInsightColumns.default({
        value: fromJS([
          { id: "option_1", total: 5 },
          { id: "option_2", total: 10 }
        ]),
        totalText: "Total"
      });

      expect(columns).toEqual([{ label: "Total" }]);
    });
  });

  describe("when is grouped by year", () => {
    it("returns a single object with items", () => {
      const columns = buildInsightColumns.default({
        groupedBy: "year",
        isGrouped: true,
        localizeDate: (_key, value) => value,
        subColumnItems: [],
        value: fromJS([
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

      expect(columns).toEqual([
        { label: "2022", colspan: 1, subItems: [] },
        { label: "2023", colspan: 1, subItems: [] },
        { label: "2024", colspan: 1, subItems: [] }
      ]);
    });
  });

  describe("when is grouped by month", () => {
    it("returns a dataset for each group", () => {
      const columns = buildInsightColumns.default({
        groupedBy: "month",
        isGrouped: true,
        localizeDate: format,
        subColumnItems: ["boys", "girls"],
        value: fromJS([
          {
            group_id: "2022-01",
            data: [
              { id: "option_1", total: 1 },
              { id: "option_2", total: 2 }
            ]
          },
          {
            group_id: "2023-02",
            data: [
              { id: "option_1", total: 3 },
              { id: "option_2", total: 1 }
            ]
          },
          {
            group_id: "2024-01",
            data: [
              { id: "option_2", total: 2 },
              { id: "option_3", total: 8 }
            ]
          }
        ])
      });

      expect(columns).toEqual([
        { label: "2022", items: ["Jan"], colspan: 2, subItems: ["boys", "girls"] },
        { label: "2023", items: ["Feb"], colspan: 2, subItems: ["boys", "girls"] },
        { label: "2024", items: ["Jan"], colspan: 2, subItems: ["boys", "girls"] }
      ]);
    });
  });
});
