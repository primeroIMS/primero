// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as index from "./index";

describe("<Form /> - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    [
      "AUDIO_FIELD",
      "AUDIO_RECORD_FIELD",
      "ActionsMenu",
      "CHECK_BOX_FIELD",
      "CUSTOM_LOOKUPS",
      "DATE_FIELD",
      "default",
      "DIALOG_TRIGGER",
      "DOCUMENT_FIELD",
      "DOCUMENT_RECORD_FIELD",
      "ERROR_FIELD",
      "FORM_MODE_DIALOG",
      "FORM_MODE_EDIT",
      "FORM_MODE_NEW",
      "FORM_MODE_SHOW",
      "FieldRecord",
      "FormAction",
      "FormSection",
      "FormSectionField",
      "FormSectionRecord",
      "HIDDEN_FIELD",
      "LABEL_FIELD",
      "LINK_FIELD",
      "notPropagatedOnSubmit",
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
      "submitHandler",
      "TALLY_FIELD",
      "TEXT_AREA",
      "TEXT_FIELD",
      "TICK_FIELD",
      "TOGGLE_FIELD",
      "whichFormMode",
      "SELECT_CHANGE_REASON",
      "EMPTY_VALUE"
    ].forEach(property => {
      expect(indexValues).toHaveProperty(property);
      delete indexValues[property];
    });
    expect(Object.keys(indexValues)).toHaveLength(0);
  });
});
