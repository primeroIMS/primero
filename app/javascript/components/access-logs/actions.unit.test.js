// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("AccessLog - Actions", () => {
  it("should have known properties", () => {
    const clonedActions = { ...actions };

    [
      "FETCH_ACCESS_LOGS",
      "FETCH_ACCESS_LOGS_STARTED",
      "FETCH_ACCESS_LOGS_SUCCESS",
      "FETCH_ACCESS_LOGS_FAILURE",
      "FETCH_ACCESS_LOGS_FINISHED",
      "FETCH_USERS_ACCESSED",
      "FETCH_USERS_ACCESSED_STARTED",
      "FETCH_USERS_ACCESSED_SUCCESS",
      "FETCH_USERS_ACCESSED_FAILURE",
      "FETCH_USERS_ACCESSED_FINISHED"
    ].forEach(property => {
      expect(clonedActions).toHaveProperty(property);
      delete clonedActions[property];
    });

    expect(Object.keys(clonedActions)).toHaveLength(0);
  });
});
