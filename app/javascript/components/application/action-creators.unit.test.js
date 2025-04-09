// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import configureStore from "redux-mock-store";

import { ROUTES } from "../../config";

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("Application - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    [
      "disableNavigation",
      "fetchAgencyLogoOptions",
      "fetchRoles",
      "fetchSystemPermissions",
      "fetchSystemSettings",
      "fetchUserGroups",
      "loadApplicationResources",
      "setReturnUrl",
      "setUserIdle",
      "fetchManagedRoles",
      "fetchReferralAuthorizationRoles",
      "fetchSandboxUI",
      "fetchWebpushConfig",
      "setTheme"
    ].forEach(property => {
      expect(creators).toHaveProperty(property);
      delete creators[property];
    });

    expect(Object.keys(creators)).toHaveLength(0);
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
    const dispatch = jest.spyOn(store, "dispatch");

    dispatch(actionCreators.fetchSystemSettings());
    expect(dispatch.mock.calls[0][0].type).toEqual("application/FETCH_SYSTEM_SETTINGS");

    expect(dispatch.mock.calls[0][0].api).toEqual(expected);
  });

  it("should create an action to set the user to idle", () => {
    const expectedAction = {
      type: "application/SET_USER_IDLE",
      payload: true
    };

    expect(actionCreators.setUserIdle(true)).toEqual(expectedAction);
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

    expect(actionCreators.fetchSystemPermissions()).toEqual(expected);
  });

  it("should check the 'fetchRoles' action creator to return the correct object", () => {
    const expected = {
      type: actions.FETCH_ROLES,
      api: {
        path: "roles"
      }
    };

    expect(actionCreators.fetchRoles()).toEqual(expected);
  });

  it("should check the 'fetchUserGroups' action creator to return the correct object", () => {
    const expected = {
      type: actions.FETCH_USER_GROUPS,
      api: {
        path: "user_groups"
      }
    };

    expect(actionCreators.fetchUserGroups()).toEqual(expected);
  });

  it("should check the 'disableNavigation' action creator to return the correct object", () => {
    const expected = {
      type: actions.DISABLE_NAVIGATION,
      payload: true
    };

    expect(actionCreators.disableNavigation(true)).toEqual(expected);
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

    expect(actionCreators.fetchSandboxUI()).toEqual(expected);
  });

  it("should check the 'setReturnUrl' action creator to return the correct object", () => {
    const expected = {
      type: actions.SET_RETURN_URL,
      payload: "/test"
    };

    expect(actionCreators.setReturnUrl("/test")).toEqual(expected);
  });
});
