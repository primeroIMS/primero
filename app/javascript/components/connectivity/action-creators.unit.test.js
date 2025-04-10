// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import { CLOSE_SNACKBAR } from "../notifier/actions";

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("components/connectivity/action-creator.js", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    [
      "checkServerStatus",
      "getServerStatus",
      "setFieldMode",
      "setNetworkStatus",
      "setPendingUserLogin",
      "setQueueData",
      "setQueueStatus",
      "setUserToggleOffline"
    ].forEach(property => {
      expect(creators).toHaveProperty(property);
      delete creators[property];
    });

    expect(Object.keys(creators)).toHaveLength(0);
  });

  it("should create an action to set the network status", () => {
    const expectedAction = {
      type: actions.NETWORK_STATUS,
      payload: true
    };

    expect(actionCreators.setNetworkStatus(true)).toEqual(expectedAction);
  });

  it("should create an action to check server status", () => {
    const store = configureStore([thunk])(fromJS({}));

    actionCreators.checkServerStatus(true)(store.dispatch, store.getState);

    const expectedActions = store.getActions();

    expect(expectedActions[0].type).toEqual(CLOSE_SNACKBAR);
    expect(expectedActions[1].type).toEqual(CLOSE_SNACKBAR);
    expect(expectedActions[2].type).toEqual(actions.NETWORK_STATUS);
    expect(expectedActions[3].type).toEqual(actions.SERVER_STATUS);
  });
});
