// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as transitionsConstants from "./constants";

describe("<Transitions /> - Constants", () => {
  it("should have known constant", () => {
    const constants = { ...transitionsConstants };

    [
      "REFERRAL_SUMMARY_NAME",
      "REFERRAL_DETAILS_NAME",
      "TRANSITION_PANEL_NAME",
      "TRANSITION_STATUS_NAME",
      "TRANSITION_USER_NAME",
      "TRANSITIONS_NAME",
      "TRANSFER_REQUEST_SUMMARY_NAME",
      "TRANSFER_REQUEST_DETAILS_NAME"
    ].forEach(property => {
      expect(constants).toHaveProperty(property);
      expect(typeof constants[property]).toBe("string");
      delete constants[property];
    });

    expect(constants).toHaveProperty("TRANSITION_STATUS");
    expect(typeof constants.TRANSITION_STATUS).toEqual("object");
    expect(Object.keys(constants.TRANSITION_STATUS)).toEqual(
      expect.arrayContaining(["accepted", "rejected", "done", "inProgress"])
    );
    delete constants.TRANSITION_STATUS;

    expect(constants).toHaveProperty("TRANSITIONS_TYPES");
    expect(typeof constants.TRANSITIONS_TYPES).toEqual("object");
    expect(Object.keys(constants.TRANSITIONS_TYPES)).toEqual(
      expect.arrayContaining(["transfer", "referral", "reassign"])
    );
    delete constants.TRANSITIONS_TYPES;

    expect(Object.keys(constants)).toHaveLength(0);
  });
});
