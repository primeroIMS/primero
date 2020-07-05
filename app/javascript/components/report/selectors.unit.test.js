import { fromJS } from "immutable";

import { getReport } from "./selectors";

const stateWithoutRecords = fromJS({});
const stateWithRecords = fromJS({
  records: {
    reports: {
      selectedReport: {
        id: 1,
        name: { en: "Test Report" },
        graph: true,
        graph_type: "bar"
      }
    }
  }
});

describe("<Reports /> - Selectors", () => {
  describe("selectReport", () => {
    it("should return records", () => {
      const expected = fromJS({
        id: 1,
        name: { en: "Test Report" },
        graph: true,
        graph_type: "bar"
      });

      const records = getReport(stateWithRecords, 1);

      expect(records).to.deep.equal(expected);
    });

    it("should return empty object when records empty", () => {
      const expected = fromJS({});
      const records = getReport(stateWithoutRecords, 1);

      expect(records).to.deep.equal(expected);
    });
  });
});
