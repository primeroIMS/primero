import chai, { expect } from "chai";

import { fromJS } from "immutable";
import chaiImmutable from "chai-immutable";

import * as reducerHelpers from "./reducer-helpers";

chai.use(chaiImmutable);

describe("reducer-helpers", () => {
  describe("mergeRecord", () => {
    it("should merge deep object and update/concat arrays", () => {
      const record = fromJS({
        id: 1,
        first_name: "Josh",
        middle_name: "Fren",
        locations: [],
        countries: ["united_states"],
        nationality: ["american"],
        followups: [
          {
            id: 1,
            field: "field-value-1",
          },
          {
            id: 2,
            field2: "field2-value-2",
            nationality: ["french"]
          },
          {
            id: 4,
            field1: "field1-value-4"
          }
        ]
      });

      const payload = fromJS({
        last_name: "James",
        countries: ["united_states", "spain"],
        nationality: ["brazillian", "british"],
        followups: [
          {
            id: 2,
            field3: "field3-value-2",
            nationality: ["japanese", "american"]
          },
          {
            id: 3,
            field2: "field2-value-3",
            field3: "field3-value-3",
          },
          {
            id: 4,
            field1: ""
          }
        ]
      });

      const expected = fromJS({
        id: 1,
        first_name: "Josh",
        middle_name: "Fren",
        last_name: "James",
        locations: [],
        countries: ["united_states", "spain"],
        nationality: ["brazillian", "british"],
        followups: [
          {
            id: 1,
            field: "field-value-1"
          },
          {
            id: 2,
            field2: "field2-value-2",
            field3: "field3-value-2",
            nationality: ["japanese", "american"]
          },
          {
            id: 4,
            field1: ""
          },
          {
            id: 3,
            field2: "field2-value-3",
            field3: "field3-value-3"
          }
        ]
      });

      expect(reducerHelpers.mergeRecord(record, payload).toJS()).to.deep.equal(expected.toJS());
    });
  });
});
