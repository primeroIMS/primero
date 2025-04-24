// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import Actions from "./actions";

describe("User - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = { ...Actions };

    [
      "LOGIN",
      "FETCH_USER_DATA",
      "FETCH_USER_DATA_SUCCESS",
      "LOGOUT",
      "LOGOUT_FAILURE",
      "LOGOUT_FINISHED",
      "LOGOUT_STARTED",
      "LOGOUT_SUCCESS",
      "LOGOUT_SUCCESS_CALLBACK",
      "REFRESH_USER_TOKEN",
      "RESET_PASSWORD",
      "RESET_PASSWORD_FAILURE",
      "RESET_PASSWORD_STARTED",
      "RESET_PASSWORD_SUCCESS",
      "SET_AUTHENTICATED_USER",
      "SAVE_USER_NOTIFICATION_SUBSCRIPTION",
      "REMOVE_USER_NOTIFICATION_SUBSCRIPTION"
    ].forEach(property => {
      expect(cloneActions).toHaveProperty(property);
      expect(typeof cloneActions[property]).toBe("string");
      delete cloneActions[property];
    });

    expect(Object.keys(cloneActions)).toHaveLength(0);
  });
});
