// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { RECORD_PATH } from "../../config";
import { PrimeroModuleRecord } from "../application/records";

import { getFiltersByRecordType, getFiltersValuesByRecordType } from "./selectors";

const stateWithoutRecords = fromJS({});

const state = fromJS({
  user: {
    modules: ["test1"],
    filters: {
      cases: [
        {
          unique_id: "filter1",
          field_name: "filter1",
          name: "filter1",
          options: { en: [{ id: "true", display_name: "Filter 1" }] },
          type: "toggle"
        }
      ],
      incidents: [
        {
          unique_id: "filter2",
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
  },
  application: {
    modules: [PrimeroModuleRecord({ unique_id: "test1", list_filters: { cases: ["filter1"] } })]
  }
});

describe("<IndexFilters /> - Selectors", () => {
  describe("getFiltersValuesByRecordType", () => {
    it("should return list of filters", () => {
      const expected = fromJS([
        {
          unique_id: "filter1",
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
      const records = getFiltersByRecordType(stateWithoutRecords, RECORD_PATH.cases);

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
      const records = getFiltersValuesByRecordType(stateWithoutRecords, RECORD_PATH.cases);

      expect(records).to.be.empty;
    });
  });
});
