// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { format, parseISO } from "date-fns";

import { ACTIONS } from "../permissions";
import { CODE_OF_CONDUCT_DATE_FORMAT } from "../../config";
import { MANAGED_REPORT_SCOPE } from "../permissions/constants";

import * as selectors from "./selectors";

const userGroups = fromJS([
  {
    id: 1,
    unique_id: "test-1",
    name: "Test 1"
  },
  {
    id: 2,
    unique_id: "test-2",
    name: "Test 2"
  }
]);
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
    resetPassword: { saving: true },
    userGroups,
    managedReportScope: MANAGED_REPORT_SCOPE.ALL
  }
});

describe("User - Selectors", () => {
  describe("with hasUserPermissions", () => {
    it("should return if user has permissions", () => {
      const hasUserPermissions = selectors.hasUserPermissions(stateWithUser);

      expect(hasUserPermissions).toEqual(true);
    });

    it("should return false if permissions not set", () => {
      const hasUserPermissions = selectors.hasUserPermissions(stateWithoutUser);

      expect(hasUserPermissions).toEqual(false);
    });
  });

  describe("with currentUser", () => {
    it("should return current user if username is set", () => {
      const currentUser = selectors.currentUser(stateWithUser, "cases");

      expect(currentUser).toEqual("primero");
    });

    it("should return undefined if username is no set", () => {
      const currentUser = selectors.currentUser(stateWithoutUser);

      expect(currentUser).toBeUndefined();
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

      expect(selector).toEqual(expectedPermission);
    });

    it("should return undefined if username is no set", () => {
      const currentUser = selectors.currentUser(stateWithoutUser);

      expect(currentUser).toBeUndefined();
    });
  });

  describe("getIsAuthenticated", () => {
    it("should return isAuthenticated", () => {
      const meta = selectors.getIsAuthenticated(stateWithUser);

      expect(meta).toEqual(true);
    });

    it("should return false when user not autenticated", () => {
      const meta = selectors.getIsAuthenticated(stateWithoutUser);

      expect(meta).toEqual(false);
    });
  });

  describe("getPermittedFormsIds", () => {
    it("should return list of permitted forms", () => {
      const expectedFormsIds = fromJS({ record_owner: "r", client_feedback: "rw" });
      const selector = selectors.getPermittedFormsIds(stateWithUser);

      expect(selector).toEqual(expectedFormsIds);
    });
  });

  describe("getUser", () => {
    it("should return selected user", () => {
      const expected = stateWithUser.get("user");

      const user = selectors.getUser(stateWithUser);

      expect(user).toEqual(expected);
    });

    it("should return empty object when selected user empty", () => {
      const user = selectors.getUser(stateWithoutUser);

      expect(user).toEqual(fromJS({}));
    });
  });

  describe("getUserSavingRecord", () => {
    it("should return saving key", () => {
      const result = selectors.getUserSavingRecord(stateWithUser);

      expect(result).toBe(false);
    });

    it("should return empty object when no server errors", () => {
      const user = selectors.getUserSavingRecord(stateWithoutUser);

      expect(user).toBe(false);
    });
  });

  describe("getServerErrors", () => {
    it("should return server errors", () => {
      const expected = stateWithUser.getIn(["user", "serverErrors"]);

      const serverErrors = selectors.getServerErrors(stateWithUser);

      expect(serverErrors).toEqual(expected);
    });

    it("should return empty object when no server errors", () => {
      const user = selectors.getServerErrors(stateWithoutUser);

      expect(user).toEqual(fromJS([]));
    });
  });

  describe("getSavingPassword", () => {
    it("should return true if the password reset is being saving", () => {
      const saving = selectors.getSavingPassword(stateWithUser);

      expect(saving).toBe(true);
    });
  });

  describe("getCodeOfConductId", () => {
    it("should return the id of the accepted code of conduct", () => {
      const state = fromJS({
        user: {
          codeOfConductId: 1
        }
      });

      expect(selectors.getCodeOfConductId(state)).toBe(1);
    });

    it("should return null if the user hasn't accepted the code of conduct", () => {
      expect(selectors.getCodeOfConductId(fromJS({}))).toBeNull();
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

      expect(formattedDate).toBe("March 23, 2021");
    });

    it("should return null if the user hasn't accepted the code of conduct", () => {
      expect(selectors.getCodeOfConductAccepteOn(fromJS({}))).toBeNull();
    });
  });

  describe("hasPrimeroModule", () => {
    const state = fromJS({
      user: {
        modules: ["primeromodule-cp"]
      }
    });

    it("should return true if the user has the module", () => {
      expect(selectors.hasPrimeroModule(state, "primeromodule-cp")).toBe(true);
    });

    it("should return false if the user does not have the module", () => {
      expect(selectors.hasPrimeroModule(state, "primeromodule-gbv")).toBe(false);
    });
  });

  describe("getCurrentUserUserGroups", () => {
    it("returns the user groups of the current user", () => {
      expect(selectors.getCurrentUserUserGroups(stateWithUser)).toEqual(userGroups);
    });
  });

  describe("getManagedReportScope", () => {
    it("returns managed report scope for the current user", () => {
      expect(selectors.getManagedReportScope(stateWithUser)).toBe(MANAGED_REPORT_SCOPE.ALL);
    });
  });

  describe("getIsManagedReportScopeAll", () => {
    it("returns true if the current user managed scope is ALL", () => {
      expect(selectors.getIsManagedReportScopeAll(stateWithUser)).toBe(true);
    });
  });
});
