import { expect } from "chai";
import { fromJS } from "immutable";

import { FETCH_DASHBOARDS_SUCCESS } from "./actions";
import { reducers } from "./reducer";

describe("<Dashboard /> - Reducers", () => {
  const reducer = reducers.dashboard;
  const initialState = fromJS({});

  it("should handle FETCH_DASHBOARDS_SUCCESS", () => {
    const data = [
      {
        name: "dashboard.case_risk",
        type: "indicator",
        stats: {
          high: {
            count: 2,
            query: ["record_state=true", "status=open", "risk_level=high"]
          },
          medium: {
            count: 1,
            query: ["record_state=true", "status=open", "risk_level=medium"]
          },
          none: {
            count: 0,
            query: ["record_state=true", "status=open", "risk_level=none"]
          }
        }
      }
    ];
    const expected = fromJS({
      data
    });
    const action = {
      type: FETCH_DASHBOARDS_SUCCESS,
      payload: {
        data
      }
    };
    const newState = reducer(initialState, action);

    expect(newState).to.deep.equal(expected);
  });
});
