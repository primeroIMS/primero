import { fromJS } from "immutable";
import { format, parseISO } from "date-fns";

import { ACTIONS } from "../../libs/permissions";
import { CODE_OF_CONDUCT_DATE_FORMAT } from "../../config/constants";

import * as selectors from "./selectors";

const stateWithoutUser = fromJS({});
const stateWithUser = fromJS({
  user: {
    isAuthenticated: true,
    username: "primero",
    modules: ["primeromodule-test1", "primeromodule-test2"],
    permittedForms: { record_owner: "r", client_feedback: "rw" },
    permissions: {
      incidents: [ACTIONS.MANAGE],
      tracing_requests: [ACTIONS.MANAGE],
      cases: [ACTIONS.MANAGE]
    },
    saving: false,
    serverErrors: ["Test error"],
    resetPassword: { saving: true }
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
      const permissionsByRecord = selectors.getPermissionsByRecord(stateWithUser, "cases");

      expect(permissionsByRecord).to.deep.equal(fromJS([ACTIONS.MANAGE]));
    });

    it("should not return permissions if not set", () => {
      const permissionsByRecord = selectors.getPermissionsByRecord(stateWithoutUser);

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

  describe("getPermittedFormsIds", () => {
    it("should return list of permitted forms", () => {
      const expectedFormsIds = fromJS({ record_owner: "r", client_feedback: "rw" });
      const selector = selectors.getPermittedFormsIds(stateWithUser);

      expect(selector).to.deep.equal(expectedFormsIds);
    });
  });

  describe("getUser", () => {
    it("should return selected user", () => {
      const expected = stateWithUser.get("user");

      const user = selectors.getUser(stateWithUser);

      expect(user).to.deep.equal(expected);
    });

    it("should return empty object when selected user empty", () => {
      const user = selectors.getUser(stateWithoutUser);

      expect(user).to.deep.equal(fromJS({}));
    });
  });

  describe("getUserSavingRecord", () => {
    it("should return saving key", () => {
      const result = selectors.getUserSavingRecord(stateWithUser);

      expect(result).to.be.false;
    });

    it("should return empty object when no server errors", () => {
      const user = selectors.getUserSavingRecord(stateWithoutUser);

      expect(user).to.be.false;
    });
  });

  describe("getServerErrors", () => {
    it("should return server errors", () => {
      const expected = stateWithUser.getIn(["user", "serverErrors"]);

      const serverErrors = selectors.getServerErrors(stateWithUser);

      expect(serverErrors).to.deep.equal(expected);
    });

    it("should return empty object when no server errors", () => {
      const user = selectors.getServerErrors(stateWithoutUser);

      expect(user).to.deep.equal(fromJS([]));
    });
  });

  describe("getSavingPassword", () => {
    it("should return true if the password reset is being saving", () => {
      const saving = selectors.getSavingPassword(stateWithUser);

      expect(saving).to.be.true;
    });
  });

  describe("getCodeOfConductId", () => {
    it("should return the id of the accepted code of conduct", () => {
      const state = fromJS({
        user: {
          codeOfConductId: 1
        }
      });

      expect(selectors.getCodeOfConductId(state)).to.be.equal(1);
    });

    it("should return null if the user hasn't accepted the code of conduct", () => {
      expect(selectors.getCodeOfConductId(fromJS({}))).to.be.null;
    });
  });

  describe("getCodeOfConductAccepteOn", () => {
    it("should return the date of the accepted code of conduct", () => {
      const state = fromJS({
        user: {
          codeOfConductAcceptedOn: "2021-03-23T18:14:19.762Z"
        }
      });
      const date = selectors.getCodeOfConductAccepteOn(state);
      const formattedDate = format(parseISO(date), CODE_OF_CONDUCT_DATE_FORMAT);

      expect(formattedDate).to.be.equal("March 23, 2021");
    });

    it("should return null if the user hasn't accepted the code of conduct", () => {
      expect(selectors.getCodeOfConductAccepteOn(fromJS({}))).to.be.null;
    });
  });
});
