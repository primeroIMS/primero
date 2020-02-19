import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import { expect, spy, stub } from "../../test";
import * as idpSelection from "../pages/login/idp-selection";

import { Actions } from "./actions";
import * as actionCreators from "./action-creators";

describe("User - Action Creators", () => {
  const middlewares = [thunk];
  const expectedAsyncActions = [
    {
      type: "user/SET_AUTHENTICATED_USER",
      payload: { id: 1, username: "primero" }
    },
    {
      type: "user/FETCH_USER_DATA",
      api: {
        path: "users/1",
        params: { extended: true },
        db: { collection: "user" }
      }
    },
    {
      type: "application/FETCH_SYSTEM_SETTINGS",
      api: {
        path: "system_settings",
        params: { extended: true },
        db: { collection: "system_settings" }
      }
    },
    {
      type: "forms/RECORD_FORMS",
      api: {
        path: "forms",
        normalizeFunc: "normalizeFormData",
        db: { collection: "forms" }
      }
    },
    {
      type: "forms/SET_OPTIONS",
      api: {
        path: "lookups",
        params: { page: 1, per: 999 },
        db: { collection: "options" }
      }
    },
    {
      type: "forms/SET_LOCATIONS",
      api: {
        path: "nullundefined",
        external: true,
        db: {
          alwaysCache: true,
          collection: "locations",
          manifest: undefined
        }
      }
    }
  ];

  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    [
      "setUser",
      "fetchAuthenticatedUserData",
      "setAuthenticatedUser",
      "attemptSignout",
      "checkUserAuthentication",
      "refreshToken"
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

    return store
      .dispatch(actionCreators.setAuthenticatedUser(user))
      .then(() => {
        const actions = store.getActions();

        expect(actions).to.have.lengthOf(6);
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

  it("should check the 'fetchAuthenticatedUserData' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = spy(store, "dispatch");
    const expected = {
      path: "users/1",
      params: { extended: true },
      db: { collection: "user" }
    };

    actionCreators.fetchAuthenticatedUserData(1)(dispatch);
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

      expect(actions).to.have.lengthOf(6);
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

    actionCreators.refreshToken()(dispatch);
    const firstCallReturnValue = dispatch.getCall(0).returnValue;

    expect(firstCallReturnValue.type).to.deep.equal(Actions.REFRESH_USER_TOKEN);
    expect(firstCallReturnValue.api).to.deep.equal(expected);
  });
});
