import chai, { expect } from "chai";
import { Map } from "immutable";
import chaiImmutable from "chai-immutable";
import * as selectors from "./selectors";

chai.use(chaiImmutable);

const stateWithNoRecords = Map({});

describe("<CheckBox /> - Selectors", () => {
  describe("getCheckBoxes", () => {
    it("should return records", () => {
      const stateWithRecords = Map({
        records: Map({
          Cases: {
            filters: {
              protection_status: ["protection_status", "referred_cases"]
            }
          }
        })
      });
      const expected = ["protection_status", "referred_cases"];
      const records = selectors.getCheckBoxes(
        stateWithRecords,
        { field_name: "protection_status" },
        "Cases"
      );
      expect(records).to.deep.equal(expected);
    });

    it("should return an object and not and array for 'my_cases' filter", () => {
      const stateWithRecords = Map({
        records: Map({
          Cases: {
            filters: {
              "my_cases[owned_by]": ["primero"],
              "my_cases[assigned_user_names]": []
            }
          }
        })
      });
      const expected = {
        "my_cases[owned_by]": ["primero"],
        "my_cases[assigned_user_names]": []
      };
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
        { field_name: "protection_status" },
        "Cases"
      );
      expect(records).to.deep.equal(expected);
    });
  });
});
