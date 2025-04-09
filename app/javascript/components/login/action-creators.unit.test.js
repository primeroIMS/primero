// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as actionCreators from "./action-creators";

describe("<Login /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).toHaveProperty("loginSystemSettings");
    delete creators.loginSystemSettings;

    expect(creators).toEqual({});
  });
});
