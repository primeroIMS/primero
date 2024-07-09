// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import sinon from "sinon";
import configureStore from "redux-mock-store";

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("<InsightsSubReport /> - Action Creators", () => {
  it("should check the 'fetchInsight' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");
    const id = 1234;

    dispatch(actionCreators.fetchInsight(id));
    const firstCall = dispatch.getCall(0);

    expect(firstCall.returnValue.type).to.equal(actions.FETCH_INSIGHT);
    expect(firstCall.returnValue.api.path).to.equal(`managed_reports/${id}`);
  });
});
