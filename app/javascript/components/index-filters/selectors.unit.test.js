import { fromJS } from "immutable";

import { RECORD_PATH } from "../../config";

import {
  getFiltersByRecordType,
  getFiltersValuesByRecordType
} from "./selectors";

const stateWithoutRecords = fromJS({});

const state = fromJS({
  user: {
    filters: {
      cases: [
        {
          field_name: "filter1",
          name: "filter1",
          options: { en: [{ id: "true", display_name: "Filter 1" }] },
          type: "toggle"
        }
      ],
      incidents: [
        {
          field_name: "filter2",
          name: "filter3",
          options: { en: [{ id: "true", display_name: "Filter 3" }] },
          type: "toggle"
        }
      ]
    }
  },
  records: {
    cases: {
      filters: {
        filter1: true
      }
    }
  }
});

describe("<IndexFilters /> - Selectors", () => {
  describe("getFiltersValuesByRecordType", () => {
    it("should return list of filters", () => {
      const expected = fromJS([
        {
          field_name: "filter1",
          name: "filter1",
          options: { en: [{ id: "true", display_name: "Filter 1" }] },
          type: "toggle"
        }
      ]);

      const records = getFiltersByRecordType(state, RECORD_PATH.cases);

      expect(records).to.deep.equal(expected);
    });

    it("should return empty list", () => {
      const records = getFiltersByRecordType(
        stateWithoutRecords,
        RECORD_PATH.cases
      );

      expect(records).to.be.empty;
    });
  });

  describe("getFiltersValuesByRecordType", () => {
    it("should return list of applied filters", () => {
      const expected = fromJS({
        filter1: true
      });

      const records = getFiltersValuesByRecordType(state, RECORD_PATH.cases);

      expect(records).to.deep.equal(expected);
    });

    it("should return empty map", () => {
      const records = getFiltersValuesByRecordType(
        stateWithoutRecords,
        RECORD_PATH.cases
      );

      expect(records).to.be.empty;
    });
  });
});
