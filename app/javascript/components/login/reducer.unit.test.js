// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import reducer from "./reducer";

describe("<Login /> - Reducers", () => {
  const defaultState = fromJS({});

  it("should handle LOGIN_SUCCESS", () => {
    const expected = fromJS({
      identity_providers: [{ name: "unicef" }, { name: "primero" }],
      use_identity_provider: true
    });

    const action = {
      type: "idp/LOGIN_SUCCESS",
      payload: {
        data: [{ name: "unicef" }, { name: "primero" }],
        metadata: {
          use_identity_provider: true
        }
      }
    };
    const newState = reducer.idp(defaultState, action);

    expect(newState).toEqual(expected);
  });
});
