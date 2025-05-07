// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { selectFieldForm } from "./select-field";

describe("selectFieldForm()", () => {
  const i18n = { t: value => value };
  const formMode = fromJS({ isEdit: true });
  const fieldData = { name: "select_field_1" };
  const css = { boldLabel: "" };

  it("returns a select field for manual options", () => {
    const options = fromJS([
      {
        id: "option_1",
        display_text: { en: "Display Text Option 1" }
      },
      {
        id: "option_2",
        display_text: { en: "Display Text Option 2" }
      }
    ]);

    const { forms } = selectFieldForm({
      field: fromJS({
        ...fieldData,
        option_strings_text: options
      }),
      i18n,
      formMode,
      lookups: [],
      css
    });

    const optionsForm = forms.find(form => form.get("unique_id") === "field_form_options");

    const optionsFormFields = optionsForm.fields.filter(val => Object.keys(val)[0] === "tabs");
    const optionStringsText = optionsFormFields[0].tabs[1].fields.find(
      field => field.get("name") === "select_field_1.option_strings_text"
    );

    expect(forms.size).toBe(3);
    expect(optionsForm).toBeDefined();
    expect(optionStringsText.get("option_strings_text")).toEqual(options);
  });

  it("renders a select field for lookup options", () => {
    const { forms } = selectFieldForm({
      field: fromJS({
        ...fieldData,
        option_strings_source: "lookup lookup-test-1"
      }),
      i18n,
      formMode,
      lookups: [],
      css
    });

    const optionsForm = forms.find(form => form.get("unique_id") === "field_form_options");

    const optionsFormFields = optionsForm.fields.filter(val => Object.keys(val)[0] === "tabs");

    const optionStringsText = optionsFormFields[0].tabs[1].fields.find(
      field => field.get("name") === "select_field_1.option_strings_text"
    );

    const optionStringsSource = optionsFormFields[0].tabs[0].fields.find(
      field => field.get("name") === "select_field_1.option_strings_source"
    );

    expect(forms.size).toBe(3);
    expect(optionsForm).toBeDefined();
    expect(optionStringsText.get("option_strings_text").size).toBe(0);
    expect(optionStringsSource.get("option_strings_source")).toBe("Lookups");
  });
});
