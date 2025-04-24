// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import clone from "lodash/clone";

import actions from "./actions";

describe("<Transitions /> - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = clone({ ...actions });

    [
      "ASSIGN_USERS_FETCH",
      "ASSIGN_USERS_FETCH_SUCCESS",
      "ASSIGN_USER_SAVE",
      "ASSIGN_USER_SAVE_FAILURE",
      "ASSIGN_USER_SAVE_FINISHED",
      "ASSIGN_USER_SAVE_STARTED",
      "ASSIGN_USER_SAVE_SUCCESS",
      "CASES_ASSIGNS",
      "CASES_REFERRALS",
      "CASES_TRANSFERS",
      "CLEAR_ERRORS",
      "INCIDENTS_ASSIGNS",
      "REFERRAL_USER",
      "REFERRAL_USERS_FETCH",
      "REFERRAL_USERS_FETCH_FINISHED",
      "REFERRAL_USERS_FETCH_STARTED",
      "REFERRAL_USERS_FETCH_SUCCESS",
      "REFERRAL_USER_FAILURE",
      "REFERRAL_USER_STARTED",
      "REFERRAL_USER_SUCCESS",
      "REFER_USER",
      "REFER_USER_FAILURE",
      "REFER_USER_FINISHED",
      "REFER_USER_STARTED",
      "REFER_USER_SUCCESS",
      "TRANSFER_USER",
      "TRANSFER_USERS_FETCH",
      "TRANSFER_USERS_FETCH_FAILURE",
      "TRANSFER_USERS_FETCH_STARTED",
      "TRANSFER_USERS_FETCH_SUCCESS",
      "TRANSFER_USER_FAILURE",
      "TRANSFER_USER_STARTED",
      "TRANSFER_USER_SUCCESS",
      "USERS_ASSIGN_TO",
      "USERS_REFER_TO",
      "USERS_TRANSFER_TO",
      "REFER_USER_SUCCESS_FINISHED"
    ].forEach(property => {
      expect(cloneActions).toHaveProperty(property);
      expect(typeof cloneActions[property]).toBe("string");
      delete cloneActions[property];
    });

    expect(Object.keys(cloneActions)).toHaveLength(0);
  });
});
