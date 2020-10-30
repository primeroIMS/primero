import { Map } from "immutable";

import reducer from "./reducer";
import actions from "./actions";

describe("components/connectivity/reducer.js", () => {
  const defaultState = Map({});

  it("should handle NETWORK_STATUS", () => {
    const expected = Map({
      online: true
    });

    const action = {
      type: actions.NETWORK_STATUS,
      payload: true
    };

    const newState = reducer.connectivity(defaultState, action);

    expect(newState).to.eql(expected);
  });

  it("should handle SERVER_STATUS", () => {
    const expected = Map({
      serverOnline: true
    });

    const action = {
      type: actions.SERVER_STATUS,
      payload: true
    };

    const newState = reducer.connectivity(defaultState, action);

    expect(newState).to.eql(expected);
  });
});
