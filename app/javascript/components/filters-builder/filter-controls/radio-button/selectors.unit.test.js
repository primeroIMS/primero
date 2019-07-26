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
        sex: "female"
      }
    }
  })
});

describe("<RadioButton /> - Selectors", () => {
  describe("getRadioButton", () => {
    it("should return records", () => {
      const expected = "female";
      const records = selectors.getRadioButtons(
        stateWithRecords,
        { id: "sex" },
        "Cases"
      );
      expect(records).to.deep.equal(expected);
    });

    it("should return empty object when records empty", () => {
      const records = selectors.getRadioButtons(
        stateWithNoRecords,
        { id: "sex" },
        "Cases"
      );
      expect(records).to.deep.equal([]);
    });
  });
});

