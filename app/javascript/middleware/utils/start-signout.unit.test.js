// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import configureStore from "redux-mock-store";
import { fromJS } from "immutable";

import * as methods from "../../components/login/components/idp-selection/auth-provider";
import * as actions from "../../components/user/action-creators";

import startSignout from "./start-signout";

jest.mock("../../components/user/action-creators", () => {
  const originalModule = jest.requireActual("../../components/user/action-creators");

  return {
    __esModule: true,
    ...originalModule
  };
});

jest.mock("../../components/login/components/idp-selection/auth-provider", () => {
  const originalModule = jest.requireActual("../../components/login/components/idp-selection/auth-provider");

  return {
    __esModule: true,
    ...originalModule
  };
});

describe("middleware/utils/start-signout.js", () => {
  const store = (userProvider = true) =>
    configureStore()(
      fromJS({
        connectivity: {
          online: true
        },
        idp: {
          use_identity_provider: userProvider
        }
      })
    );

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("triggers msal signout if using identity provider", () => {
    jest.spyOn(methods, "signOut");

    startSignout(store(), true);

    expect(methods.signOut).toHaveBeenCalledTimes(1);
  });

  it("triggers msal signout if using identity provider", () => {
    const configuredStore = store(false);

    const dispatch = jest.spyOn(configuredStore, "dispatch");

    jest.spyOn(actions, "attemptSignout").mockReturnValue({ type: "test" });

    startSignout(configuredStore, true);

    expect(dispatch).toHaveBeenCalledWith(actions.attemptSignout());
  });
});
