// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as referralConstants from "./constants";

describe("<Referral /> - Constants", () => {
  it("should have known constant", () => {
    const constants = { ...referralConstants };

    [
      "AGENCY_FIELD",
      "LOCATION_FIELD",
      "MAIN_FORM",
      "NAME",
      "NOTES_FIELD",
      "PROVIDED_CONSENT_NAME",
      "PROVIDED_FORM_NAME",
      "REFERRAL_FIELD",
      "REMOTE_SYSTEM_FIELD",
      "SERVICE_FIELD",
      "SERVICE_RECORD_FIELD",
      "SERVICE_SECTION_FIELDS",
      "TRANSITIONED_TO_FIELD"
    ].forEach(property => {
      expect(constants).toHaveProperty(property);
      delete constants[property];
    });

    expect(Object.keys(constants)).toHaveLength(0);
  });

  it("should have known SERVICE_SECTION_FIELDS properties", () => {
    const constants = { ...referralConstants.SERVICE_SECTION_FIELDS };

    ["deliveryLocation", "implementingAgency", "implementingAgencyIndividual", "uniqueId", "type"].forEach(property => {
      expect(constants).toHaveProperty(property);
      delete constants[property];
    });

    expect(Object.keys(constants)).toHaveLength(0);
  });
});
