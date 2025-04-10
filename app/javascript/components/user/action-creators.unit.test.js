// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import { METHODS, RECORD_PATH, ROUTES } from "../../config";
import * as idpSelection from "../login/components/idp-selection";
import { ENQUEUE_SNACKBAR, SNACKBAR_VARIANTS, generate } from "../notifier";
import { QUEUE_READY } from "../../libs/queue";

import Actions from "./actions";
import * as actionCreators from "./action-creators";

jest.mock("./action-creators", () => {
  const originalModule = jest.requireActual("./action-creators");

  return {
    __esModule: true,
    ...originalModule
  };
});

jest.mock("../login/components/idp-selection", () => {
  const originalModule = jest.requireActual("../login/components/idp-selection");

  return {
    __esModule: true,
    ...originalModule
  };
});

describe("User - Action Creators", () => {
  const middlewares = [thunk];

  const parentActions = [
    {
      type: "user/SET_AUTHENTICATED_USER",
      payload: {
        id: 1,
        username: "primero"
      }
    },
    {
      type: "user/FETCH_USER_DATA",
      api: {
        path: "users/1",
        params: {
          extended: true
        },
        db: {
          collection: "user",
          user: "primero"
        },
        successCallback: [
          {
            action: "connectivity/QUEUE_STATUS",
            payload: "ready"
          },
          "I18n/SET_USER_LOCALE"
        ]
      }
    }
  ];

  const expectedAsyncActions = [
    {
      type: "user/SET_AUTHENTICATED_USER",
      payload: {
        id: 1,
        username: "primero"
      }
    },
    {
      type: "user/FETCH_USER_DATA",
      api: {
        path: "users/1",
        params: {
          extended: true
        },
        db: {
          collection: "user",
          user: "primero"
        },
        successCallback: [
          {
            action: "connectivity/QUEUE_STATUS",
            payload: "ready"
          },
          "I18n/SET_USER_LOCALE"
        ]
      }
    },
    {
      type: "support/FETCH_DATA",
      api: {
        path: "contact_information",
        db: {
          collection: "contact_information"
        }
      }
    },
    {
      type: "application/FETCH_SYSTEM_SETTINGS",
      api: {
        path: "system_settings",
        params: {
          extended: true
        },
        db: {
          collection: "system_settings"
        }
      }
    },
    {
      type: "application/FETCH_SYSTEM_PERMISSIONS",
      api: {
        path: "permissions",
        db: {
          collection: "permissions"
        }
      }
    },
    {
      type: "forms/RECORD_FORMS",
      api: {
        path: "forms",
        normalizeFunc: "normalizeFormData",
        db: {
          collection: "forms"
        }
      }
    },
    {
      type: "forms/SET_OPTIONS",
      api: {
        path: "lookups",
        params: {
          per: 999,
          page: 1
        },
        db: {
          collection: "options"
        }
      }
    },
    {
      type: "forms/SET_LOCATIONS",
      api: {
        path: "http://localhost/test-locations.json",
        external: true,
        db: {
          collection: "locations",
          alwaysCache: false,
          manifest: "/test-locations.json"
        }
      }
    },
    {
      type: "application/FETCH_WEBPUSH_CONFIG",
      api: { path: "webpush/config" }
    }
  ];

  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    delete creators.__esModule;

    [
      "attemptSignout",
      "checkUserAuthentication",
      "fetchAuthenticatedUserData",
      "refreshToken",
      "resetPassword",
      "setAuthenticatedUser",
      "setUser",
      "showLoginDialog",
      "getAppResources",
      "saveNotificationSubscription",
      "removeNotificationSubscription"
    ].forEach(method => {
      expect(creators).toHaveProperty(method);
      expect(creators[method]).toBeInstanceOf(Function);
      delete creators[method];
    });

    expect(Object.keys(creators)).toHaveLength(0);
  });

  it("should check the 'setAuthenticatedUser' action creator to return the correct object", () => {
    const store = configureStore(middlewares)({});

    const user = {
      id: 1,
      username: "primero"
    };

    store.dispatch(actionCreators.setAuthenticatedUser(user));

    const actions = store.getActions();

    expect(actions).toHaveLength(2);
    expect(actions).toEqual(parentActions);
  });

  it("should check the 'setUser' action creator to return the correct object", () => {
    const store = configureStore(middlewares)({});
    const expected = {
      type: Actions.SET_AUTHENTICATED_USER,
      payload: true
    };
    const dispatch = jest.spyOn(store, "dispatch");

    dispatch(actionCreators.setUser(true));

    expect(dispatch.mock.calls[0][0]).toEqual(expected);
  });

  it("should check the 'fetchAuthenticatedUserData' action creator to return the correct object", async () => {
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");
    const expected = {
      path: "users/1",
      params: { extended: true },
      db: { collection: "user", user: "primero" },
      successCallback: [
        {
          action: "connectivity/QUEUE_STATUS",
          payload: QUEUE_READY
        },
        "I18n/SET_USER_LOCALE"
      ]
    };

    await dispatch(actionCreators.fetchAuthenticatedUserData({ username: "primero", id: 1 }));
    const firstCallReturnValue = dispatch.mock.calls[0][0];

    expect(firstCallReturnValue.type).toEqual(Actions.FETCH_USER_DATA);
    expect(firstCallReturnValue.api).toEqual(expected);
  });

  describe("should check the 'attemptSignout' action creator", () => {
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");
    let signOut = jest.spyOn(idpSelection, "signOut");
    const expected = {
      path: "tokens",
      method: "DELETE",
      successCallback: Actions.LOGOUT_SUCCESS_CALLBACK
    };

    beforeEach(() => {
      signOut = jest.spyOn(idpSelection, "signOut");
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("should return the correct object", () => {
      const usingIdp = true;

      dispatch(actionCreators.attemptSignout(usingIdp, signOut));
      const firstCallReturnValue = dispatch.mock.calls[0][0];

      expect(firstCallReturnValue.type).toEqual(Actions.LOGOUT);
      expect(firstCallReturnValue.api).toEqual(expected);
    });

    it("should call signOut", () => {
      dispatch(actionCreators.attemptSignout());
      expect(dispatch).toHaveBeenCalled();
    });
  });

  it("should check the 'checkUserAuthentication' action creator to return the correct object", () => {
    global.localStorage.setItem("user", '{"id": 1, "username": "primero"}');
    const store = configureStore(middlewares)({});

    return store.dispatch(actionCreators.checkUserAuthentication()).then(() => {
      const actions = store.getActions();

      expect(actions).toHaveLength(9);
      expect(actions).toEqual(expectedAsyncActions);
    });
  });

  it("should check the 'refreshToken' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");
    const expected = {
      path: "tokens",
      method: "POST"
    };

    dispatch(actionCreators.refreshToken());
    const firstCallReturnValue = dispatch.mock.calls[0][0];

    expect(firstCallReturnValue.type).toEqual(Actions.REFRESH_USER_TOKEN);
    expect(firstCallReturnValue.api).toEqual(expected);
  });

  describe("resetPassword", () => {
    beforeEach(() => {
      jest.spyOn(generate, "messageKey").mockReturnValue("key-123");
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("should check the 'resetPassword' action creator to return the correct object", () => {
      const data = {
        password: "12345",
        password_confirmation: "12345",
        reset_password_token: "ABC123"
      };

      const expected = {
        type: Actions.RESET_PASSWORD,
        api: {
          path: `${RECORD_PATH.users}/password-reset`,
          method: METHODS.POST,
          body: data,
          successCallback: {
            action: ENQUEUE_SNACKBAR,
            payload: {
              messageKey: "user.password_reset.success",
              options: {
                variant: SNACKBAR_VARIANTS.success,
                key: "key-123"
              }
            },
            redirectWithIdFromResponse: false,
            redirect: ROUTES.dashboard
          }
        }
      };

      const resetPasswordAction = actionCreators.resetPassword(data);

      expect(resetPasswordAction).toEqual(expected);
    });
  });
});
