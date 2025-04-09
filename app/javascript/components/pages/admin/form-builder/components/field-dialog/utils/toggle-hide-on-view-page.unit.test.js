// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { SEPARATOR } from "../../../../../../form";

import toggleHideOnViewPage from "./toggle-hide-on-view-page";
import getFormField from "./get-form-field";

describe("toggleHideOnViewPage", () => {
  const formMode = fromJS({
    isNew: false,
    isEdit: true
  });

  it("should toggle the value of hide_on_view_page property", () => {
    const field1 = { name: "field_1", visible: true };
    const expected = { ...field1, hide_on_view_page: false };

    expect(
      toggleHideOnViewPage({
        ...field1,
        hide_on_view_page: true
      })
    ).toEqual(expected);
  });

  it("should return the form sections for SEPARATOR type", () => {
    const i18n = { t: value => value };
    const formSections = getFormField({
      field: fromJS({
        type: SEPARATOR,
        name: "test"
      }),
      i18n,
      formMode
    });

    expect(formSections.forms.size).toBe(2);
  });
});
