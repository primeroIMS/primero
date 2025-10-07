// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as recordConstants from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const constants = { ...recordConstants };

    [
      "AUDIO_FIELD",
      "DATE_FIELD",
      "DOCUMENT_FIELD",
      "NAME",
      "NAME_FIELD",
      "NOT_FUTURE_DATE",
      "NUMERIC_FIELD",
      "LINK_TO_FORM",
      "PHOTO_FIELD",
      "RADIO_FIELD",
      "SELECT_FIELD",
      "SEPERATOR",
      "SUBFORM_SECTION",
      "TALLY_FIELD",
      "TEXT_AREA",
      "TEXT_FIELD",
      "TICK_FIELD",
      "URL_LOOKUPS"
    ].forEach(property => {
      expect(constants).toHaveProperty(property);
      delete constants[property];
    });

    expect(Object.keys(constants)).toHaveLength(0);
  });
});
