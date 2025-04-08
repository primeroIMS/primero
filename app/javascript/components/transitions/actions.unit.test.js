// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as Actions from "./actions";

describe("filters-builder - Actions", () => {
  it("should have known actions", () => {
    const actions = { ...Actions };

    expect(actions).toHaveProperty("FETCH_TRANSITIONS");
    expect(actions).toHaveProperty("FETCH_TRANSITIONS_SUCCESS");

    delete actions.FETCH_TRANSITIONS;
    delete actions.FETCH_TRANSITIONS_SUCCESS;

    expect(actions).toEqual({});
  });
});
