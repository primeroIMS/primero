// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as userConstants from "./constants";

describe("Verifying user constant", () => {
  it("should have known constant", () => {
    const constants = { ...userConstants };

    [
      "IDENTITY_PROVIDER_ID",
      "NOTIFIERS",
      "NOTIFICATIONS_PREFERENCES",
      "PASSWORD_MODAL",
      "PASSWORD_SELF_OPTION",
      "PASSWORD_USER_OPTION",
      "ROLE_OPTIONS",
      "USERGROUP_PRIMERO_GBV",
      "USER_CONFIRMATION_DIALOG",
      "USER_GROUP_UNIQUE_IDS",
      "FIELD_NAMES",
      "FORM_ID"
    ].forEach(property => {
      expect(constants).toHaveProperty(property);
      delete constants[property];
    });

    expect(Object.keys(constants)).toHaveLength(0);
  });
});

describe("values", () => {
  it("should have valid values for constants", () => {
    const constants = { ...userConstants };

    expect(Object.keys(constants.FIELD_NAMES)).toEqual(
      expect.arrayContaining([
        "FULL_NAME",
        "USER_NAME",
        "CODE",
        "PASSWORD_SETTING",
        "PASSWORD",
        "PASSWORD_CONFIRMATION",
        "CHANGE_PASSWORD",
        "LOCALE",
        "ROLE_UNIQUE_ID",
        "USER_GROUP_UNIQUE_IDS",
        "SERVICES",
        "PHONE",
        "EMAIL",
        "AGENCY_ID",
        "AGENCY_OFFICE",
        "POSITION",
        "LOCATION",
        "DISABLED",
        "SEND_MAIL",
        "SEND_MAIL_APPROVAL_REQUEST",
        "SEND_MAIL_APPROVAL_RESPONSE",
        "SEND_MAIL_TRANSFER_REQUEST",
        "SEND_MAIL_TRANSITION_NOTIFICATION",
        "RECEIVE_WEBPUSH",
        "RECEIVE_WEBPUSH_APPROVAL_REQUEST",
        "RECEIVE_WEBPUSH_APPROVAL_RESPONSE",
        "RECEIVE_WEBPUSH_TRANSFER_REQUEST",
        "RECEIVE_WEBPUSH_TRANSITION_NOTIFICATION"
      ])
    );
  });
});
