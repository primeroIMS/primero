import { expect } from "chai";
import { fromJS } from "immutable";

import { getCheckBoxes } from "./selectors";

const stateWithNoRecords = fromJS({});

describe("<CheckBox /> - Selectors", () => {
  describe("getCheckBoxes", () => {
    it("should return records", () => {
      const stateWithRecords = fromJS({
        records: {
          Cases: {
            filters: {
              protection_status: ["protection_status", "referred_cases"]
            }
          }
        }
      });
      const expected = fromJS(["protection_status", "referred_cases"]);
      const records = getCheckBoxes(
        stateWithRecords,
        { field_name: "protection_status" },
        "Cases"
      );

      expect(records).to.deep.equal(expected);
    });

    it("should return an object and not and array for 'my_cases' filter", () => {
      const stateWithRecords = fromJS({
        records: {
          Cases: {
            filters: {
              "my_cases[owned_by]": ["primero"],
              "my_cases[assigned_user_names]": []
            }
          }
        }
      });
      const expected = fromJS({
        "my_cases[owned_by]": ["primero"],
        "my_cases[assigned_user_names]": []
      });
      const records = getCheckBoxes(
        stateWithRecords,
        { field_name: "my_cases" },
        "Cases"
      );

      expect(records).to.deep.equal(expected);
    });

    it("should return empty object when records empty", () => {
      const expected = [];
      const records = getCheckBoxes(
        stateWithNoRecords,
        { field_name: "protection_status" },
        "Cases"
      );

      expect(records).to.deep.equal(expected);
    });
  });
});
