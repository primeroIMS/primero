import { expect } from "chai";
import sinon from "sinon";
import configureStore from "redux-mock-store";

import * as actionCreators from "./action-creators";

describe("Application - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).to.have.property("fetchSystemSettings");
    expect(creators).to.have.property("loadApplicationResources");
    expect(creators).to.have.property("setUserIdle");
    expect(creators).to.have.property("setNetworkStatus");
    expect(creators).to.have.property("fetchSystemPermissions")

    delete creators.fetchSystemSettings;
    delete creators.loadApplicationResources;
    delete creators.setUserIdle;
    delete creators.setNetworkStatus;
    delete creators.fetchSystemPermissions;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'fetchSystemSettings' action creator to return the correct object", () => {
    const expected = {
      path: "system_settings",
      params: { extended: true },
      db: {
        collection: "system_settings"
      }
    };
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    dispatch(actionCreators.fetchSystemSettings());

    expect(dispatch.getCall(0).returnValue.type).to.eql(
      "application/FETCH_SYSTEM_SETTINGS"
    );

    expect(dispatch.getCall(0).returnValue.api).to.eql(expected);
  });

  it("should create an action to set the user to idle", () => {
    const expectedAction = {
      type: "application/SET_USER_IDLE",
      payload: true
    };

    expect(actionCreators.setUserIdle(true)).to.eql(expectedAction);
  });

  it("should create an action to set the network status", () => {
    const expectedAction = {
      type: "application/NETWORK_STATUS",
      payload: true
    };

    expect(actionCreators.setNetworkStatus(true)).to.eql(expectedAction);
  });

  it("should check the 'fetchSystemPermissions' action creator to return the correct object", () => {
    const expected = {
      path: "permissions",
    };
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    dispatch(actionCreators.fetchSystemPermissions());

    expect(dispatch.getCall(0).returnValue.type).to.eql(
      "application/FETCH_SYSTEM_PERMISSIONS"
    );

    expect(dispatch.getCall(0).returnValue.api).to.eql(expected);
  });
});
