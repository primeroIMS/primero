import { List } from "immutable";

import { MANAGE } from "../../permissions";

import exportsForm from "./form";
import { OLD_INCIDENT_RECORDER_FORMAT } from "./constants";

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

  it("returns 15 fields", () => {
    const formFields = exportsForm(
      i18n,
      List([MANAGE]),
      false,
      [{ id: "primeromodule-cp", display_text: "CP" }],
      fields,
      {},
      "",
      {}
    );

    expect(formFields).toHaveLength(15);
  });

  it("shows the old Incident Recorder format field only for the incident recorder export", () => {
    const formFields = exportsForm(
      i18n,
      List([MANAGE]),
      false,
      [{ id: "primeromodule-cp", display_text: "CP" }],
      fields,
      {},
      "",
      {}
    );
    const oldFormatField = formFields.find(field => field.name === OLD_INCIDENT_RECORDER_FORMAT);

    expect(oldFormatField).not.toBeUndefined();
    expect(oldFormatField.showIf("incident_recorder_xls")).toBe(true);
    expect(oldFormatField.showIf("pdf")).toBe(false);
  });
});
