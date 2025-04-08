// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import configureStore from "redux-mock-store";

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("<InsightsSubReport /> - Action Creators", () => {
  it("should check the 'fetchInsight' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");
    const id = 1234;

    dispatch(actionCreators.fetchInsight(id));
    const firstCall = dispatch.mock.calls[0][0];

    expect(firstCall.type).toBe(actions.FETCH_INSIGHT);
    expect(firstCall.api.path).toBe(`managed_reports/${id}`);
  });
});
