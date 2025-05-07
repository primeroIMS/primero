// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("pages/admin/<FormBuilder />/components/<FieldDialog /> - Constants", () => {
  it("should have known properties", () => {
    const clonedActions = { ...constants };

    [
      "ADMIN_FIELDS_DIALOG",
      "DATE_FIELD_CUSTOM_VALUES",
      "NAME",
      "FIELD_FORM",
      "FIELD_TRANSLATABLE_OPTIONS",
      "LOCALIZABLE_OPTIONS_FIELD_NAME",
      "SKIP_LOGIC_FIELD",
      "SUBFORM_TRANSLATABLE_OPTIONS",
      "RESET_OPTIONS"
    ].forEach(property => {
      expect(clonedActions).toHaveProperty(property);
      delete clonedActions[property];
    });

    expect(Object.keys(clonedActions)).toHaveLength(0);
  });

  describe("values", () => {
    it("should have correct constant value", () => {
      expect(constants.LOCALIZABLE_OPTIONS_FIELD_NAME).toEqual({
        select_box: "option_strings_text",
        radio_button: "option_strings_text",
        tally_field: "tally"
      });
    });
  });
});
