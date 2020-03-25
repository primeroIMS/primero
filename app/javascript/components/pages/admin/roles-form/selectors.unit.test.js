import { fromJS } from "immutable";

import { expect } from "../../../../test/unit-test-helpers";

import NAMESPACE from "./namespace";
import { getRole, getErrors, getServerErrors } from "./selectors";

const stateWithHeaders = fromJS({
  records: {
    roles: {
      selectedRole: { id: 1 },
      errors: true,
      serverErrors: [{ message: "error-1" }]
    }
  }
});

const stateWithoutHeaders = fromJS({});

describe("<RolesForm /> - Selectors", () => {
  describe("getRole", () => {
    it("should return selected role", () => {
      const expected = stateWithHeaders.getIn([
        "records",
        NAMESPACE,
        "selectedRole"
      ]);

      const role = getRole(stateWithHeaders);

      expect(role).to.deep.equal(expected);
    });

    it("should return empty object when selected role empty", () => {
      const role = getRole(stateWithoutHeaders);

      expect(role).to.be.empty;
    });
  });

  describe("getErrors", () => {
    it("should return errors", () => {
      const expected = stateWithHeaders.getIn(["records", NAMESPACE, "errors"]);

      const role = getErrors(stateWithHeaders);

      expect(role).to.deep.equal(expected);
    });

    it("should return false when errors empty", () => {
      const role = getErrors(stateWithoutHeaders);

      expect(role).to.deep.equal(false);
    });
  });

  describe("getServerErrors", () => {
    it("should return server errors", () => {
      const expected = stateWithHeaders.getIn([
        "records",
        NAMESPACE,
        "serverErrors"
      ]);

      const serverErrors = getServerErrors(stateWithHeaders);

      expect(serverErrors).to.deep.equal(expected);
    });

    it("should return empty object when no server errors", () => {
      const user = getServerErrors(stateWithoutHeaders);

      expect(user).to.be.empty;
    });
  });
});
