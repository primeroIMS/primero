import { expect } from "chai";
import { Map, List } from "immutable";

import { selectReducer } from "./reducer";

describe("<SelectFilter /> - Reducers", () => {
  const defaultState = Map({
    status: "male"
  });

  it("should handle RESET_SELECT", () => {
    const action = {
      type: "RESET_SELECT",
      payload: "status"
    };
    const newState = selectReducer.SelectFilter(defaultState, action);

    expect(newState.get("status")).to.deep.equal(List([]));
  });
});
