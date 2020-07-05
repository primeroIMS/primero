import { fromJS } from "immutable";

import { textFieldForm } from "./text-field";

describe("textFieldForm()", () => {
  const i18n = { t: value => value };
  const formMode = fromJS({
    isNew: false,
    isEdit: true
  });

  it("should return the forms for the Text Field", () => {
    const { forms } = textFieldForm({
      field: fromJS({ name: "field_1" }),
      i18n,
      formMode
    });

    expect(forms).to.have.sizeOf(2);
  });
});
