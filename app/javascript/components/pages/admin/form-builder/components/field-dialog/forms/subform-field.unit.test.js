// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { subformField } from "./subform-field";

describe("subformField()", () => {
  const i18n = { t: value => value };

  it("should return the forms for the Subform Field", () => {
    const { forms } = subformField({
      field: fromJS({ name: "field_1" }),
      i18n,
      formMode: fromJS({ isNew: false })
    });

    expect(forms.size).toBe(3);
  });

  it("should return the correct fields for the visibilityForm", () => {
    const { forms } = subformField({
      field: fromJS({ name: "field_1" }),
      i18n,
      formMode: fromJS({ isNew: false })
    });

    const visibilityForm = forms.find(form => form.unique_id === "field_visibility");

    expect(visibilityForm.fields[1].row.map(field => field.get("name"))).toEqual([
      "field_1.visible",
      "field_1.mobile_visible",
      "field_1.hide_on_view_page"
    ]);
  });
});
