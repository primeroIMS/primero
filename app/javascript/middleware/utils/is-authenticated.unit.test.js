import configureStore from "redux-mock-store";
import { fromJS } from "immutable";

import isOnline from "./is-authenticated";

describe("middleware/utils/is-authenticated.js", () => {
  it("returns online value from redux state", () => {
    const store = configureStore()(
      fromJS({
        user: {
          isAuthenticated: true
        }
      })
    );

    expect(isOnline(store)).to.be.true;
  });
});
