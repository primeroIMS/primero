import { fromJS } from "immutable";

import { selectFieldForm } from "./select-field";

describe("selectFieldForm()", () => {
  const i18n = { t: value => value };
  const mode = fromJS({ isEdit: true });
  const fieldData = { name: "select_field_1" };

  it("returns  a select field for manual options", () => {
    const options = [
      {
        id: "option_1",
        display_text: "Display Text Option 1"
      },
      {
        id: "option_2",
        display_text: "Display Text Option 2"
      }
    ];

    const { forms } = selectFieldForm({
      field: fromJS({
        ...fieldData,
        option_strings_text: { en: options }
      }),
      i18n,
      mode
    });

    const optionsForm = forms.find(
      form => form.get("unique_id") === "field_form_options"
    );

    const optionStringsText = optionsForm.fields.find(
      field => field.get("name") === "select_field_1.option_strings_text"
    );

    expect(forms).to.have.sizeOf(3);
    expect(optionsForm).to.exist;
    expect(optionStringsText.option_strings_text.en).to.deep.equal(options);
  });

  it("renders a select field for lookup options", () => {
    const { forms } = selectFieldForm({
      field: fromJS({
        ...fieldData,
        option_strings_source: "lookup lookup-test-1"
      }),
      i18n,
      mode
    });

    const optionsForm = forms.find(
      form => form.get("unique_id") === "field_form_options"
    );

    const optionStringsText = optionsForm.fields.find(
      field => field.get("name") === "select_field_1.option_strings_text"
    );

    const optionStringsSource = optionsForm.fields.find(
      field => field.get("name") === "select_field_1.option_strings_source"
    );

    expect(forms).to.have.sizeOf(3);
    expect(optionsForm).to.exist;
    expect(optionStringsText).to.not.exist;
    expect(optionStringsSource.option_strings_source).to.equal("Lookups");
  });
});
