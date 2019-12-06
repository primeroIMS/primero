import { expect } from "chai";
import { fromJS } from "immutable";

import { reducers } from "./reducer";
import * as actions from "./actions";

describe("<Nav /> - Reducers", () => {
  it("should handle FETCH_ALERTS", () => {
    const reducer = reducers.Nav;
    const initialState = fromJS({});
    const data = {
      case: 2,
      incident: 0,
      tracing_request: 1
    };
    const expected = fromJS({
      alerts: { data }
    });
    const action = {
      type: actions.FETCH_ALERTS_SUCCESS,
      payload: {
        data
      }
    };

    const newState = reducer(initialState, action);

    expect(newState).to.deep.equal(expected);
  });
});
