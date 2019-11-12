import { expect } from "chai";
import { Map, List } from "immutable";

import { selectSwitchButtons } from "./selectors";

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

describe("<SwitchButton /> - Selectors", () => {
  describe("selectSwitchButtons", () => {
    it("should return records", () => {
      const expected = ["my_cases", "referred_cases"];
      const records = selectSwitchButtons(
        stateWithRecords,
        { field_name: "my_cases" },
        "Cases"
      );
      expect(records).to.deep.equal(expected);
    });

    it("should return empty object when records empty", () => {
      const expected = List([]);
      const records = selectSwitchButtons(
        stateWithNoRecords,
        { field_name: "my_cases" },
        "Cases"
      );
      expect(records).to.deep.equal(expected);
    });
  });
});
