
import chai, { expect } from "chai";
import { Map } from "immutable";
import chaiImmutable from "chai-immutable";
import * as selectors from "./selectors";

chai.use(chaiImmutable);

const stateWithNoRecords = Map({
  ui: Map({
    FiltersBuilder: {
      cases: [],
      incidents: [],
      tracing_requests: []
    }
  })
});
const stateWithRecords = Map({
  ui: Map({
    FiltersBuilder: {
      cases: ["my_cases", "age_range"],
      incidents: [],
      tracing_requests: []
    }
  })
});

describe("<FiltersBuilder /> - Selectors", () => {
  describe("selectExpandedPanel", () => {
    const recordType = "cases";

    it("should return records", () => {
      const expected = ["my_cases", "age_range"];
      const records = selectors.selectExpandedPanel(stateWithRecords, recordType);
      expect(records).to.deep.equal(expected);
    });

    it("should return empty object when records empty", () => {
      const expected = [];
      const records = selectors.selectExpandedPanel(stateWithNoRecords, recordType);
      expect(records).to.deep.equal(expected);
    });
  });
});

