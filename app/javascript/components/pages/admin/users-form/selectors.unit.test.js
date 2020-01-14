import { fromJS } from "immutable";

import { expect } from "../../../../test/unit-test-helpers";
import NAMESPACE from "../namespace";

import { getUser, getErrors } from "./selectors";

const stateWithHeaders = fromJS({
  records: {
    users: {
      selectedUser: { id: 1 },
      errors: [{ message: "error-1" }]
    }
  }
});

const stateWithoutHeaders = fromJS({});

describe("<UsersForm /> - Selectors", () => {
  describe("getUser", () => {
    it("should return selected user", () => {
      const expected = stateWithHeaders.getIn([
        "records",
        NAMESPACE,
        "selectedUser"
      ]);

      const user = getUser(stateWithHeaders);

      expect(user).to.deep.equal(expected);
    });

    it("should return empty object when selected user empty", () => {
      const user = getUser(stateWithoutHeaders);

      expect(user).to.deep.equal(fromJS({}));
    });
  });

  describe("getErrors", () => {
    it("should return errors", () => {
      const expected = stateWithHeaders.getIn(["records", NAMESPACE, "errors"]);

      const user = getErrors(stateWithHeaders);

      expect(user).to.deep.equal(expected);
    });

    it("should return empty object when selected user empty", () => {
      const user = getErrors(stateWithoutHeaders);

      expect(user).to.deep.equal(fromJS([]));
    });
  });
});
