// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as formConstants from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const constants = { ...formConstants };

    [
      "ATTACHMENT_FIELD_NAME",
      "CUSTOM_STRINGS_SOURCE",
      "DATE_FIELD_NAME",
      "DOCUMENT_FIELD_NAME",
      "FORM_SECTION_FIELD_NAME",
      "RADIO_FIELD_NAME",
      "RECORD_FORM_TOOLBAR_NAME",
      "RECORD_FORM_TOOLBAR_PAGE_HEADING_NAME",
      "RECORD_FORM_NAME",
      "RECORD_FORM_PERMISSION",
      "SELECT_FIELD_NAME",
      "SEPERATOR_NAME",
      "TALLY_FIELD_NAME",
      "TALLY_FIELD_CONTAINER_NAME",
      "TEXT_FIELD_NAME",
      "TICK_FIELD_NAME",
      "VIOLATION_ASSOCIATIONS_SUBFORM",
      "ASYNC_OPTIONS"
    ].forEach(property => {
      expect(constants).toHaveProperty(property);
      delete constants[property];
    });

    expect(Object.keys(constants)).toHaveLength(0);
  });

  it("should have known CUSTOM_STRINGS_SOURCE properties", () => {
    const constants = { ...formConstants.CUSTOM_STRINGS_SOURCE };

    ["agency", "location", "reportingLocation", "user"].forEach(property => {
      expect(constants).toHaveProperty(property);
      delete constants[property];
    });

    expect(Object.keys(constants)).toHaveLength(0);
  });
});
