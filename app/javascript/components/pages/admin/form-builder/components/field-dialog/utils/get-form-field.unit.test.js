// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { TEXT_FIELD, TICK_FIELD } from "../../../../../../form";

import getFormField from "./get-form-field";

describe("getFormField", () => {
  const i18n = { t: value => value };

  const formMode = fromJS({
    isNew: false,
    isEdit: true
  });

  it("should return the form sections for TEXT_FIELD type", () => {
    const formSections = getFormField({
      field: fromJS({
        type: TEXT_FIELD,
        name: "owned_by"
      }),
      i18n,
      formMode
    });

    expect(formSections.forms.size).toBe(2);
  });

  it("should return the form sections for TICK_FIELD type", () => {
    const formSections = getFormField({
      field: fromJS({
        type: TICK_FIELD,
        name: "test"
      }),
      i18n,
      formMode
    });

    expect(formSections.forms.size).toBe(2);
  });
});
