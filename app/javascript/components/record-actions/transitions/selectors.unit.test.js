import "test/test.setup";
import chai, { expect } from "chai";
import { Map, List } from "immutable";
import users from "./mocked-users";
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
  describe("getAssignUsers", () => {
    it("should return list of users allowed to reassign", () => {
      const expected = [{ label: "primero_cp", value: "primero_cp" }];
      const values = selectors.getAssignUsers(stateWithRecords);
      expect(values).to.eql(expected);
    });

    it("should return false when there are not users in store", () => {
      const errors = selectors.getAssignUsers(stateWithNoRecords);
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
      expect(values).to.eql(expected);
    });

    it("should return undefined when there are not messages in store", () => {
      const errors = selectors.getErrorsByTransitionType(stateWithNoRecords);
      expect(errors).to.be.equal(undefined);
    });
  });
});
