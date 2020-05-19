import { FieldRecord, TEXT_FIELD } from "../../../../../../../form";

import { optionsFields, optionsForm } from "./options";

describe("pages/admin/<FormBuilder />/components/<FieldDialog />/forms/basic - options", () => {
  const i18n = { t: value => value };

  describe("optionsFields", () => {
    it("should return the options fields", () => {
      const fields = optionsFields("test_1", i18n);

      expect(fields.guidingQuestions.name).to.equal(
        "test_1.guiding_questions.en"
      );
    });
  });

  describe("optionsForm", () => {
    it("should return the options form with default fields", () => {
      const form = optionsForm("test_1", i18n);
      const fieldNames = form.fields.map(field => field.name);

      expect(form.unique_id).to.equal("field_form_options");
      expect(fieldNames).to.deep.equal(["test_1.guiding_questions.en"]);
    });

    it("should return the options form with passed fields", () => {
      const fields = optionsFields("test_1", i18n);
      const customField = FieldRecord({
        display_name: "Custom Field 1",
        name: "custom_field_1",
        type: TEXT_FIELD
      });
      const form = optionsForm("test_1", i18n, [
        fields.guidingQuestions,
        customField
      ]);
      const fieldNames = form.fields.map(field => field.name);

      expect(form.unique_id).to.equal("field_form_options");
      expect(fieldNames).to.deep.equal([
        "test_1.guiding_questions.en",
        "custom_field_1"
      ]);
    });
  });
});
