// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import configureStore from "redux-mock-store";

import { RECORD_PATH } from "../../config";

import * as actions from "./actions";
import * as actionCreators from "./action-creators";

describe("<Nav /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    ["fetchAlerts"].forEach(property => {
      expect(creators).toHaveProperty(property);
      delete creators[property];
    });
    expect(creators).toEqual({});
  });

  it("should check the 'fetchAlerts' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");

    dispatch(actionCreators.fetchAlerts());

    expect(dispatch.mock.calls[0][0].type).toEqual(actions.FETCH_ALERTS);
    expect(dispatch.mock.calls[0][0].api.path).toEqual(RECORD_PATH.alerts);
  });
});
