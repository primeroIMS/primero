// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { getInsight, getInsightFilter, getIsGroupedInsight } from "./selectors";

const stateWithoutRecords = fromJS({});
const stateWithRecords = fromJS({
  records: {
    insights: {
      selectedReport: {
        id: 1,
        name: { en: "Test Report" },
        graph: true,
        graph_type: "bar"
      }
    }
  }
});

describe("<Insights /> - Selectors", () => {
  describe("selectInsight", () => {
    it("should return records", () => {
      const expected = fromJS({
        id: 1,
        name: { en: "Test Report" },
        graph: true,
        graph_type: "bar"
      });

      const records = getInsight(stateWithRecords, 1);

      expect(records).toEqual(expected);
    });

    it("should return empty object when records empty", () => {
      const expected = fromJS({});
      const records = getInsight(stateWithoutRecords, 1);

      expect(records).toEqual(expected);
    });
  });

  describe("getIsGroupedInsight", () => {
    it("returns true if the insights have group_id", () => {
      const stateWithGroups = fromJS({
        records: {
          insights: {
            selectedReport: {
              report_data: {
                subreport_1: {
                  data: {
                    indicator_1: [
                      {
                        group_id: "group_1",
                        data: [{ id: "option_1", total: 10 }]
                      }
                    ]
                  },
                  metadata: {
                    lookups: { indicator_1: "lookup-indicator_1" },
                    order: ["indicator_1"]
                  }
                }
              }
            }
          }
        }
      });

      expect(getIsGroupedInsight(stateWithGroups, "subreport_1")).toBe(true);
    });

    it("returns false if the insights don't have group_id", () => {
      expect(getIsGroupedInsight(stateWithoutRecords, "subreport_1")).toBe(false);
    });
  });

  describe("getInsightFilter", () => {
    it("returns a filter if exists", () => {
      const stateWithFilters = fromJS({ records: { insights: { filters: { grouped_by: "month" } } } });

      expect(getInsightFilter(stateWithFilters, "grouped_by")).toBe("month");
    });

    it("returns a filter if exists", () => {
      expect(getInsightFilter(stateWithoutRecords, "grouped_by")).toBeUndefined();
    });
  });
});
