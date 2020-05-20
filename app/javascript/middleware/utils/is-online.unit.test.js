import configureStore from "redux-mock-store";
import { fromJS } from "immutable";

import isOnline from "./is-online";

describe("middleware/utils/is-online.js", () => {
  it("returns online value from redux state", () => {
    const store = configureStore()(
      fromJS({
        application: {
          online: true
        }
      })
    );

    expect(isOnline(store)).to.be.true;
  });
});
