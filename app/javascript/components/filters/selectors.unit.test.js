import { expect } from "chai";
import { Map } from "immutable";
import { getTab } from "./selectors";

const stateWithRecords = Map({
  records: Map({
    FiltersTab: {
      current: 0
    }
  })
});

describe("<Filters /> - Selectors", () => {
  describe("getTab", () => {
    it("should return records", () => {
      const records = getTab(stateWithRecords);

      expect(records).to.deep.equal(0);
    });
  });
});
