import { expect } from "chai";
import { Map } from "immutable";

import { reducers } from "./reducer";

describe("<Filters /> - Reducers", () => {
  const defaultState = Map({
    Cases: {
      current: 0
    },
    Incidents: {
      current: 0
    },
    TracingRequests: {
      current: 0
    }
  });

  it("should handle SET_TAB", () => {
    const action = {
      type: "SET_TAB",
      payload: {
        recordType: "Cases",
        value: 1
      }
    };

    const newState = reducers.FilterTabs(defaultState, action);

    expect(newState.getIn(["Cases", "current"])).to.deep.equal(1);
  });
});
