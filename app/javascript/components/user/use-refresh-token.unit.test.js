// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { setupHook } from "../../test-utils";
import * as authProvider from "../login/components/idp-selection/auth-provider";

import useRefreshToken from "./use-refresh-token";

jest.mock("../login/components/idp-selection/auth-provider", () => {
  const originalModule = jest.requireActual("../login/components/idp-selection/auth-provider");

  return {
    __esModule: true,
    ...originalModule
  };
});

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

    expect(store.getActions()).toEqual([
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

    expect(store.getActions()).toEqual([]);
  });

  it("refreshes idp token", () => {
    const idpTokenSpy = jest.spyOn(authProvider, "refreshIdpToken");

    Object.defineProperty(global, "sessionStorage", {
      value: {
        getItem: jest.fn(() => {
          return JSON.stringify({ unique_id: "provider" });
        }),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
      },
      writable: true
    });

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

    expect(idpTokenSpy).toHaveBeenCalled();

    jest.restoreAllMocks();
  });
});
