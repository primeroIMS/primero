// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import configureStore from "redux-mock-store";

import * as actionCreators from "./action-creators";

describe("<SelfRegistration /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    ["registerUser"].forEach(property => {
      expect(creators).toHaveProperty(property);
      delete creators[property];
    });
    expect(creators).toEqual({});
  });

  it("should check the 'registerUser' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");

    dispatch(actionCreators.registerUser());

    expect(dispatch.mock.calls).toEqual([
      [
        {
          type: "user/REGISTER",
          api: {
            path: "users/self-register",
            method: "POST",
            body: {},
            successCallback: [
              {
                action: "user/REGISTER_SUCCESS_REDIRECT",
                redirectWithIdFromResponse: false,
                redirect: "/registration/success"
              }
            ]
          }
        }
      ]
    ]);
  });
});
