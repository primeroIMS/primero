import { expect } from "chai";
import { fromJS } from "immutable";

import {
  currentUser,
  getPermissionsByRecord,
  hasUserPermissions,
  getPermissions
} from "./selectors";

const stateWithoutUser = fromJS({});
const stateWithUser = fromJS({
  user: {
    username: "primero",
    permissions: {
      incidents: ["manage"],
      tracing_requests: ["manage"],
      cases: ["manage"]
    }
  }
});

describe("User - Selectors", () => {
  describe("with hasUserPermissions", () => {
    it("should return if user has permissions", () => {
      const selector = hasUserPermissions(stateWithUser);

      expect(selector).to.deep.equal(true);
    });

    it("should return false if permissions not set", () => {
      const selector = hasUserPermissions(stateWithoutUser);

      expect(selector).to.deep.equal(false);
    });
  });

  describe("with getPermissionsByRecord", () => {
    it("should return permissions if they're set", () => {
      const selector = getPermissionsByRecord(stateWithUser, "cases");

      expect(selector).to.deep.equal(fromJS(["manage"]));
    });

    it("should not return permissions if not set", () => {
      const selector = getPermissionsByRecord(stateWithoutUser);

      expect(selector).to.deep.equal(fromJS([]));
    });
  });

  describe("with currentUser", () => {
    it("should return current user if username is set", () => {
      const selector = currentUser(stateWithUser, "cases");

      expect(selector).to.deep.equal("primero");
    });

    it("should return undefined if username is no set", () => {
      const selector = currentUser(stateWithoutUser);

      expect(selector).to.be.undefined;
    });
  });

  describe("with getPermissions", () => {
    it("should return current user if username is set", () => {
      const expectedPermission = fromJS({
        incidents: ["manage"],
        tracing_requests: ["manage"],
        cases: ["manage"]
      });

      const selector = getPermissions(stateWithUser);

      expect(selector).to.deep.equal(expectedPermission);
    });

    it("should return undefined if username is no set", () => {
      const selector = currentUser(stateWithoutUser);

      expect(selector).to.be.undefined;
    });
  });
});
