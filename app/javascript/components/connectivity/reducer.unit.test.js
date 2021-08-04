import { fromJS } from "immutable";

import reducer from "./reducer";
import actions from "./actions";

describe("components/connectivity/reducer.js", () => {
  const defaultState = fromJS({});

  it("should handle NETWORK_STATUS", () => {
    const expected = fromJS({
      online: true
    });

    const action = {
      type: actions.NETWORK_STATUS,
      payload: true
    };

    const newState = reducer.connectivity(defaultState, action);

    expect(newState).to.eql(expected);
  });

  it("should handle SERVER_STATUS_SUCCESS", () => {
    const expected = fromJS({
      serverOnline: true,
      serverStatusRetries: 0
    });

    const action = {
      type: actions.SERVER_STATUS_SUCCESS,
      payload: true
    };

    const newState = reducer.connectivity(defaultState, action);

    expect(newState).to.eql(expected);
  });

  it("should handle SERVER_STATUS_FAILURE", () => {
    const expected = fromJS({
      serverOnline: false,
      serverStatusRetries: 1
    });

    const action = {
      type: actions.SERVER_STATUS_FAILURE,
      payload: true
    };

    const newState = reducer.connectivity(defaultState, action);

    expect(newState).to.eql(expected);
  });
});
