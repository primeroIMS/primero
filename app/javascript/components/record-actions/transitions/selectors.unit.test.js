import "test/test.setup";
import chai, { expect } from "chai";
import { Map } from "immutable";
import chaiImmutable from "chai-immutable";

import * as selectors from "./selectors";

chai.use(chaiImmutable);
const stateWithNoRecords = Map({});
const stateWithRecords = Map({
  transitions: Map({
    reassign: Map({
      users: [{ label: "primero_cp", value: "primero_cp" }],
      errors: true,
      message: ["Test error message"]
    })
  })
});

describe("<Transitions /> - Selectors", () => {
  describe("getUsersByTransitionType", () => {
    it("should return list of users allowed to reassign", () => {
      const expected = [{ label: "primero_cp", value: "primero_cp" }];
      const values = selectors.getUsersByTransitionType(
        stateWithRecords,
        "reassign"
      );
      expect(values).to.deep.equal(expected);
    });

    it("should return false when there are not users in store", () => {
      const errors = selectors.getUsersByTransitionType(stateWithNoRecords);
      expect(errors).to.be.equal(undefined);
    });
  });

  describe("getErrorsByTransitionType", () => {
    it("should return error messages", () => {
      const expected = ["Test error message"];
      const values = selectors.getErrorsByTransitionType(
        stateWithRecords,
        "reassign"
      );
      expect(values).to.deep.equal(expected);
    });

    it("should return undefined when there are not messages in store", () => {
      const errors = selectors.getErrorsByTransitionType(stateWithNoRecords);
      expect(errors).to.be.equal(undefined);
    });
  });
});
