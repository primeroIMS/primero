// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("<LookupsForms /> - actions", () => {
  it("should have known properties", () => {
    const clone = { ...actions };

    expect(typeof clone).toEqual("object");
    [
      "CLEAR_SELECTED_LOOKUP",
      "FETCH_LOOKUP",
      "FETCH_LOOKUP_FAILURE",
      "FETCH_LOOKUP_FINISHED",
      "FETCH_LOOKUP_STARTED",
      "FETCH_LOOKUP_SUCCESS",
      "SAVE_LOOKUP",
      "SAVE_LOOKUP_FAILURE",
      "SAVE_LOOKUP_FINISHED",
      "SAVE_LOOKUP_STARTED",
      "SAVE_LOOKUP_SUCCESS"
    ].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
