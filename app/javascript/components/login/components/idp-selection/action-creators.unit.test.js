// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as actionCreators from "./action-creators";

describe("<IdpSelection /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).toHaveProperty("attemptIDPLogin");
    delete creators.attemptIDPLogin;

    expect(creators).toEqual({});
  });
});
