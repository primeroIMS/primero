import { expect } from "chai";

import { setupHook, spy, stub } from "../../test";
import * as authProvider from "../login/components/idp-selection/auth-provider";

import useRefreshToken from "./use-refresh-token";

describe("user/use-refresh-token.js", () => {
  it("refresh token if authenticated", () => {
    const { act, result, store } = setupHook(() => useRefreshToken(), {
      user: {
        isAuthenticated: true
      }
    });

    act(() => {
      result.current.refreshUserToken();
    });

    expect(store.getActions()).to.deep.eql([
      {
        api: {
          method: "POST",
          path: "tokens"
        },
        type: "user/REFRESH_USER_TOKEN"
      }
    ]);
  });

  it("does not refresh token if not authenticated", () => {
    const { act, result, store } = setupHook(() => useRefreshToken(), {
      user: {
        isAuthenticated: false
      }
    });

    act(() => {
      result.current.refreshUserToken();
    });

    expect(store.getActions()).to.deep.eql([]);
  });

  it("refreshes idp token", () => {
    const idpTokenSpy = spy(authProvider, "refreshIdpToken");

    stub(global.localStorage, "getItem").returns("provider");

    const { act, result } = setupHook(() => useRefreshToken(), {
      idp: {
        use_identity_provider: true,
        identity_providers: [{ unique_id: "provider" }]
      },
      user: {
        isAuthenticated: true
      }
    });

    act(() => {
      result.current.refreshUserToken();
    });

    expect(idpTokenSpy).to.have.been.called;

    if (global.localStorage.getItem.restore) {
      global.localStorage.getItem.restore();
    }
  });
});
