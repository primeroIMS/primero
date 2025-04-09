// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import {
  SUBFORM_LOOKUP_HEADER_NAME,
  SUBFORM_DATE_HEADER_NAME,
  SUBFORM_HEADER_DATE,
  SUBFORM_HEADER_TICKBOX,
  SUBFORM_HEADER,
  SUBFORM_FIELDS,
  SUBFORM_FIELD_ARRAY,
  SUBFORM_DIALOG,
  SUBFORM_FIELD_SUBFORM
} from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const constants = {
      SUBFORM_LOOKUP_HEADER_NAME,
      SUBFORM_DATE_HEADER_NAME,
      SUBFORM_HEADER_DATE,
      SUBFORM_HEADER_TICKBOX,
      SUBFORM_HEADER,
      SUBFORM_FIELDS,
      SUBFORM_FIELD_ARRAY,
      SUBFORM_DIALOG,
      SUBFORM_FIELD_SUBFORM
    };

    [
      "SUBFORM_LOOKUP_HEADER_NAME",
      "SUBFORM_DATE_HEADER_NAME",
      "SUBFORM_HEADER_DATE",
      "SUBFORM_HEADER_TICKBOX",
      "SUBFORM_HEADER",
      "SUBFORM_FIELDS",
      "SUBFORM_FIELD_ARRAY",
      "SUBFORM_DIALOG",
      "SUBFORM_FIELD_SUBFORM"
    ].forEach(property => {
      expect(constants).toHaveProperty(property);
      expect(typeof constants[property]).toBe("string");
      delete constants[property];
    });

    expect(Object.keys(constants)).toHaveLength(0);
  });
});
