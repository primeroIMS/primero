import { fromJS } from "immutable";

import NAMESPACE from "../namespace";

import {
  getUser,
  getErrors,
  getServerErrors,
  getSavingRecord
} from "./selectors";

const stateWithHeaders = fromJS({
  records: {
    users: {
      selectedUser: { id: 1 },
      errors: true,
      serverErrors: [{ message: "error-1" }],
      saving: true
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

    it("should return false when errors empty", () => {
      const user = getErrors(stateWithoutHeaders);

      expect(user).to.deep.equal(false);
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

      expect(user).to.deep.equal(fromJS([]));
    });
  });

  describe("getSavingRecord", () => {
    it("should return server errors", () => {
      const serverErrors = getSavingRecord(stateWithHeaders);

      expect(serverErrors).to.be.true;
    });

    it("should return empty object when no server errors", () => {
      const user = getSavingRecord(stateWithoutHeaders);

      expect(user).to.be.false;
    });
  });
});
