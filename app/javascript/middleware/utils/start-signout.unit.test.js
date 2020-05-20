import configureStore from "redux-mock-store";
import { fromJS } from "immutable";

import { spy, fake } from "../../test";

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
    const msalSignout = fake();

    startSignout(store(), null, msalSignout);

    expect(msalSignout).to.have.been.calledOnce;
  });

  it("triggers msal signout if using identity provider", () => {
    const configuredStore = store(false);

    const dispatch = spy(configuredStore, "dispatch");
    const attemptSignout = fake.returns({ type: "test" });

    startSignout(configuredStore, attemptSignout, null);

    expect(dispatch).to.have.been.calledOnceWith(attemptSignout());

    dispatch.restore();
  });
});
