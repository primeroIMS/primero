// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import NAMESPACE from "../user-groups-list/namespace";

import { getUserGroup, getErrors, getServerErrors, getSavingRecord } from "./selectors";

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
      const expected = stateWithHeaders.getIn(["records", NAMESPACE, "selectedUserGroup"]);

      const userGroup = getUserGroup(stateWithHeaders);

      expect(userGroup).toEqual(expected);
    });

    it("should return empty object when selected user empty", () => {
      const userGroup = getUserGroup(stateWithoutHeaders);

      expect(userGroup).toEqual(fromJS({}));
    });
  });

  describe("getErrors", () => {
    it("should return errors", () => {
      const expected = stateWithHeaders.getIn(["records", NAMESPACE, "errors"]);

      const userGroup = getErrors(stateWithHeaders);

      expect(userGroup).toEqual(expected);
    });

    it("should return false when errors empty", () => {
      const userGroup = getErrors(stateWithoutHeaders);

      expect(userGroup).toEqual(false);
    });
  });

  describe("getServerErrors", () => {
    it("should return server errors", () => {
      const expected = stateWithHeaders.getIn(["records", NAMESPACE, "serverErrors"]);

      const serverErrors = getServerErrors(stateWithHeaders);

      expect(serverErrors).toEqual(expected);
    });

    it("should return empty object when no server errors", () => {
      const userGroup = getServerErrors(stateWithoutHeaders);

      expect(userGroup).toEqual(fromJS([]));
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
});
