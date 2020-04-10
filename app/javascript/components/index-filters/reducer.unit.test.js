import { expect } from "chai";
import { Map, fromJS } from "immutable";

import reducer from "./reducer";
import { SET_FILTERS } from "./actions";

describe("<IndexFilters /> - Reducers", () => {
  const namespace = "Cases";

  const defaultState = Map({});

  it("should handle SET_FILTERS", () => {
    const payload = { filter1: true };
    const action = {
      type: `${namespace}/${SET_FILTERS}`,
      payload
    };
    const newState = reducer(namespace)(defaultState, action);

    expect(newState.get("filters")).to.deep.equal(fromJS(payload));
  });
});
