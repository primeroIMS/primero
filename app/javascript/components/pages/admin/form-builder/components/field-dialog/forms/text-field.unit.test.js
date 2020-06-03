import { fromJS } from "immutable";

import { textFieldForm } from "./text-field";

describe("textFieldForm()", () => {
  const i18n = { t: value => value };

  it("should return the forms for the Text Field", () => {
    const { forms } = textFieldForm({
      field: fromJS({ name: "field_1" }),
      i18n
    });

    expect(forms).to.have.sizeOf(2);
  });
});
