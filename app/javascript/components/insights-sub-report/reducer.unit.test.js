// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import actions from "./actions";
import reducer from "./reducer";

describe("<Insights /> - Reducers", () => {
  const initialState = fromJS({});

  it("should handle FETCH_INSIGHT_STARTED", () => {
    const expected = fromJS({
      loading: true,
      errors: false
    });
    const action = {
      type: actions.FETCH_INSIGHT_STARTED,
      payload: true
    };

    const newState = reducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_INSIGHT_SUCCESS", () => {
    const data = [
      {
        id: 1,
        name: { en: "Test Report" },
        graph: true,
        graph_type: "bar"
      }
    ];
    const expected = fromJS({
      selectedReport: data,
      errors: false
    });
    const action = {
      type: actions.FETCH_INSIGHT_SUCCESS,
      payload: {
        data
      }
    };

    const newState = reducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_INSIGHT_FINISHED", () => {
    const expected = fromJS({
      loading: false
    });
    const action = {
      type: actions.FETCH_INSIGHT_FINISHED,
      payload: false
    };

    const newState = reducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_INSIGHT_FAILURE", () => {
    const expected = fromJS({
      errors: true
    });
    const action = {
      type: actions.FETCH_INSIGHT_FAILURE,
      payload: true
    };

    const newState = reducer(initialState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle user/LOGOUT_SUCCESS", () => {
    const defaultState = fromJS({
      selectedReport: [
        {
          id: 1,
          name: { en: "Test Report" },
          graph: true,
          graph_type: "bar"
        }
      ],
      errors: false
    });

    const expected = fromJS({});
    const action = {
      type: "user/LOGOUT_SUCCESS",
      payload: true
    };

    const newState = reducer(defaultState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle insights/CLEAR_SELECTED_INSIGHT", () => {
    const defaultState = fromJS({
      selectedReport: {
        id: 1,
        name: { en: "Test Report" },
        graph: true,
        graph_type: "bar"
      },
      errors: false
    });

    const expected = fromJS({ errors: false });
    const action = {
      type: "insights/CLEAR_SELECTED_INSIGHT"
    };

    const newState = reducer(defaultState, action);

    expect(newState).toEqual(expected);
  });

  it("should handle insights/CLEAR_REPORT_DATA", () => {
    const defaultState = fromJS({
      selectedReport: {
        id: 1,
        name: { en: "Test Report" },
        graph: true,
        graph_type: "bar",
        report_data: {
          incidents: { data: { indicator: [{ group_id: "group1", data: [{ id: "total", total: 54 }] }] } }
        }
      },
      errors: false
    });

    const expected = fromJS({
      selectedReport: {
        id: 1,
        name: { en: "Test Report" },
        graph: true,
        graph_type: "bar",
        report_data: {}
      },
      errors: false
    });
    const action = {
      type: "insights/CLEAR_REPORT_DATA"
    };

    const newState = reducer(defaultState, action);

    expect(newState).toEqual(expected);
  });
});
