import "test/test.setup";
import { expect } from "chai";
import * as helpers from "./helpers";

describe("<RecordForms /> - Helpers", () => {
  describe("compactValues", () => {
    it("returns object of values that changed", () => {
      const initialValues = {
        name: "John",
        phone: "555-555-5555",
        relatives: [
          {
            unique_id: "234",
            father_name: "Joe"
          }
        ]
      };
      const values = {
        name: "John",
        phone: "555-555-5556",
        services: [
          {
            _destroy: true,
            unique_id: "123"
          }
        ],
        relatives: [
          {
            unique_id: "234",
            father_name: "Joe"
          },
          {
            mother_name: "James"
          },
          {
            uncle_name: "Jimmy",
            phone: ""
          }
        ]
      };

      const expected = {
        phone: "555-555-5556",
        services: [
          {
            _destroy: true,
            unique_id: "123"
          }
        ],
        relatives: [
          {
            mother_name: "James"
          },
          {
            phone: "",
            uncle_name: "Jimmy"
          }
        ]
      };

      expect(helpers.compactValues(values, initialValues)).to.eql(expected);
    });
  });
});
