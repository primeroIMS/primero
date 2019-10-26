import chai, { expect } from "chai";
import { fromJS } from "immutable";
import chaiImmutable from "chai-immutable";

import * as selectors from "./selectors";

chai.use(chaiImmutable);

const stateWithNoRecords = fromJS({});
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

      const records = selectors.selectReport(stateWithRecords, 1);
      expect(records).to.deep.equal(expected);
    });

    it("should return empty object when records empty", () => {
      const expected = fromJS({});
      const records = selectors.selectReport(stateWithNoRecords, 1);
      expect(records).to.deep.equal(expected);
    });
  });
});
