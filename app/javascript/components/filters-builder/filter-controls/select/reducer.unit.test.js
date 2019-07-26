import chai, { expect } from "chai";
import { Map, List } from "immutable";
import chaiImmutable from "chai-immutable";
import * as r from "./reducer";

chai.use(chaiImmutable);

describe("<SelectFilter /> - Reducers", () => {
  const defaultState = Map({
    status: "male"
  });

  it("should handle RESET_SELECT", () => {
    const action = {
      type: "RESET_SELECT",
      payload: "status"
    };
    const newState = r.selectReducer.SelectFilter(defaultState, action);

    expect(newState.get("status")).to.deep.equal(List([]));
  });
});
