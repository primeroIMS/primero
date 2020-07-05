import { List } from "immutable";

import { MANAGE } from "../../../libs/permissions";

import exportsForm from "./form";

describe("<RecordActions /> - exports/form", () => {
  const i18n = { t: () => "" };
  const fields = [
    {
      display_text: "Test subform display text",
      formSectionId: "test_subform",
      formSectionName: "Test Subform",
      id: "test_subform_field"
    },
    {
      display_text: "Test field",
      formSectionId: "test_form",
      formSectionName: "Test form",
      id: "test_field",
      type: "subform"
    }
  ];

  it("returns 8 fields", () => {
    const formFields = exportsForm(
      i18n,
      List([MANAGE]),
      false,
      false,
      "",
      false,
      {
        hideCustomExportFields: ""
      },
      [{ id: "primeromodule-cp", display_text: "CP" }],
      fields
    );

    expect(formFields).to.have.lengthOf(8);
  });
});
