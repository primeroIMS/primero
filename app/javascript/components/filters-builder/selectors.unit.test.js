import { expect } from "chai";
import { fromJS } from "immutable";

import { RECORD_PATH } from "../../config";

import { getFiltersByRecordType, getFromDashboardFilters } from "./selectors";

const stateWithoutRecords = fromJS({});
const state = fromJS({
  records: {
    cases: {
      filters: {
        owned_by: ["primero"]
      },
      dashboardFilters: {
        status: ["new"]
      }
    }
  }
});

describe("<FiltersBuilder /> - Selectors", () => {
  describe("getFiltersByRecordType", () => {
    it("should return list of filters", () => {
      const expected = fromJS({
        owned_by: ["primero"]
      });
      const records = getFiltersByRecordType(state, RECORD_PATH.cases);

      expect(records).to.deep.equal(expected);
    });

    it("should return empty map", () => {
      const records = getFiltersByRecordType(
        stateWithoutRecords,
        RECORD_PATH.cases
      );

      expect(records).to.be.empty;
    });
  });

  describe("getFromDashboardFilters", () => {
    it("should return list of filters", () => {
      const expected = fromJS({
        status: ["new"]
      });
      const records = getFromDashboardFilters(state, RECORD_PATH.cases);

      expect(records).to.deep.equal(expected);
    });

    it("should return empty map", () => {
      const records = getFromDashboardFilters(
        stateWithoutRecords,
        RECORD_PATH.cases
      );

      expect(records).to.be.empty;
    });
  });
});
