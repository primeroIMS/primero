// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import NAMESPACE from "./namespace";
import * as selectors from "./selectors";

const stateWithHeaders = fromJS({
  records: {
    admin: {
      roles: {
        selectedRole: { id: 1 },
        errors: true,
        loading: false,
        serverErrors: [{ message: "error-1" }],
        saving: false,
        copiedRole: {
          name: "Copy of Test Role"
        }
      }
    }
  }
});

const stateWithoutHeaders = fromJS({});

describe("<RolesForm /> - Selectors", () => {
  it("should have known the selectors", () => {
    const creators = { ...selectors };

    ["getLoading", "getRole", "getServerErrors", "getSavingRecord", "getCopiedRole"].forEach(property => {
      expect(creators).toHaveProperty(property);
      delete creators[property];
    });

    expect(Object.keys(creators)).toHaveLength(0);
  });

  describe("getRole", () => {
    it("should return selected role", () => {
      const expected = stateWithHeaders.getIn(["records", "admin", NAMESPACE, "selectedRole"]);

      const role = selectors.getRole(stateWithHeaders);

      expect(role).toEqual(expected);
    });

    it("should return empty object when selected role empty", () => {
      const role = selectors.getRole(stateWithoutHeaders);

      expect(role.size).toBe(0);
    });
  });

  describe("getServerErrors", () => {
    it("should return server errors", () => {
      const expected = stateWithHeaders.getIn(["records", "admin", NAMESPACE, "serverErrors"]);

      const serverErrors = selectors.getServerErrors(stateWithHeaders);

      expect(serverErrors).toEqual(expected);
    });

    it("should return empty object when no server errors", () => {
      const user = selectors.getServerErrors(stateWithoutHeaders);

      expect(user.size).toBe(0);
    });
  });

  describe("getSavingRecord", () => {
    it("should return saving", () => {
      const expected = stateWithHeaders.getIn(["records", "admin", NAMESPACE, "saving"]);

      const saving = selectors.getSavingRecord(stateWithHeaders);

      expect(saving).toEqual(expected);
    });
  });

  describe("getLoading", () => {
    it("should return loading", () => {
      const expected = stateWithHeaders.getIn(["records", "admin", NAMESPACE, "loading"]);

      const loading = selectors.getLoading(stateWithHeaders);

      expect(loading).toEqual(expected);
    });
  });

  describe("getCopiedRole", () => {
    it("should return valid object", () => {
      const expected = stateWithHeaders.getIn(["records", "admin", NAMESPACE, "copiedRole"]);

      const copiedRole = selectors.getCopiedRole(stateWithHeaders);

      expect(copiedRole).toEqual(expected);
    });

    it("should return empty object when no server errors", () => {
      const copiedRole = selectors.getCopiedRole(stateWithoutHeaders);

      expect(copiedRole.size).toBe(0);
    });
  });
});
