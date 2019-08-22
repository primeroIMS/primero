import chai, { expect } from "chai";
import { Map, List } from "immutable";
import chaiImmutable from "chai-immutable";
import { FlagRecord } from "./records";
import * as r from "./reducers";

chai.use(chaiImmutable);

describe("<Flagging /> - Reducers", () => {
  const reducer = r.reducers.Flags;

  it("should handle FETCH_FLAGS_SUCCESS", () => {
    const expected = Map({
      data: List([
        FlagRecord({
          id: 1,
          record_id: "case",
          record_type: "cases",
          message: "Hello"
        })
      ])
    });
    const action = {
      type: "Flags/FETCH_FLAGS_SUCCESS",
      payload: [
        {
          id: 1,
          record_id: "case",
          record_type: "cases",
          message: "Hello"
        }
      ]
    };
    const newState = reducer(Map({ data: [] }), action);

    expect(newState).to.deep.equal(expected);
  });
});
