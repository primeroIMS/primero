// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import configureStore from "redux-mock-store";
import { fromJS } from "immutable";

import isServerOnline from "./is-server-online";

describe("middleware/utils/is-server-online.js", () => {
  it("returns serverOnline value from redux state", () => {
    const store = configureStore()(
      fromJS({
        connectivity: {
          serverOnline: true
        }
      })
    );

    expect(isServerOnline(store)).toBe(true);
  });
});
