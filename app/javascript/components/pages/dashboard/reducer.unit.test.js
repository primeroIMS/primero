import { expect } from "chai";
import { fromJS } from "immutable";

import * as userActions from "../../user/actions";

import {
  DASHBOARDS_STARTED,
  DASHBOARDS_SUCCESS,
  DASHBOARDS_FINISHED,
  DASHBOARDS_FAILURE
} from "./actions";
import { reducers } from "./reducer";

describe("<Dashboard /> - Reducers", () => {
  const reducer = reducers.dashboard;
  const initialState = fromJS({});

  it("should handle DASHBOARDS_STARTED", () => {
    const expected = fromJS({
      loading: true,
      errors: false
    });
    const action = {
      type: DASHBOARDS_STARTED,
      payload: true
    };

    const newState = reducer(initialState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle DASHBOARDS_SUCCESS", () => {
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
      type: DASHBOARDS_SUCCESS,
      payload: {
        data
      }
    };
    const newState = reducer(initialState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle DASHBOARDS_FINISHED", () => {
    const expected = fromJS({
      loading: false
    });
    const action = {
      type: DASHBOARDS_FINISHED,
      payload: false
    };

    const newState = reducer(initialState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle DASHBOARDS_FAILURE", () => {
    const expected = fromJS({
      errors: true
    });
    const action = {
      type: DASHBOARDS_FAILURE,
      payload: true
    };

    const newState = reducer(initialState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle user/LOGOUT_SUCCESS", () => {
    const expected = fromJS({});
    const defaultState = fromJS({});

    const action = {
      type: userActions.LOGOUT_SUCCESS,
      payload: true
    };

    const newState = reducer(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });
});
