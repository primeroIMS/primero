import chai, { expect } from "chai";
import { Map, List } from "immutable";
import chaiImmutable from "chai-immutable";
import NAMESPACE from "./namespace";

import * as selectors from "./selectors";

export const selectCases = state => state.getIn([NAMESPACE, "cases"], {});

export const selectFilters = state => state.getIn([NAMESPACE, "filters"], {});

export const selectMeta = state => state.getIn([NAMESPACE, "metaData"], {});

export const selectLoading = state =>
  state.getIn([NAMESPACE, "loading"], false);

chai.use(chaiImmutable);

const stateWithNoRecords = Map({});
const stateWithRecords = Map({
  Cases: Map({
    loading: true,
    cases: List([Map({ id: 1 })]),
    filters: Map({
      gender: "male"
    }),
    metaData: Map({ per: 20 })
  })
});

describe("CaseList - Selectors", () => {
  describe("selectCases", () => {
    it("should return cases", () => {
      const expected = List([Map({ id: 1 })]);
      const cases = selectors.selectCases(stateWithRecords);
      expect(cases).to.deep.equal(expected);
    });

    it("should return empty object when cases empty", () => {
      const expected = {};
      const cases = selectors.selectCases(stateWithNoRecords);
      expect(cases).to.deep.equal(expected);
    });
  });

  describe("selectFilters", () => {
    it("should return filters", () => {
      const expected = Map({
        gender: "male"
      });
      const filters = selectors.selectFilters(stateWithRecords);
      expect(filters).to.deep.equal(expected);
    });

    it("should return empty object when filters empty", () => {
      const expected = {};
      const filters = selectors.selectFilters(stateWithNoRecords);
      expect(filters).to.deep.equal(expected);
    });
  });

  describe("selectMeta", () => {
    it("should return cases meta", () => {
      const expected = Map({ per: 20 });
      const meta = selectors.selectMeta(stateWithRecords);
      expect(meta).to.deep.equal(expected);
    });

    it("should return empty object when cases empty", () => {
      const expected = {};
      const meta = selectors.selectMeta(stateWithNoRecords);
      expect(meta).to.deep.equal(expected);
    });
  });

  describe("selectLoading", () => {
    it("should return loading status", () => {
      const expected = true;
      const cases = selectors.selectLoading(stateWithRecords);
      expect(cases).to.deep.equal(expected);
    });

    it("should return false by default", () => {
      const expected = false;
      const loading = selectors.selectLoading(stateWithNoRecords);
      expect(loading).to.deep.equal(expected);
    });
  });
});
