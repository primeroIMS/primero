// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import * as userActions from "../../user/actions";

import actions from "./actions";
import reducer from "./reducer";

describe("<Dashboard /> - Reducers", () => {
  const nsReducer = reducer.dashboard;
  const initialState = fromJS({});

  it("should handle DASHBOARDS_STARTED", () => {
    const expected = fromJS({
      loading: true,
      errors: false
    });
    const action = {
      type: actions.DASHBOARDS_STARTED,
      payload: true
    };

    const newState = nsReducer(initialState, action);

    expect(newState).toEqual(expected);
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
      type: actions.DASHBOARDS_SUCCESS,
      payload: {
        data
      }
    };
    const newState = nsReducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle DASHBOARDS_FINISHED", () => {
    const expected = fromJS({
      loading: false
    });
    const action = {
      type: actions.DASHBOARDS_FINISHED,
      payload: false
    };

    const newState = nsReducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle DASHBOARDS_FAILURE", () => {
    const expected = fromJS({
      errors: true
    });
    const action = {
      type: actions.DASHBOARDS_FAILURE,
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
