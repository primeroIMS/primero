// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("<UsersForm /> - Actions", () => {
  it("should have known properties", () => {
    const clonedActions = { ...actions };

    expect(typeof clonedActions).toEqual("object");
    [
      "CLEAR_RECORDS_UPDATE",
      "CLEAR_SELECTED_USER",
      "FETCH_USER",
      "FETCH_USER_FAILURE",
      "FETCH_USER_FINISHED",
      "FETCH_USER_STARTED",
      "FETCH_USER_SUCCESS",
      "NEW_PASSWORD_RESET_REQUEST",
      "NEW_PASSWORD_RESET_REQUEST_FAILURE",
      "NEW_PASSWORD_RESET_REQUEST_FINISHED",
      "NEW_PASSWORD_RESET_REQUEST_STARTED",
      "NEW_PASSWORD_RESET_REQUEST_SUCCESS",
      "PASSWORD_RESET_REQUEST",
      "PASSWORD_RESET_REQUEST_FAILURE",
      "PASSWORD_RESET_REQUEST_FINISHED",
      "PASSWORD_RESET_REQUEST_STARTED",
      "PASSWORD_RESET_REQUEST_SUCCESS",
      "RECORDS_UPDATE",
      "SAVE_USER",
      "SAVE_USER_FAILURE",
      "SAVE_USER_FINISHED",
      "SAVE_USER_STARTED",
      "SAVE_USER_SUCCESS"
    ].forEach(property => {
      expect(clonedActions).toHaveProperty(property);
      delete clonedActions[property];
    });

    expect(Object.keys(clonedActions)).toHaveLength(0);
  });
});
