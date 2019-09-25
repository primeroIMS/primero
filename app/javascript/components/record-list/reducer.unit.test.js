import chai, { expect } from "chai";
import { Map, List } from "immutable";
import chaiImmutable from "chai-immutable";

import { recordListReducer } from "./reducer";

chai.use(chaiImmutable);

describe("<RecordList /> - Reducers", () => {
  const reducer = recordListReducer("TestRecordType");

  it("should handle RECORDS_STARTED", () => {
    const expected = Map({ loading: true, errors: false });
    const action = {
      type: "TestRecordType/RECORDS_STARTED",
      payload: true
    };
    const newState = reducer(Map({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle RECORDS_FAILURE", () => {
    const expected = Map({ errors: true });
    const action = {
      type: "TestRecordType/RECORDS_FAILURE",
      payload: ["some error"]
    };
    const newState = reducer(Map({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle RECORDS_SUCCESS", () => {
    const expected = Map({
      data: List([Map({ id: 3 })]),
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
});
