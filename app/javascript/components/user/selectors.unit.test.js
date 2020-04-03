import { expect } from "chai";
import { fromJS } from "immutable";

import { ACTIONS } from "../../libs/permissions";

import * as selectors from "./selectors";

const stateWithoutUser = fromJS({});
const stateWithUser = fromJS({
  user: {
    isAuthenticated: true,
    username: "primero",
    modules: ["primeromodule-test1", "primeromodule-test2"],
    permissions: {
      incidents: [ACTIONS.MANAGE],
      tracing_requests: [ACTIONS.MANAGE],
      cases: [ACTIONS.MANAGE]
    }
  }
});

describe("User - Selectors", () => {
  describe("with hasUserPermissions", () => {
    it("should return if user has permissions", () => {
      const hasUserPermissions = selectors.hasUserPermissions(stateWithUser);

      expect(hasUserPermissions).to.deep.equal(true);
    });

    it("should return false if permissions not set", () => {
      const hasUserPermissions = selectors.hasUserPermissions(stateWithoutUser);

      expect(hasUserPermissions).to.deep.equal(false);
    });
  });

  describe("with getPermissionsByRecord", () => {
    it("should return permissions if they're set", () => {
      const permissionsByRecord = selectors.getPermissionsByRecord(
        stateWithUser,
        "cases"
      );

      expect(permissionsByRecord).to.deep.equal(fromJS([ACTIONS.MANAGE]));
    });

    it("should not return permissions if not set", () => {
      const permissionsByRecord = selectors.getPermissionsByRecord(
        stateWithoutUser
      );

      expect(permissionsByRecord).to.deep.equal(fromJS([]));
    });
  });

  describe("with currentUser", () => {
    it("should return current user if username is set", () => {
      const currentUser = selectors.currentUser(stateWithUser, "cases");

      expect(currentUser).to.deep.equal("primero");
    });

    it("should return undefined if username is no set", () => {
      const currentUser = selectors.currentUser(stateWithoutUser);

      expect(currentUser).to.be.undefined;
    });
  });

  describe("with getPermissions", () => {
    it("should return current user if username is set", () => {
      const expectedPermission = fromJS({
        incidents: [ACTIONS.MANAGE],
        tracing_requests: [ACTIONS.MANAGE],
        cases: [ACTIONS.MANAGE]
      });

      const selector = selectors.getPermissions(stateWithUser);

      expect(selector).to.deep.equal(expectedPermission);
    });

    it("should return undefined if username is no set", () => {
      const currentUser = selectors.currentUser(stateWithoutUser);

      expect(currentUser).to.be.undefined;
    });
  });

  describe("getIsAuthenticated", () => {
    it("should return isAuthenticated", () => {
      const meta = selectors.getIsAuthenticated(stateWithUser);

      expect(meta).to.deep.equal(true);
    });

    it("should return false when user not autenticated", () => {
      const meta = selectors.getIsAuthenticated(stateWithoutUser);

      expect(meta).to.deep.equal(false);
    });
  });
});
