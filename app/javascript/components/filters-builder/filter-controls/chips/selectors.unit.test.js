import { expect } from "chai";
import { Map } from "immutable";

import { getChips } from "./selectors";

const stateWithNoRecords = Map({
  records: Map({
    Cases: {
      filters: {
        risk_level: []
      }
    }
  })
});
const stateWithRecords = Map({
  records: Map({
    Cases: {
      filters: {
        risk_level: ["low", "high"]
      }
    }
  })
});

describe("<Chips /> - Selectors", () => {
  describe("getChips", () => {
    it("should return records", () => {
      const expected = ["low", "high"];
      const records = getChips(
        stateWithRecords,
        { field_name: "risk_level" },
        "Cases"
      );
      expect(records).to.deep.equal(expected);
    });

    it("should return empty object when records empty", () => {
      const expected = [];
      const records = getChips(
        stateWithNoRecords,
        { field_name: "risk_level" },
        "Cases"
      );
      expect(records).to.deep.equal(expected);
    });
  });
});

