import chai, { expect } from "chai";
import { Map, List } from "immutable";
import chaiImmutable from "chai-immutable";
import * as selectors from "./selectors";

chai.use(chaiImmutable);

const stateWithNoRecords = Map({});
const stateWithRecords = Map({
  records: Map({
    Cases: {
      filters: {
        age_range: "age_6_11"
      }
    }
  })
});

describe("<RangeButton /> - Selectors", () => {
  describe("getRangeButton", () => {
    it("should return records", () => {
      const expected = "age_6_11";
      const records = selectors.getRangeButton(
        stateWithRecords,
        { field_name: "age_range" },
        "Cases"
      );
      expect(records).to.deep.equal(expected);
    });

    it("should return empty object when records empty", () => {
      const records = selectors.getRangeButton(
        stateWithNoRecords,
        { field_name: "age_range" },
        "Cases"
      );
      expect(records).to.deep.equal([]);
    });
  });
});

