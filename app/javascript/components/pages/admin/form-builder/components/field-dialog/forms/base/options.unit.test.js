import { fromJS } from "immutable";

import { FieldRecord, TEXT_FIELD } from "../../../../../../../form";

import { optionsForm } from "./options";

describe("pages/admin/<FormBuilder />/components/<FieldDialog />/forms/base - options", () => {
  const i18n = { t: value => value };
  const mode = fromJS({ isEdit: true });
  const css = { boldLabel: "" };

  describe("optionsForm", () => {
    it("should return the options form with default fields", () => {
      const newField = FieldRecord({
        display_name: "new_field",
        name: "new_field",
        type: TEXT_FIELD
      });
      const form = optionsForm("test_1", i18n, mode, newField, [], css);

      expect(form.unique_id).to.equal("field_form_options");
      expect(form.fields).to.have.lengthOf(3);
    });

    it("DEPRECATED should return the options form with passed fields", () => {
      const customField = FieldRecord({
        display_name: "Custom Field 1",
        name: "custom_field_1",
        type: TEXT_FIELD
      });

      const form = optionsForm("test_1", i18n, mode, customField, [], css);
      const fieldNames = form.fields.map(field => field.name);

      expect(form.unique_id).to.equal("field_form_options");
      expect(fieldNames).to.not.equal(["custom_field_1"]);
    });
  });
});
