import { FieldRecord, TEXT_FIELD } from "../../../../../../../form";

import { optionsForm } from "./options";

describe("pages/admin/<FormBuilder />/components/<FieldDialog />/forms/base - options", () => {
  const i18n = { t: value => value };

  describe("optionsForm", () => {
    it("should return the options form with default fields", () => {
      const form = optionsForm("test_1", i18n);
      const fieldNames = form.fields.map(field => field.name);

      expect(form.unique_id).to.equal("field_form_options");
      expect(fieldNames).to.deep.equal([]);
    });

    it("should return the options form with passed fields", () => {
      const customField = FieldRecord({
        display_name: "Custom Field 1",
        name: "custom_field_1",
        type: TEXT_FIELD
      });
      const form = optionsForm("test_1", i18n, [customField]);
      const fieldNames = form.fields.map(field => field.name);

      expect(form.unique_id).to.equal("field_form_options");
      expect(fieldNames).to.deep.equal(["custom_field_1"]);
    });
  });
});
