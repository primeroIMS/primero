// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import buildChatValues from "./build-chart-values";

describe("<InsightsSubReport />/utils/buildChatValues", () => {
  describe("when is not grouped", () => {
    it("returns a single dataset", () => {
      const chartValues = buildChatValues({
        totalText: "Total",
        getLookupValue: (_key, value) => value.get("id"),
        localizeDate: value => value,
        valueKey: "key",
        value: fromJS([
          { id: "option_1", total: 5 },
          { id: "option_2", total: 10 }
        ])
      });

      expect(chartValues.datasets).toHaveLength(1);
      expect(chartValues.datasets[0].label).toBe("Total");
      expect(chartValues.labels).toEqual(["option_1", "option_2"]);
      expect(chartValues.datasets[0].data).toEqual([5, 10]);
    });
  });

  describe("when is grouped by year", () => {
    it("returns a dataset for each group", () => {
      const chartValues = buildChatValues({
        totalText: "Total",
        getLookupValue: (_key, value) => value.get("id"),
        localizeDate: value => value,
        groupedBy: "year",
        isGrouped: true,
        valueKey: "key",
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

      expect(chartValues.datasets).toHaveLength(3);
      expect(chartValues.datasets.map(dataset => dataset.label)).toEqual(["option_1", "option_2", "option_3"]);
      expect(chartValues.datasets[0].data).toEqual([1, 3, 0]);
      expect(chartValues.datasets[1].data).toEqual([2, 1, 2]);
      expect(chartValues.datasets[2].data).toEqual([0, 0, 8]);
      expect(chartValues.labels).toEqual(["2022", "2023", "2024"]);
    });

    it("returns a dataset for each group in alphabetic order", () => {
      const chartValues = buildChatValues({
        totalText: "Total",
        getLookupValue: (_key, value) =>
          ({ option_1: "First Option", option_2: "Second Option", option_4: "Fourth Option" }[value.get("id")]),
        localizeDate: value => value,
        groupedBy: "year",
        isGrouped: true,
        valueKey: "key",
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
              { id: "option_4", total: 8 }
            ]
          }
        ])
      });

      expect(chartValues.datasets).toHaveLength(3);
      expect(chartValues.datasets.map(dataset => dataset.label)).toEqual([
        "First Option",
        "Fourth Option",
        "Second Option"
      ]);
      expect(chartValues.datasets[0].data).toEqual([1, 3, 0]);
      expect(chartValues.datasets[1].data).toEqual([0, 0, 8]);
      expect(chartValues.datasets[2].data).toEqual([2, 1, 2]);
      expect(chartValues.labels).toEqual(["2022", "2023", "2024"]);
    });

    it("returns a dataset for each group in age range order", () => {
      const chartValues = buildChatValues({
        totalText: "Total",
        getLookupValue: (_key, value) => value.get("id"),
        localizeDate: value => value,
        groupedBy: "year",
        isGrouped: true,
        valueKey: "age",
        ageRanges: ["0 - 5", "6 - 11", "12 - 17", "18+"],
        value: fromJS([
          {
            group_id: 2022,
            data: [
              { id: "6 - 11", total: 1 },
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
              { id: "18+", total: 2 },
              { id: "0 - 5", total: 8 }
            ]
          }
        ])
      });

      expect(chartValues.datasets).toHaveLength(4);
      expect(chartValues.datasets.map(dataset => dataset.label)).toEqual(["0 - 5", "6 - 11", "12 - 17", "18+"]);
      expect(chartValues.datasets[0].data).toEqual([0, 3, 8]);
      expect(chartValues.datasets[1].data).toEqual([1, 0, 0]);
      expect(chartValues.datasets[2].data).toEqual([2, 0, 0]);
      expect(chartValues.datasets[3].data).toEqual([0, 1, 2]);
      expect(chartValues.labels).toEqual(["2022", "2023", "2024"]);
    });
  });

  describe("when is grouped by month", () => {
    it("returns a dataset for each group", () => {
      const chartValues = buildChatValues({
        totalText: "Total",
        getLookupValue: (_key, value) => value.get("id"),
        localizeDate: value => value,
        groupedBy: "year",
        isGrouped: true,
        valueKey: "key",
        value: fromJS([
          {
            group_id: "2022-12",
            data: [
              { id: "option_1", total: 1 },
              { id: "option_2", total: 2 }
            ]
          },
          {
            group_id: "2023-01",
            data: [
              { id: "option_1", total: 3 },
              { id: "option_2", total: 1 }
            ]
          },
          {
            group_id: "2023-02",
            data: [
              { id: "option_2", total: 2 },
              { id: "option_3", total: 8 }
            ]
          }
        ])
      });

      expect(chartValues.datasets).toHaveLength(3);
      expect(chartValues.datasets.map(dataset => dataset.label)).toEqual(["option_1", "option_2", "option_3"]);
      expect(chartValues.datasets[0].data).toEqual([1, 3, 0]);
      expect(chartValues.datasets[1].data).toEqual([2, 1, 2]);
      expect(chartValues.datasets[2].data).toEqual([0, 0, 8]);
      expect(chartValues.labels).toEqual(["2022-12", "2023-01", "2023-02"]);
    });
  });
});
