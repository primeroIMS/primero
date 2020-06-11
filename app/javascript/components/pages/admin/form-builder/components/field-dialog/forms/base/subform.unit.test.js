import { FieldRecord, TEXT_FIELD } from "../../../../../../../form";

import { subform } from "./subform";

describe("pages/admin/<FormBuilder />/components/<FieldDialog />/forms/base - subform", () => {
  const i18n = { t: value => value };

  describe("subform", () => {
    it("should return the subform with default fields", () => {
      const form = subform(i18n);
      const fieldNames = form.fields.map(field => field.name);

      expect(form.unique_id).to.equal("subform_field");
      expect(fieldNames).to.deep.equal([
        "subform_section.name.en",
        "subform_section.description.en",
        "subform_section.subform_append_only",
        "subform_section.subform_prevent_item_removal",
        "subform_section.starts_with_one_entry"
      ]);
    });

    it("should return the subform form with passed fields", () => {
      const customField = FieldRecord({
        display_name: "Custom Field 1",
        name: "custom_field_1",
        type: TEXT_FIELD
      });
      const form = subform(i18n, [customField]);
      const fieldNames = form.fields.map(field => field.name);

      expect(form.unique_id).to.equal("subform_field");
      expect(fieldNames).to.deep.equal(["custom_field_1"]);
    });
  });
});
