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
      expect(creators).to.have.property(property);
      delete creators[property];
    });

    expect(creators).to.be.empty;
  });

  it("should create an action to set the network status", () => {
    const expectedAction = {
      type: actions.NETWORK_STATUS,
      payload: true
    };

    expect(actionCreators.setNetworkStatus(true)).to.eql(expectedAction);
  });

  it("should create an action to check server status", () => {
    const store = configureStore([thunk])(fromJS({}));

    actionCreators.checkServerStatus(true)(store.dispatch, store.getState);

    const expectedActions = store.getActions();

    expect(expectedActions[0].type).to.eql(CLOSE_SNACKBAR);
    expect(expectedActions[1].type).to.eql(CLOSE_SNACKBAR);
    expect(expectedActions[2].type).to.eql(actions.NETWORK_STATUS);
    expect(expectedActions[3].type).to.eql(actions.SERVER_STATUS);
  });
});
