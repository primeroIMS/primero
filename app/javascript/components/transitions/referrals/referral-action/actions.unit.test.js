// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("<ReferralAction /> - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = { ...actions };

    [
      "REFERRAL_DONE",
      "REFERRAL_DONE_STARTED",
      "REFERRAL_DONE_SUCCESS",
      "REFERRAL_DONE_FINISHED",
      "REFERRAL_DONE_FAILURE",
      "REFERRAL_ACCEPTED",
      "REFERRAL_ACCEPTED_STARTED",
      "REFERRAL_ACCEPTED_SUCCESS",
      "REFERRAL_ACCEPTED_FINISHED",
      "REFERRAL_ACCEPTED_FAILURE",
      "REFERRAL_REJECTED",
      "REFERRAL_REJECTED_STARTED",
      "REFERRAL_REJECTED_SUCCESS",
      "REFERRAL_REJECTED_FINISHED",
      "REFERRAL_REJECTED_FAILURE"
    ].forEach(property => {
      expect(cloneActions).toHaveProperty(property);
      expect(typeof cloneActions[property]).toBe("string");
      delete cloneActions[property];
    });

    expect(Object.keys(cloneActions)).toHaveLength(0);
  });
});
