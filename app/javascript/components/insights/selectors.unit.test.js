// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { getInsight } from "./selectors";

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
});
