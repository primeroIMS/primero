import { expect } from "chai";
import clone from "lodash/clone";

import actions from "./actions";

describe("<Transitions /> - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = clone({ ...actions });

    [
      "ASSIGN_USERS_FETCH",
      "ASSIGN_USERS_FETCH_SUCCESS",
      "CLEAR_ERRORS",
      "ASSIGN_USER_SAVE",
      "ASSIGN_USER_SAVE_SUCCESS",
      "ASSIGN_USER_SAVE_STARTED",
      "ASSIGN_USER_SAVE_FAILURE",
      "ASSIGN_USER_SAVE_FINISHED",
      "TRANSFER_USERS_FETCH",
      "TRANSFER_USERS_FETCH_SUCCESS",
      "TRANSFER_USER",
      "TRANSFER_USER_SUCCESS",
      "TRANSFER_USER_STARTED",
      "TRANSFER_USER_FAILURE",
      "REFERRAL_USERS_FETCH",
      "REFERRAL_USERS_FETCH_SUCCESS",
      "REFERRAL_USER",
      "REFERRAL_USER_SUCCESS",
      "REFERRAL_USER_STARTED",
      "REFERRAL_USER_FAILURE",
      "REFER_USER",
      "REFER_USER_SUCCESS",
      "REFER_USER_STARTED",
      "REFER_USER_FAILURE",
      "USERS_ASSIGN_TO",
      "USERS_TRANSFER_TO",
      "USERS_REFER_TO",
      "CASES_ASSIGNS",
      "CASES_TRANSFERS",
      "CASES_REFERRALS"
    ].forEach(property => {
      expect(cloneActions).to.have.property(property);
      expect(cloneActions[property]).to.be.a("string");
      delete cloneActions[property];
    });

    expect(cloneActions).to.be.empty;
  });
});
