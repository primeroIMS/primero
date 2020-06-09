import { subformField } from "./subform-field";

describe("subformField()", () => {
  const i18n = { t: value => value };

  it("should return the forms for the Subform Field", () => {
    const { forms } = subformField({
      fieldName: "field_1",
      i18n
    });

    expect(forms).to.have.sizeOf(2);
  });
});
