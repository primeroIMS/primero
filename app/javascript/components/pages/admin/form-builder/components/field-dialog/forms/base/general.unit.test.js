import { fromJS } from "immutable";

import { generalFields, generalForm } from "./general";

describe("pages/admin/<FormBuilder />/components/<FieldDialog />/forms/base - general", () => {
  const i18n = { t: value => value };
  const formMode = fromJS({
    isNew: false,
    isEdit: true
  });

  describe("generalFields", () => {
    it("should return the general fields", () => {
      const fields = generalFields({ fieldName: "test_1", i18n, formMode });

      expect(fields.displayName.name).to.equal("test_1.display_name.en");
      expect(fields.helpText.name).to.equal("test_1.help_text.en");
      expect(fields.required.name).to.equal("test_1.required");
    });
  });

  describe("generalForm", () => {
    it("should return the general form with default fields", () => {
      const form = generalForm({ fieldName: "test_1", i18n, formMode });
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
      const fieldName = "test_1";
      const fields = generalFields({ fieldName, i18n, formMode });
      const form = generalForm({
        fieldName,
        i18n,
        formMode,
        fields: [fields.displayName]
      });
      const fieldNames = form.fields.map(field => field.name);

      expect(form.unique_id).to.equal("field_form");
      expect(fieldNames).to.deep.equal(["test_1.display_name.en"]);
    });
  });
});
