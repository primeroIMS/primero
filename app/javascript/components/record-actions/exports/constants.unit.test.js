// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<RecordActions /> - exports/constants", () => {
  const clone = { ...constants };

  it("should have known properties", () => {
    expect(typeof clone).toEqual("object");
    [
      "ALL_EXPORT_TYPES",
      "CUSTOM_EXPORT_FILE_NAME_FIELD",
      "CUSTOM_FORMAT_TYPE_FIELD",
      "EXPORT_FORMAT",
      "EXPORT_TYPE_FIELD",
      "FIELDS_TO_EXPORT_FIELD",
      "FIELD_ID",
      "FILTERS_TO_SKIP",
      "FORMS_ID",
      "FORM_TO_EXPORT_FIELD",
      "INCLUDE_IMPLEMENTATION_LOGOS",
      "INCLUDE_AGENCY_LOGO",
      "INCLUDE_OTHER_LOGOS",
      "INDIVIDUAL_FIELDS_FIELD",
      "MODULE_FIELD",
      "NAME",
      "PASSWORD_FIELD",
      "HEADER",
      "CUSTOM_HEADER",
      "SIGNATURES",
      "CASE_WORKER",
      "CLIENT",
      "RECIPIENT"
    ].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
  describe("when is ALL_EXPORT_TYPES", () => {
    it("should be an object", () => {
      expect(Array.isArray(constants.ALL_EXPORT_TYPES)).toBe(true);
    });
  });
});
