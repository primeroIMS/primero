// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("<RolesForm /> - Actions", () => {
  it("should have known properties", () => {
    const clonedActions = { ...actions };

    expect(typeof clonedActions).toEqual("object");
    [
      "CLEAR_SELECTED_ROLE",
      "DELETE_ROLE",
      "DELETE_ROLE_FAILURE",
      "DELETE_ROLE_FINISHED",
      "DELETE_ROLE_STARTED",
      "DELETE_ROLE_SUCCESS",
      "FETCH_ROLE",
      "FETCH_ROLE_FAILURE",
      "FETCH_ROLE_FINISHED",
      "FETCH_ROLE_STARTED",
      "FETCH_ROLE_SUCCESS",
      "SAVE_ROLE",
      "SAVE_ROLE_FAILURE",
      "SAVE_ROLE_FINISHED",
      "SAVE_ROLE_STARTED",
      "SAVE_ROLE_SUCCESS",
      "SET_COPY_ROLE",
      "CLEAR_COPY_ROLE"
    ].forEach(property => {
      expect(clonedActions).toHaveProperty(property);
      delete clonedActions[property];
    });

    expect(Object.keys(clonedActions)).toHaveLength(0);
  });
});
