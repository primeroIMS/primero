// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import actions from "./actions";
import reducer from "./reducer";

describe("pages/admin/<CodeOfConduct /> - Reducers", () => {
  it("should handle FETCH_CODE_OF_CONDUCT_STARTED", () => {
    const expected = fromJS({ loading: true, errors: false, fetchErrors: [] });

    const action = {
      type: actions.FETCH_CODE_OF_CONDUCT_STARTED
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_CODE_OF_CONDUCT_SUCCESS", () => {
    const codeOfConduct = { id: 1, title: "Some Title", content: "Some Content" };
    const expected = fromJS({ data: codeOfConduct });

    const action = {
      type: actions.FETCH_CODE_OF_CONDUCT_SUCCESS,
      payload: { data: codeOfConduct }
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_CODE_OF_CONDUCT_FINISHED", () => {
    const expected = fromJS({ loading: false });

    const action = {
      type: actions.FETCH_CODE_OF_CONDUCT_FINISHED
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_CODE_OF_CONDUCT_FAILURE", () => {
    const expected = fromJS({ loading: false, errors: true, fetchErrors: [{ status: 404, message: "Not Found" }] });

    const action = {
      type: actions.FETCH_CODE_OF_CONDUCT_FAILURE,
      payload: { loading: false, errors: [{ status: 404, message: "Not Found" }] }
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle SAVE_CODE_OF_CONDUCT_STARTED", () => {
    const expected = fromJS({ loading: true, errors: false, fetchErrors: [] });

    const action = {
      type: actions.SAVE_CODE_OF_CONDUCT_STARTED
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle SAVE_CODE_OF_CONDUCT_SUCCESS", () => {
    const codeOfConduct = { id: 1, title: "Some Title", content: "Some Content" };
    const expected = fromJS({ data: codeOfConduct });

    const action = {
      type: actions.SAVE_CODE_OF_CONDUCT_SUCCESS,
      payload: { data: codeOfConduct }
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle SAVE_CODE_OF_CONDUCT_FINISHED", () => {
    const expected = fromJS({ loading: false });

    const action = {
      type: actions.SAVE_CODE_OF_CONDUCT_FINISHED
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });
});
