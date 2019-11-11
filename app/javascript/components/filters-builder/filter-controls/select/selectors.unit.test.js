import { expect } from "chai";
import { Map } from "immutable";

import { getSelect } from "./selectors";

const stateWithNoRecords = Map({});
const stateWithRecords = Map({
  records: Map({
    Cases: {
      filters: {
        status: ["bia"]
      }
    }
  })
});

describe("<SelectFilter /> - Selectors", () => {
  describe("getSelect", () => {
    it("should return records", () => {
      const expected = ["bia"];
      const records = getSelect(stateWithRecords, {
        recordType: "Cases",
        props: { field_name: "status" }
      });
      expect(records).to.deep.equal(expected);
    });

    it("should return empty object when records empty", () => {
      const records = getSelect(stateWithNoRecords, {
        recordType: "Cases",
        props: { field_name: "status" }
      });
      expect(records).to.deep.equal('');
    });
  });
});
