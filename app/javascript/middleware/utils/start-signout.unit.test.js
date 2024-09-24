// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import configureStore from "redux-mock-store";
import { fromJS } from "immutable";

import { spy, stub } from "../../test-utils";
import * as methods from "../../components/login/components/idp-selection/auth-provider";
import * as actions from "../../components/user/action-creators";

import startSignout from "./start-signout";

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

  it("triggers msal signout if using identity provider", () => {
    const signout = spy(methods, "signOut");

    startSignout(store(), true);

    expect(methods.signOut).to.have.been.calledOnce;
    signout.restore();
  });

  it("triggers msal signout if using identity provider", () => {
    const configuredStore = store(false);

    const dispatch = spy(configuredStore, "dispatch");
    const signout = stub(actions, "attemptSignout").returns({ type: "test" });

    startSignout(configuredStore, true);

    expect(dispatch).to.have.been.calledOnceWith(actions.attemptSignout());

    dispatch.restore();
    signout.restore();
  });
});
