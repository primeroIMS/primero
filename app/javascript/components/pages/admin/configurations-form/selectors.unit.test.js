// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import NAMESPACE from "../configurations-list/namespace";

import {
  getApplying,
  getConfiguration,
  getErrors,
  getLoading,
  getServerErrors,
  getSavingRecord,
  getSending
} from "./selectors";

const state = fromJS({
  records: {
    admin: {
      configurations: {
        selectedConfiguration: { id: 1 },
        errors: true,
        serverErrors: [{ message: "error-1" }],
        saving: true,
        loading: false,
        sending: false
      }
    }
  }
});

const stateWithoutHeaders = fromJS({});

describe("configurations-form/selectors.js", () => {
  describe("getConfiguration", () => {
    it("should return selected configuration", () => {
      const expected = state.getIn(["records", "admin", NAMESPACE, "selectedConfiguration"]);

      const userGroup = getConfiguration(state);

      expect(userGroup).toEqual(expected);
    });

    it("should return empty object when selected user empty", () => {
      const userGroup = getConfiguration(stateWithoutHeaders);

      expect(userGroup).toEqual(fromJS({}));
    });
  });

  describe("getErrors", () => {
    it("should return errors", () => {
      const expected = state.getIn(["records", "admin", NAMESPACE, "errors"]);

      const userGroup = getErrors(state);

      expect(userGroup).toEqual(expected);
    });

    it("should return false when errors empty", () => {
      const userGroup = getErrors(stateWithoutHeaders);

      expect(userGroup).toBe(false);
    });
  });

  describe("getServerErrors", () => {
    it("should return server errors", () => {
      const expected = state.getIn(["records", "admin", NAMESPACE, "serverErrors"]);

      const serverErrors = getServerErrors(state);

      expect(serverErrors).toEqual(expected);
    });

    it("should return empty object when no server errors", () => {
      const userGroup = getServerErrors(stateWithoutHeaders);

      expect(userGroup).toEqual(fromJS([]));
    });
  });

  describe("getSavingRecord", () => {
    it("should return server errors", () => {
      const serverErrors = getSavingRecord(state);

      expect(serverErrors).toBe(true);
    });

    it("should return empty object when no server errors", () => {
      const user = getSavingRecord(stateWithoutHeaders);

      expect(user).toBe(false);
    });
  });

  describe("getLoading", () => {
    it("should loading state", () => {
      expect(getLoading(state)).toBe(false);
    });
  });

  describe("getApplying", () => {
    it("should return false", () => {
      expect(getApplying(state)).toBe(false);
    });
  });

  describe("getSending", () => {
    it("should return false", () => {
      expect(getSending(state)).toBe(false);
    });
  });
});
