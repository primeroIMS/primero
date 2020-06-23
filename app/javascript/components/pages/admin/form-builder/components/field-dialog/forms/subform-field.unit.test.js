import { subformField } from "./subform-field";

describe("subformField()", () => {
  const i18n = { t: value => value };

  it("should return the forms for the Subform Field", () => {
    const { forms } = subformField({
      name: "field_1",
      i18n
    });

    expect(forms).to.have.sizeOf(2);
  });

  it("should return the correct fields for the visibilityForm", () => {
    const { forms } = subformField({
      name: "field_1",
      i18n
    });

    const visibilityForm = forms.find(
      form => form.unique_id === "field_visibility"
    );

    expect(
      visibilityForm.fields[1].row.map(field => field.get("name"))
    ).to.deep.equal([
      "field_1.visible",
      "field_1.mobile_visible",
      "field_1.hide_on_view_page"
    ]);
  });
});
