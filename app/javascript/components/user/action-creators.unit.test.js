import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import { METHODS, RECORD_PATH, ROUTES } from "../../config";
import { spy, stub } from "../../test";
import * as idpSelection from "../login/components/idp-selection";
import { ENQUEUE_SNACKBAR, SNACKBAR_VARIANTS, generate } from "../notifier";
import { QUEUE_READY } from "../../libs/queue";

import Actions from "./actions";
import * as actionCreators from "./action-creators";

describe("User - Action Creators", () => {
  const middlewares = [thunk];
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
        path: "https://localhost/test-locations.json",
        external: true,
        db: {
          collection: "locations",
          alwaysCache: false,
          manifest: "/test-locations.json"
        }
      }
    }
  ];

  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    [
      "attemptSignout",
      "checkUserAuthentication",
      "fetchAuthenticatedUserData",
      "refreshToken",
      "resetPassword",
      "setAuthenticatedUser",
      "setUser"
    ].forEach(method => {
      expect(creators).to.have.property(method);
      expect(creators[method]).to.be.a("function");
      delete creators[method];
    });

    expect(creators).to.be.empty;
  });

  it("should check the 'setAuthenticatedUser' action creator to return the correct object", () => {
    const store = configureStore(middlewares)({});

    const user = {
      id: 1,
      username: "primero"
    };

    return store.dispatch(actionCreators.setAuthenticatedUser(user)).then(() => {
      const actions = store.getActions();

      expect(actions).to.have.lengthOf(8);
      expect(actions).to.be.deep.equal(expectedAsyncActions);
    });
  });

  it("should check the 'setUser' action creator to return the correct object", () => {
    const dispatch = spy(actionCreators, "setUser");
    const expected = {
      type: Actions.SET_AUTHENTICATED_USER,
      payload: true
    };

    actionCreators.setUser(true);

    expect(dispatch.getCall(0).returnValue).to.deep.equal(expected);
  });

  it("should check the 'fetchAuthenticatedUserData' action creator to return the correct object", async () => {
    const store = configureStore()({});
    const dispatch = spy(store, "dispatch");
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
    const firstCallReturnValue = dispatch.getCall(0).returnValue;

    expect(firstCallReturnValue.type).to.deep.equal(Actions.FETCH_USER_DATA);
    expect(firstCallReturnValue.api).to.deep.equal(expected);
  });

  it("should check the 'attemptSignout' action creator", () => {
    const store = configureStore()({});
    const dispatch = spy(store, "dispatch");
    let signOut = stub(idpSelection, "signOut");
    const expected = {
      path: "tokens",
      method: "DELETE",
      successCallback: Actions.LOGOUT_SUCCESS_CALLBACK
    };

    beforeEach(() => {
      signOut = stub(idpSelection, "signOut");
    });

    afterEach(() => {
      signOut.restore();
    });

    it("should return the correct object", () => {
      const usingIdp = true;

      actionCreators.attemptSignout(usingIdp, signOut)(dispatch);
      const firstCallReturnValue = dispatch.getCall(0).returnValue;

      expect(firstCallReturnValue.type).to.deep.equal(Actions.LOGOUT);
      expect(firstCallReturnValue.api).to.deep.equal(expected);
    });

    it("should call msal signOut if using IDP", () => {
      const usingIdp = true;

      actionCreators.attemptSignout(usingIdp, signOut)(dispatch);
      expect(signOut).to.have.been.called;
    });

    it("should not call msal signOut if not using IDP", () => {
      const usingIdp = false;

      actionCreators.attemptSignout(usingIdp, signOut)(dispatch);
      expect(signOut).not.to.have.been.called;
    });
  });

  it("should check the 'checkUserAuthentication' action creator to return the correct object", () => {
    global.localStorage.setItem("user", '{"id": 1, "username": "primero"}');
    const store = configureStore(middlewares)({});

    return store.dispatch(actionCreators.checkUserAuthentication()).then(() => {
      const actions = store.getActions();

      expect(actions).to.have.lengthOf(8);
      expect(actions).to.be.deep.equal(expectedAsyncActions);
    });
  });

  it("should check the 'refreshToken' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = spy(store, "dispatch");
    const expected = {
      path: "tokens",
      method: "POST"
    };

    dispatch(actionCreators.refreshToken());
    const firstCallReturnValue = dispatch.getCall(0).returnValue;

    expect(firstCallReturnValue.type).to.deep.equal(Actions.REFRESH_USER_TOKEN);
    expect(firstCallReturnValue.api).to.deep.equal(expected);
  });

  describe("resetPassword", () => {
    beforeEach(() => {
      stub(generate, "messageKey").returns("key-123");
    });

    afterEach(() => {
      generate.messageKey.restore();
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

      expect(resetPasswordAction).to.be.deep.equal(expected);
    });
  });
});
