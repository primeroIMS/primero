import chai, { expect } from "chai";
import { Map } from "immutable";
import chaiImmutable from "chai-immutable";

import * as selectors from "./selectors";

chai.use(chaiImmutable);

const stateWithNoRecords = Map({});
const stateWithRecords = Map({
  records: Map({
    reports: Map({
      selectedReport: Map({
        id: 1,
        name: Map({ en: "Test Report" }),
        graph: true,
        graph_type: "bar"
      })
    })
  })
});

describe("<Reports /> - Selectors", () => {
  describe("selectReport", () => {
    it("should return records", () => {
      const expected = Map({
        id: 1,
        name: Map({ en: "Test Report" }),
        graph: true,
        graph_type: "bar"
      });

      const records = selectors.selectReport(stateWithRecords, 1);
      expect(records).to.deep.equal(expected);
    });

    it("should return empty object when records empty", () => {
      const expected = Map({});
      const records = selectors.selectReport(stateWithNoRecords, 1);
      expect(records).to.deep.equal(expected);
    });
  });
});
