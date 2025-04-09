// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import configureStore from "redux-mock-store";

import * as actionCreators from "./action-creators";

describe("<LoginForm /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).toHaveProperty("attemptLogin");
    delete creators.attemptLogin;

    expect(creators).toEqual({});
  });

  it("should check the 'attemptLogin' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");

    dispatch(actionCreators.attemptLogin({ user_name: "primero", password: "test" }));

    expect(dispatch.mock.calls[0][0].type).toEqual("user/LOGIN");
    expect(dispatch.mock.calls[0][0].api.body).toEqual({
      user: {
        password: "test",
        user_name: "primero"
      }
    });
  });
});
