import { Map, fromJS } from "immutable";

import reducers from "./reducers";
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
    const newState = reducers(namespace)(defaultState, action);

    expect(newState.get("filters")).to.deep.equal(fromJS(payload));
  });
});
