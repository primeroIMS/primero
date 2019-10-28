import chai, { expect } from "chai";
import { Map, fromJS } from "immutable";
import chaiImmutable from "chai-immutable";

import * as selectors from "./selectors";

chai.use(chaiImmutable);

const stateWithNoRecords = fromJS({
  records: {
    TestRecordType: {
      loading: false,
      data: []
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
      const expected = fromJS({ "data": [{ "id": 1 }], "metadata": { "per": 20 }});
      const records = selectors.selectRecords(stateWithRecords, recordType);
      expect(records).to.deep.equal(expected);
    });

    it("should return empty object when records empty", () => {
      const expected = fromJS({ "data": [] });
      const records = selectors.selectRecords(stateWithNoRecords, recordType);
      expect(records).to.deep.equal(expected);
    });
  });

  describe("selectFilters", () => {
    it("should return filters", () => {
      const expected = Map({
        gender: "male"
      });
      const filters = selectors.selectFilters(stateWithRecords, recordType);
      expect(filters).to.deep.equal(expected);
    });

    it("should return empty object when filters empty", () => {
      const expected = Map({});
      const filters = selectors.selectFilters(stateWithNoRecords, recordType);
      expect(filters).to.deep.equal(expected);
    });
  });

  describe("selectMeta", () => {
    it("should not find removed function selectMeta", () => {
      expect(selectors, "DEPRECATED selectMeta").to.not.have.property("selectMeta");
    });
  });

  describe("selectLoading", () => {
    it("should return loading status", () => {
      const expected = true;
      const loading = selectors.selectLoading(stateWithRecords, recordType);
      expect(loading).to.deep.equal(expected);
    });

    it("should return false by default", () => {
      const expected = false;
      const loading = selectors.selectLoading(stateWithNoRecords, recordType);
      expect(loading).to.deep.equal(expected);
    });
  });
});
