import chai, { expect } from "chai";
import { Map, List } from "immutable";
import chaiImmutable from "chai-immutable";

import * as r from "./reducer";

chai.use(chaiImmutable);

describe("RecordList - Reducers", () => {
  debugger;
  const reducer = r.recordListReducer('TestRecordType').TestRecordType

  it("should handle RECORDS_STARTED", () => {
    const expected = Map({ loading: true });
    const action = {
      type: "TestRecordType/RECORDS_STARTED",
      payload: true
    };
    const newState = reducer(Map({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle RECORDS_FAILED", () => {
    const expected = Map({ errors: List(["some error"]) });
    const action = {
      type: "TestRecordType/RECORDS_FAILED",
      payload: ["some error"]
    };
    const newState = reducer(Map({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle RECORDS_SUCCESS", () => {
    const expected = Map({
      records: List([Map({ id: 3 })]),
      metadata: Map({ per: 2 })
    });
    const action = {
      type: "TestRecordType/RECORDS_SUCCESS",
      payload: { data: [{ id: 3 }], metadata: { per: 2 } }
    };
    const newState = reducer(Map({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle RECORDS_FINISHED", () => {
    const expected = Map({ loading: false });
    const action = {
      type: "TestRecordType/RECORDS_FINISHED",
      payload: false
    };
    const newState = reducer(Map({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SET_FILTERS", () => {
    const expected = Map({ filters: Map({ gender: "male" }) });
    const action = {
      type: "TestRecordType/SET_FILTERS",
      payload: { gender: "male" }
    };
    const newState = reducer(Map({}), action);

    expect(newState).to.deep.equal(expected);
  });
});
