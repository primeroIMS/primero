import configureStore from "redux-mock-store";
import { fromJS } from "immutable";

import { spy, stub } from "../../test";
import * as methods from "../../components/login/components/idp-selection/auth-provider";
import * as actions from "../../components/user/action-creators";

import startSignout from "./start-signout";

describe("middleware/utils/start-signout.js", () => {
  const store = (userProvider = true) =>
    configureStore()(
      fromJS({
        idp: {
          use_identity_provider: userProvider
        }
      })
    );

  it("triggers msal signout if using identity provider", () => {
    const signout = spy(methods, "signOut");

    startSignout(store());

    expect(methods.signOut).to.have.been.calledOnce;
    signout.restore();
  });

  it("triggers msal signout if using identity provider", () => {
    const configuredStore = store(false);

    const dispatch = spy(configuredStore, "dispatch");
    const signout = stub(actions, "attemptSignout").returns({ type: "test" });

    startSignout(configuredStore);

    expect(dispatch).to.have.been.calledOnceWith(actions.attemptSignout());

    dispatch.restore();
    signout.restore();
  });
});
