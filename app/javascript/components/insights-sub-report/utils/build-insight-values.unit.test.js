import { fromJS } from "immutable";

import buildInsightValues from "./build-insight-values";

describe("<InsightsSubReport />/utils/buildInsightValues", () => {
  context("when is not grouped", () => {
    it("returns one row for each option", () => {
      const values = buildInsightValues({
        getLookupValue: (_key, value) => value.get("id"),
        key: "key",
        data: fromJS([
          { id: "option_1", total: 5 },
          { id: "option_2", total: 10 }
        ])
      });

      expect(values).to.deep.equals([
        { colspan: 0, row: ["option_1", 5] },
        { colspan: 0, row: ["option_2", 10] }
      ]);
    });
  });

  context("when is grouped by year", () => {
    it("returns the rows for each group", () => {
      const values = buildInsightValues({
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

      expect(values).to.deep.equals([
        { colspan: 0, row: ["option_1", 1, 3, 0] },
        { colspan: 0, row: ["option_2", 2, 1, 2] },
        { colspan: 0, row: ["option_3", 0, 0, 8] }
      ]);
    });
  });

  context("when is grouped by month", () => {
    it("returns the rows for each group", () => {
      const values = buildInsightValues({
        getLookupValue: (_key, value) => value.get("id"),
        key: "key",
        isGrouped: true,
        groupedBy: "month",
        data: fromJS([
          {
            group_id: "january-2022",
            data: [
              { id: "option_1", total: 1 },
              { id: "option_2", total: 2 }
            ]
          },
          {
            group_id: "february-2023",
            data: [
              { id: "option_1", total: 3 },
              { id: "option_2", total: 1 }
            ]
          },
          {
            group_id: "january-2024",
            data: [
              { id: "option_2", total: 2 },
              { id: "option_3", total: 8 }
            ]
          }
        ])
      });

      expect(values).to.deep.equals([
        { colspan: 0, row: ["option_1", 1, 0, 0, 3, 0, 0] },
        { colspan: 0, row: ["option_2", 2, 0, 0, 1, 2, 0] },
        { colspan: 0, row: ["option_3", 0, 0, 0, 0, 8, 0] }
      ]);
    });
  });
});
