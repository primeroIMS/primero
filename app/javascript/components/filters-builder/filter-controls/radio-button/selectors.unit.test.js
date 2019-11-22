import { expect } from "chai";
import { Map } from "immutable";

import { getRadioButtons } from "./selectors";

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
      const records = getRadioButtons(stateWithRecords, {
        recordType: "Cases",
        props: { field_name: "sex" }
      });

      expect(records).to.deep.equal(expected);
    });

    it("should return empty object when records empty", () => {
      const records = getRadioButtons(stateWithNoRecords, {
        recordType: "Cases",
        props: { field_name: "sex" }
      });

      expect(records).to.deep.equal("");
    });
  });
});
