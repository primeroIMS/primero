import { fromJS } from "immutable";

import NAMESPACE from "../configurations-list/namespace";

import { getConfiguration, getErrors, getServerErrors, getSavingRecord } from "./selectors";

const state = fromJS({
  records: {
    admin: {
      configurations: {
        selectedConfiguration: { id: 1 },
        errors: true,
        serverErrors: [{ message: "error-1" }],
        saving: true
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

      expect(userGroup).to.deep.equal(expected);
    });

    it("should return empty object when selected user empty", () => {
      const userGroup = getConfiguration(stateWithoutHeaders);

      expect(userGroup).to.deep.equal(fromJS({}));
    });
  });

  describe("getErrors", () => {
    it("should return errors", () => {
      const expected = state.getIn(["records", "admin", NAMESPACE, "errors"]);

      const userGroup = getErrors(state);

      expect(userGroup).to.deep.equal(expected);
    });

    it("should return false when errors empty", () => {
      const userGroup = getErrors(stateWithoutHeaders);

      expect(userGroup).to.deep.equal(false);
    });
  });

  describe("getServerErrors", () => {
    it("should return server errors", () => {
      const expected = state.getIn(["records", "admin", NAMESPACE, "serverErrors"]);

      const serverErrors = getServerErrors(state);

      expect(serverErrors).to.deep.equal(expected);
    });

    it("should return empty object when no server errors", () => {
      const userGroup = getServerErrors(stateWithoutHeaders);

      expect(userGroup).to.deep.equal(fromJS([]));
    });
  });

  describe("getSavingRecord", () => {
    it("should return server errors", () => {
      const serverErrors = getSavingRecord(state);

      expect(serverErrors).to.be.true;
    });

    it("should return empty object when no server errors", () => {
      const user = getSavingRecord(stateWithoutHeaders);

      expect(user).to.be.false;
    });
  });
});
