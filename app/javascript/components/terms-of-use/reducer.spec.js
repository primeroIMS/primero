// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import actions from "./actions";
import reducer from "./reducer";

describe("TermsOfUse - Reducer", () => {
  const defaultState = fromJS({});

  it("should handle ACCEPT_TERMS_OF_USE_STARTED", () => {
    const action = {
      type: actions.ACCEPT_TERMS_OF_USE_STARTED
    };

    const newState = reducer(defaultState, action);

    expect(newState.get("updatingTermsOfUse")).toEqual(true);
  });

  it("should handle ACCEPT_TERMS_OF_USE_SUCCESS", () => {
    const initialState = fromJS({
      updatingTermsOfUse: true
    });

    const action = {
      type: actions.ACCEPT_TERMS_OF_USE_SUCCESS,
      payload: {
        data: {
          terms_of_use_accepted_on: "2023-10-01T10:00:00Z"
        }
      }
    };

    const newState = reducer(initialState, action);

    expect(newState.get("updatingTermsOfUse")).toEqual(false);
    expect(newState.get("termsOfUseAcceptedOn")).toEqual("2023-10-01T10:00:00Z");
  });

  it("should handle ACCEPT_TERMS_OF_USE_SUCCESS with no data", () => {
    const initialState = fromJS({
      updatingTermsOfUse: true
    });

    const action = {
      type: actions.ACCEPT_TERMS_OF_USE_SUCCESS,
      payload: {}
    };

    const newState = reducer(initialState, action);

    expect(newState.get("updatingTermsOfUse")).toEqual(false);
    expect(newState.get("termsOfUseAcceptedOn")).toBeUndefined();
  });

  it("should handle ACCEPT_TERMS_OF_USE_FAILURE", () => {
    const initialState = fromJS({
      updatingTermsOfUse: true
    });

    const action = {
      type: actions.ACCEPT_TERMS_OF_USE_FAILURE
    };

    const newState = reducer(initialState, action);

    expect(newState.get("updatingTermsOfUse")).toEqual(false);
  });
});
