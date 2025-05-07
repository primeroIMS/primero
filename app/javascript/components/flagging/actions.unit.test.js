// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import constants from "./actions";

describe("Flagging - Constants", () => {
  it("should have known properties", () => {
    const clonedConstants = { ...constants };

    [
      "FETCH_FLAGS",
      "FETCH_FLAGS_SUCCESS",
      "UNFLAG",
      "UNFLAG_SUCCESS",
      "ADD_FLAG",
      "ADD_FLAG_SUCCESS",
      "SET_SELECTED_FLAG",
      "SET_SELECTED_FLAG_SUCCESS",
      "FETCH_FLAGS_STARTED",
      "FETCH_FLAGS_FINISHED"
    ].forEach(property => {
      expect(clonedConstants).toHaveProperty(property);
      delete clonedConstants[property];
    });

    expect(Object.keys(clonedConstants)).toHaveLength(0);
  });
});
