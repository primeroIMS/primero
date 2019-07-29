import chai, { expect } from "chai";
import { Map } from "immutable";
import chaiImmutable from "chai-immutable";
import * as selectors from "./selectors";

chai.use(chaiImmutable);

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
      const records = selectors.getSelect(
        stateWithRecords,
        { id: "status" },
        "Cases"
      );
      expect(records).to.deep.equal(expected);
    });

    it("should return empty object when records empty", () => {
      const records = selectors.getSelect(
        stateWithNoRecords,
        { id: "status" },
        "Cases"
      );
      expect(records).to.deep.equal([]);
    });
  });
});

