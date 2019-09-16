
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
        my_cases: ["my_cases", "referred_cases"]
      }
    }
  })
});

describe("<CheckBox /> - Selectors", () => {
  describe("getCheckBoxes", () => {
    it("should return records", () => {
      const expected = ["my_cases", "referred_cases"];
      const records = selectors.getCheckBoxes(
        stateWithRecords,
        { field_name: "my_cases" },
        "Cases"
      );
      expect(records).to.deep.equal(expected);
    });

    it("should return empty object when records empty", () => {
      const expected = [];
      const records = selectors.getCheckBoxes(
        stateWithNoRecords,
        { field_name: "my_cases" },
        "Cases"
      );
      expect(records).to.deep.equal(expected);
    });
  });
});
