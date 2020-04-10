import { fromJS } from "immutable";

import { expect } from "../../../../test/unit-test-helpers";
import NAMESPACE from "../user-groups-list/namespace";

import {
  getUserGroup,
  getErrors,
  getServerErrors,
  getSavingRecord
} from "./selectors";

const stateWithHeaders = fromJS({
  records: {
    user_groups: {
      selectedUserGroup: { id: 1 },
      errors: true,
      serverErrors: [{ message: "error-1" }],
      saving: true
    }
  }
});

const stateWithoutHeaders = fromJS({});

describe("<UserGroupsForm /> - Selectors", () => {
  describe("getUserGroup", () => {
    it("should return selected user group", () => {
      const expected = stateWithHeaders.getIn([
        "records",
        NAMESPACE,
        "selectedUserGroup"
      ]);

      const userGroup = getUserGroup(stateWithHeaders);

      expect(userGroup).to.deep.equal(expected);
    });

    it("should return empty object when selected user empty", () => {
      const userGroup = getUserGroup(stateWithoutHeaders);

      expect(userGroup).to.deep.equal(fromJS({}));
    });
  });

  describe("getErrors", () => {
    it("should return errors", () => {
      const expected = stateWithHeaders.getIn(["records", NAMESPACE, "errors"]);

      const userGroup = getErrors(stateWithHeaders);

      expect(userGroup).to.deep.equal(expected);
    });

    it("should return false when errors empty", () => {
      const userGroup = getErrors(stateWithoutHeaders);

      expect(userGroup).to.deep.equal(false);
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
      const userGroup = getServerErrors(stateWithoutHeaders);

      expect(userGroup).to.deep.equal(fromJS([]));
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
