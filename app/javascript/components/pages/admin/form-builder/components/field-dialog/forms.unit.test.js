import { fieldsForm } from "./forms";

describe("pages/admin/<FormBuilder />/components/<FieldDialog /> - forms", () => {
  const i18n = { t: () => "" };

  it("returns the forms", () => {
    const forms = fieldsForm("custom_field_1", i18n);

    expect(forms.find(form => form.unique_id === "field_form")).to.exist;
    expect(forms.find(form => form.unique_id === "field_form_options")).to
      .exist;
    expect(forms.find(form => form.unique_id === "field_visibility")).to.exist;
  });
});
