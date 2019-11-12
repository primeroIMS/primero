import { expect } from "chai";
import { Map } from "immutable";

import { rangeButtonReducer } from "./reducer";

describe("<CheckBox /> - Reducers", () => {
  const defaultState = Map({
    age_range: "6_to_11"
  });

  it("should handle RESET_RANGE_BUTTON", () => {
    const action = {
      type: "RESET_RANGE_BUTTON",
      payload: "age_range"
    };
    const newState = rangeButtonReducer.RangeButton(defaultState, action);

    expect(newState.get("age_range")).to.deep.equal("");
  });
});
