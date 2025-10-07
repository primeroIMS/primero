// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import * as userActions from "../../user/actions";

import actions from "./actions";
import reducer from "./reducer";

describe("<Dashboard /> - Reducers", () => {
  const nsReducer = reducer.dashboard;
  const initialState = fromJS({});

  it("should handle DASHBOARD_OVERVIEW_STARTED", () => {
    const expected = fromJS({ overview: { loading: true, errors: false } });
    const action = {
      type: actions.DASHBOARD_OVERVIEW_STARTED,
      payload: true
    };

    const newState = nsReducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle DASHBOARD_OVERVIEW_SUCCESS", () => {
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
    const expected = fromJS({ overview: { data } });
    const action = {
      type: actions.DASHBOARD_OVERVIEW_SUCCESS,
      payload: { data }
    };
    const newState = nsReducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle DASHBOARD_OVERVIEW_FINISHED", () => {
    const expected = fromJS({ overview: { loading: false } });
    const action = {
      type: actions.DASHBOARD_OVERVIEW_FINISHED,
      payload: false
    };

    const newState = nsReducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle DASHBOARD_OVERVIEW_FAILURE", () => {
    const expected = fromJS({ overview: { errors: true, loading: false } });
    const action = {
      type: actions.DASHBOARD_OVERVIEW_FAILURE,
      payload: true
    };

    const newState = nsReducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle user/LOGOUT_SUCCESS", () => {
    const expected = fromJS({});
    const defaultState = fromJS({});

    const action = {
      type: userActions.LOGOUT_SUCCESS,
      payload: true
    };

    const newState = nsReducer(defaultState, action);

    expect(newState).toEqual(expected);
  });
});
