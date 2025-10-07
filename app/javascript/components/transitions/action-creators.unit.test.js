// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import clone from "lodash/clone";
import configureStore from "redux-mock-store";

import * as actionCreators from "./action-creators";
import * as Actions from "./actions";

describe("<Transitions /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    expect(creators).toHaveProperty("fetchTransitions");
    delete creators.fetchTransitions;
    expect(creators).toEqual({});
  });
  it("should check the 'fetchTransitions' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");
    const recordType = "cases";
    const record = "d6a6dbb4-e5e9-4720-a661-e181a12fd3a0";
    const actions = { ...Actions };

    actionCreators.fetchTransitions(recordType, record)(dispatch);

    expect(dispatch.mock.calls[0][0].type).toEqual(actions.FETCH_TRANSITIONS);
    expect(dispatch.mock.calls[0][0].api.path).toEqual("cases/d6a6dbb4-e5e9-4720-a661-e181a12fd3a0/transitions");
  });
});
