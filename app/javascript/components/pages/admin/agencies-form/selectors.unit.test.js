import { fromJS } from "immutable";

import { expect } from "../../../../test";
import NAMESPACE from "../agencies-list/namespace";

import {
  getAgency,
  getErrors,
  getServerErrors,
  getSavingRecord
} from "./selectors";

const stateWithHeaders = fromJS({
  records: {
    agencies: {
      selectedAgency: { id: 1 },
      errors: true,
      serverErrors: [{ message: "error-1" }],
      saving: true
    }
  }
});

const stateWithoutHeaders = fromJS({});

describe("<AgenciesForm /> - Selectors", () => {
  describe("getAgency", () => {
    it("should return selected agency", () => {
      const expected = stateWithHeaders.getIn([
        "records",
        NAMESPACE,
        "selectedAgency"
      ]);

      const agency = getAgency(stateWithHeaders);

      expect(agency).to.deep.equal(expected);
    });

    it("should return empty object when selected agency empty", () => {
      const agency = getAgency(stateWithoutHeaders);

      expect(agency).to.deep.equal(fromJS({}));
    });
  });

  describe("getErrors", () => {
    it("should return errors", () => {
      const expected = stateWithHeaders.getIn(["records", NAMESPACE, "errors"]);

      const agency = getErrors(stateWithHeaders);

      expect(agency).to.deep.equal(expected);
    });

    it("should return false when errors empty", () => {
      const agency = getErrors(stateWithoutHeaders);

      expect(agency).to.deep.equal(false);
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
      const user = getServerErrors(stateWithoutHeaders);

      expect(user).to.deep.equal(fromJS([]));
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
