import chai, { expect } from "chai";
import { Map, List } from "immutable";
import chaiImmutable from "chai-immutable";

import * as r from "./reducers";

chai.use(chaiImmutable);

describe("CaseList - Reducers", () => {
  it("should handle CASES_STARTED", () => {
    const expected = Map({ loading: true });
    const action = {
      type: "CASES_STARTED",
      payload: true
    };
    const newState = r.reducers.Cases(Map({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle CASES_FAILED", () => {
    const expected = Map({ errors: List(["some error"]) });
    const action = {
      type: "CASES_FAILED",
      payload: ["some error"]
    };
    const newState = r.reducers.Cases(Map({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle CASES_SUCCESS", () => {
    const expected = Map({
      cases: List([Map({ id: 3 })]),
      metadata: Map({ per: 2 })
    });
    const action = {
      type: "CASES_SUCCESS",
      payload: { data: [{ id: 3 }], metadata: { per: 2 } }
    };
    const newState = r.reducers.Cases(Map({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle CASES_FINISHED", () => {
    const expected = Map({ loading: false });
    const action = {
      type: "CASES_FINISHED",
      payload: false
    };
    const newState = r.reducers.Cases(Map({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SET_FILTERS", () => {
    const expected = Map({ filters: Map({ gender: "male" }) });
    const action = {
      type: "SET_FILTERS",
      payload: { gender: "male" }
    };
    const newState = r.reducers.Cases(Map({}), action);

    expect(newState).to.deep.equal(expected);
  });
});
