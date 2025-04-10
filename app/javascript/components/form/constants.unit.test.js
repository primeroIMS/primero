// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<Form /> - Constants", () => {
  it("should have known properties", () => {
    const clonedConstants = { ...constants };

    expect(typeof clonedConstants).toEqual("object");
    [
      "AUDIO_RECORD_FIELD",
      "DIALOG_TRIGGER",
      "CHECK_BOX_FIELD",
      "CUSTOM_LOOKUPS",
      "DATE_FIELD",
      "DOCUMENT_RECORD_FIELD",
      "ERROR_FIELD",
      "FORM_MODE_DIALOG",
      "FORM_MODE_EDIT",
      "FORM_MODE_NEW",
      "FORM_MODE_SHOW",
      "LABEL_FIELD",
      "LINK_FIELD",
      "NUMERIC_FIELD",
      "OPTION_TYPES",
      "ORDERABLE_OPTIONS_FIELD",
      "PARENT_FORM",
      "PHOTO_FIELD",
      "PHOTO_RECORD_FIELD",
      "RADIO_FIELD",
      "SELECT_FIELD",
      "SEPARATOR",
      "SUBFORM_SECTION",
      "TALLY_FIELD",
      "TEXT_AREA",
      "TEXT_FIELD",
      "TICK_FIELD",
      "TOGGLE_FIELD",
      "DOCUMENT_FIELD",
      "AUDIO_FIELD",
      "HIDDEN_FIELD",
      "SELECT_CHANGE_REASON",
      "EMPTY_VALUE"
    ].forEach(property => {
      expect(clonedConstants).toHaveProperty(property);
      delete clonedConstants[property];
    });

    expect(Object.keys(clonedConstants)).toHaveLength(0);
  });

  it("should have known properties for OPTION_TYPES", () => {
    const clonedOptionTypes = { ...constants.OPTION_TYPES };

    expect(typeof clonedOptionTypes).toEqual("object");

    [
      "AGENCY",
      "AGENCY_CURRENT_USER",
      "FORM_GROUP",
      "FORM_GROUP_LOOKUP",
      "LINKED_INCIDENTS",
      "LOCATION",
      "LOOKUPS",
      "MANAGED_ROLE_FORM_SECTIONS",
      "MODULE",
      "RECORD_FORMS",
      "REFER_TO_USERS",
      "REPORTING_LOCATIONS",
      "ROLE",
      "ROLE_EXTERNAL_REFERRAL",
      "ROLE_PERMITTED",
      "ROLE_REFERRAL_AUTHORIZATION",
      "SERVICE_TYPE",
      "TRANSFER_TO_USERS",
      "USER",
      "USER_GROUP",
      "USER_GROUP_PERMITTED",
      "INSIGHTS_USER_GROUP_PERMITTED"
    ].forEach(property => {
      expect(clonedOptionTypes).toHaveProperty(property);
      delete clonedOptionTypes[property];
    });

    expect(Object.keys(clonedOptionTypes)).toHaveLength(0);
  });
});
