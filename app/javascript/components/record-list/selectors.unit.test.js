import chai, { expect } from "chai";
import { Map, List } from "immutable";
import chaiImmutable from "chai-immutable";

import * as selectors from "./selectors";

chai.use(chaiImmutable);

const stateWithNoRecords = Map({});
const stateWithRecords = Map({
  TestRecordType: Map({
    loading: true,
    records: List([Map({ id: 1 })]),
    filters: Map({
      gender: "male"
    }),
    metadata: Map({ per: 20 })
  })
});

describe("RecordList - Selectors", () => {
  const recordType = 'TestRecordType'

  describe("selectRecords", () => {
    it("should return records", () => {
      const expected = List([Map({ id: 1 })]);
      const records = selectors.selectRecords(stateWithRecords, recordType);
      expect(records).to.deep.equal(expected);
    });

    it("should return empty object when records empty", () => {
      const expected = {};
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
      const expected = {};
      const filters = selectors.selectFilters(stateWithNoRecords, recordType);
      expect(filters).to.deep.equal(expected);
    });
  });

  describe("selectMeta", () => {
    it("should return records meta", () => {
      const expected = Map({ per: 20 });
      const meta = selectors.selectMeta(stateWithRecords, recordType);
      expect(meta).to.deep.equal(expected);
    });

    it("should return empty object when records empty", () => {
      const expected = {};
      const meta = selectors.selectMeta(stateWithNoRecords, recordType);
      expect(meta).to.deep.equal(expected);
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
