import translateKeys from "./translate-keys";

describe("<Report /> - utils", () => {
  describe("translateKeys", () => {
    it("should return the translations for the keys", () => {
      const optionLabelsEn = [{ id: "field_1", display_text: "Text for field 1" }];
      const optionLabelsEs = [{ id: "field_1", display_text: "Texto para el campo 1" }];

      const data = {
        keys: ["field_1"],
        field: { option_labels: { en: optionLabelsEn, es: optionLabelsEs } },
        locale: { current: "es", default: "en" }
      };

      expect(translateKeys(data.keys, data.field, data.locale)).to.deep.equal(optionLabelsEs);
    });

    it("should return the default translations when the current is missing", () => {
      const optionLabels = [{ id: "field_1", display_text: "Text for field 1" }];

      const data = {
        keys: ["field_1"],
        field: { option_labels: { en: optionLabels, es: [] } },
        locale: { current: "es", default: "en" }
      };

      expect(translateKeys(data.keys, data.field, data.locale)).to.deep.equal(optionLabels);
    });
  });
});
