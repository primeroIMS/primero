import { expect } from "chai";
import { Map, List } from "immutable";

import { chipsReducer } from "./reducer";

describe("<Chips /> - Reducers", () => {
  const defaultState = Map({
    risk_level: List(["test"])
  });

  it("should handle RESET_CHECKBOX", () => {
    const action = {
      type: "RESET_CHIPS",
      payload: "risk_level"
    };
    const newState = chipsReducer.Chips(defaultState, action);

    expect(newState.get("risk_level")).to.deep.equal(List([]));
  });
});
