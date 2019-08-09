import chai, { expect } from "chai";
import { Map, List } from "immutable";
import chaiImmutable from "chai-immutable";

import * as selectors from "./selectors";

chai.use(chaiImmutable);

const stateWithNoRecords = Map({});
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
      const expected = {
        current: 0
      };
      const records = selectors.getTab(stateWithRecords);
      expect(records).to.deep.equal(0);
    });
  });

});
