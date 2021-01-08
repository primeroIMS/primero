import sinon from "sinon";
import configureStore from "redux-mock-store";

import { ROUTES } from "../../config";

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("Application - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    [
      "disableNavigation",
      "fetchRoles",
      "fetchSystemPermissions",
      "fetchSystemSettings",
      "fetchUserGroups",
      "loadApplicationResources",
      "setReturnUrl",
      "setUserIdle",
      "fetchManagedRoles",
      "fetchSandboxUI"
    ].forEach(property => {
      expect(creators).to.have.property(property);
      delete creators[property];
    });

    expect(creators).to.be.empty;
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

    expect(dispatch.getCall(0).returnValue.type).to.eql("application/FETCH_SYSTEM_SETTINGS");

    expect(dispatch.getCall(0).returnValue.api).to.eql(expected);
  });

  it("should create an action to set the user to idle", () => {
    const expectedAction = {
      type: "application/SET_USER_IDLE",
      payload: true
    };

    expect(actionCreators.setUserIdle(true)).to.eql(expectedAction);
  });

  it("should check the 'fetchSystemPermissions' action creator to return the correct object", () => {
    const expected = {
      type: actions.FETCH_SYSTEM_PERMISSIONS,
      api: {
        path: "permissions",
        db: {
          collection: "permissions"
        }
      }
    };

    expect(actionCreators.fetchSystemPermissions()).to.deep.equal(expected);
  });

  it("should check the 'fetchRoles' action creator to return the correct object", () => {
    const expected = {
      type: actions.FETCH_ROLES,
      api: {
        path: "roles"
      }
    };

    expect(actionCreators.fetchRoles()).to.deep.equal(expected);
  });

  it("should check the 'fetchUserGroups' action creator to return the correct object", () => {
    const expected = {
      type: actions.FETCH_USER_GROUPS,
      api: {
        path: "user_groups"
      }
    };

    expect(actionCreators.fetchUserGroups()).to.deep.equal(expected);
  });

  it("should check the 'disableNavigation' action creator to return the correct object", () => {
    const expected = {
      type: actions.DISABLE_NAVIGATION,
      payload: true
    };

    expect(actionCreators.disableNavigation(true)).to.deep.equal(expected);
  });

  it("should check the 'fetchSandboxUI' action creator to return the correct object", () => {
    const expected = {
      type: actions.FETCH_SANDBOX_UI,
      api: {
        path: ROUTES.sandbox_ui,
        db: {
          collection: "primero"
        }
      }
    };

    expect(actionCreators.fetchSandboxUI()).to.deep.equal(expected);
  });

  it("should check the 'setReturnUrl' action creator to return the correct object", () => {
    const expected = {
      type: actions.SET_RETURN_URL,
      payload: "/test"
    };

    expect(actionCreators.setReturnUrl("/test")).to.deep.equal(expected);
  });
});
