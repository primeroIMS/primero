import chai, { expect } from "chai";
import { Map, List } from "immutable";
import chaiImmutable from "chai-immutable";
import * as r from "./reducer";

chai.use(chaiImmutable);

describe("<Chips /> - Reducers", () => {
  const defaultState = Map({
    risk_level: List(["test"])
  });

  it("should handle RESET_CHECKBOX", () => {
    const action = {
      type: "RESET_CHIPS",
      payload: "risk_level"
    };
    debugger;
    const newState = r.chipsReducer.Chips(defaultState, action);

    expect(newState.get("risk_level")).to.deep.equal(List([]));
  });
});
