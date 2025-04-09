// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import NAMESPACE from "../namespace";

import {
  getUser,
  getErrors,
  getLoading,
  getPasswordResetLoading,
  getServerErrors,
  getSavingRecord,
  getSavingNewPasswordReset,
  getRecordsUpdate,
  getUserSaved,
  getTotalUsersEnabled
} from "./selectors";

const roles = [
  { id: 1, unique_id: "role_1" },
  { id: 2, unique_id: "role_2" }
];

const stateWithHeaders = fromJS({
  records: {
    users: {
      selectedUser: { id: 1 },
      errors: true,
      serverErrors: [{ message: "error-1" }],
      saving: true,
      loading: true
    },
    roles: { data: roles }
  }
});

const stateWithoutHeaders = fromJS({});

describe("<UsersForm /> - Selectors", () => {
  describe("getUser", () => {
    it("should return selected user", () => {
      const expected = stateWithHeaders.getIn(["records", NAMESPACE, "selectedUser"]);

      const user = getUser(stateWithHeaders);

      expect(user).toEqual(expected);
    });

    it("should return empty object when selected user empty", () => {
      const user = getUser(stateWithoutHeaders);

      expect(user).toEqual(fromJS({}));
    });
  });

  describe("getErrors", () => {
    it("should return errors", () => {
      const expected = stateWithHeaders.getIn(["records", NAMESPACE, "errors"]);

      const user = getErrors(stateWithHeaders);

      expect(user).toEqual(expected);
    });

    it("should return false when errors empty", () => {
      const user = getErrors(stateWithoutHeaders);

      expect(user).toEqual(false);
    });
  });

  describe("getServerErrors", () => {
    it("should return server errors", () => {
      const expected = stateWithHeaders.getIn(["records", NAMESPACE, "serverErrors"]);

      const serverErrors = getServerErrors(stateWithHeaders);

      expect(serverErrors).toEqual(expected);
    });

    it("should return empty object when no server errors", () => {
      const user = getServerErrors(stateWithoutHeaders);

      expect(user).toEqual(fromJS([]));
    });
  });

  describe("getSavingRecord", () => {
    it("should return server errors", () => {
      const serverErrors = getSavingRecord(stateWithHeaders);

      expect(serverErrors).toBe(true);
    });

    it("should return empty object when no server errors", () => {
      const user = getSavingRecord(stateWithoutHeaders);

      expect(user).toBe(false);
    });
  });

  describe("getLoading", () => {
    it("should return true if it's loading", () => {
      const loading = getLoading(stateWithHeaders);

      expect(loading).toBe(true);
    });

    it("should return false if it is not loading", () => {
      const loading = getLoading(stateWithHeaders.merge(fromJS({ records: { users: { loading: false } } })));

      expect(loading).toBe(false);
    });
  });

  describe("getSavingNewPasswordReset", () => {
    it("should return true if it's saving", () => {
      const savingState = fromJS({ records: { users: { newPasswordReset: { saving: true } } } });
      const saving = getSavingNewPasswordReset(savingState);

      expect(saving).toBe(true);
    });

    it("should return false if it's saving", () => {
      const savingState = fromJS({ records: { users: { newPasswordReset: { saving: false } } } });
      const saving = getSavingNewPasswordReset(savingState);

      expect(saving).toBe(false);
    });
  });

  describe("getPasswordResetLoading", () => {
    it("should return true if it's loading", () => {
      const loadingState = fromJS({ records: { users: { passwordResetRequest: { loading: true } } } });

      const loading = getPasswordResetLoading(loadingState);

      expect(loading).toBe(true);
    });

    it("should return false if it's loading", () => {
      const loadingState = fromJS({ records: { users: { passwordResetRequest: { loading: false } } } });

      const loading = getPasswordResetLoading(loadingState);

      expect(loading).toBe(false);
    });
  });

  describe("getRecordsUpdate", () => {
    it("should return true if it's loading", () => {
      const currentState = fromJS({ records: { users: { recordsUpdate: true } } });

      const recordsUpdate = getRecordsUpdate(currentState);

      expect(recordsUpdate).toBe(true);
    });
  });

  describe("getUserSaved", () => {
    it("should return true if user was saved", () => {
      const currentState = fromJS({ records: { users: { userSaved: true } } });

      const loading = getUserSaved(currentState);

      expect(loading).toBe(true);
    });

    it("should return false if it's was NOT saved", () => {
      const currentState = fromJS({ records: { users: { userSaved: false } } });

      const loading = getUserSaved(currentState);

      expect(loading).toBe(false);
    });
  });

  describe("getTotalUsersEnabled", () => {
    it("should return true if it's loading", () => {
      const currentState = fromJS({ records: { users: { metadata: { total_enabled: 25 } } } });

      const totalUsersEnabled = getTotalUsersEnabled(currentState);

      expect(totalUsersEnabled).toBe(25);
    });
  });
});
