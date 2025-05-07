// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Map, fromJS } from "immutable";

import * as selectors from "./selectors";

const stateWithNoRecords = fromJS({
  records: {
    TestRecordType: {
      loading: false,
      data: [],
      metadata: {}
    }
  }
});

const stateWithRecords = fromJS({
  records: {
    TestRecordType: {
      loading: true,
      data: [{ id: 1 }],
      filters: {
        gender: "male"
      },
      metadata: { per: 20 }
    }
  }
});

describe("<RecordList /> - Selectors", () => {
  const recordType = "TestRecordType";

  describe("selectRecords", () => {
    it("should return records", () => {
      const expected = fromJS({ data: [{ id: 1 }], metadata: { per: 20 } });
      const records = selectors.getRecords(stateWithRecords, recordType);

      expect(records).toEqual(expected);
    });

    it("should return empty object when records empty", () => {
      const expected = fromJS({ data: [], metadata: {} });
      const records = selectors.getRecords(stateWithNoRecords, recordType);

      expect(records).toEqual(expected);
    });
  });

  describe("getFilters", () => {
    it("should return filters", () => {
      const expected = Map({
        gender: "male"
      });
      const filters = selectors.getFilters(stateWithRecords, recordType);

      expect(filters).toEqual(expected);
    });

    it("should return empty object when filters empty", () => {
      const expected = Map({});
      const filters = selectors.getFilters(stateWithNoRecords, recordType);

      expect(filters).toEqual(expected);
    });
  });

  describe("selectMeta", () => {
    it("should not find removed function selectMeta", () => {
      // DEPRECATED selectMeta
      expect(selectors).not.toHaveProperty("selectMeta");
    });
  });

  describe("getLoading", () => {
    it("should return loading status", () => {
      const expected = true;
      const loading = selectors.getLoading(stateWithRecords, recordType);

      expect(loading).toEqual(expected);
    });

    it("should return false by default", () => {
      const expected = false;
      const loading = selectors.getLoading(stateWithNoRecords, recordType);

      expect(loading).toEqual(expected);
    });
  });
});
