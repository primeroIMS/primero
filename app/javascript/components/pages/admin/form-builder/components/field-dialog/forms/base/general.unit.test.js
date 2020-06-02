import { generalFields, generalForm } from "./general";

describe("pages/admin/<FormBuilder />/components/<FieldDialog />/forms/base - general", () => {
  const i18n = { t: value => value };

  describe("generalFields", () => {
    it("should return the general fields", () => {
      const fields = generalFields("test_1", i18n);

      expect(fields.displayName.name).to.equal("test_1.display_name.en");
      expect(fields.helpText.name).to.equal("test_1.help_text.en");
      expect(fields.required.name).to.equal("test_1.required");
    });
  });

  describe("generalForm", () => {
    it("should return the general form with default fields", () => {
      const form = generalForm("test_1", i18n);
      const fieldNames = form.fields.map(field => field.name);

      expect(form.unique_id).to.equal("field_form");
      expect(fieldNames).to.deep.equal([
        "test_1.display_name.en",
        "test_1.help_text.en",
        "test_1.guiding_questions.en",
        "test_1.required"
      ]);
    });

    it("should return the general form with passed fields", () => {
      const fields = generalFields("test_1", i18n);
      const form = generalForm("test_1", i18n, [fields.displayName]);
      const fieldNames = form.fields.map(field => field.name);

      expect(form.unique_id).to.equal("field_form");
      expect(fieldNames).to.deep.equal(["test_1.display_name.en"]);
    });
  });
});
