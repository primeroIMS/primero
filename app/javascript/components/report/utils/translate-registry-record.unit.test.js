import translateRegistryRecord from "./translate-registry-record";

describe("<Report /> - utils", () => {
  describe("translateRegistryRecord", () => {
    it("returns the incompleteDataLabel when registryRecordId is incomplete_data", () => {
      const result = translateRegistryRecord({
        registryRecordId: "incomplete_data",
        incompleteDataLabel: "Incomplete Data",
        field: {},
        registryOptions: {},
        locale: {}
      });

      expect(result).toBe("Incomplete Data");
    });

    it("returns an empty string when collapsedFieldNames is empty", () => {
      const result = translateRegistryRecord({
        registryRecordId: "123",
        field: {
          registry_type: "some_type",
          registry_option_labels: {}
        },
        registryOptions: {
          some_type: { collapsed_field_names: [] }
        },
        locale: { current: "en", default: "en" },
        incompleteDataLabel: "Incomplete Data"
      });

      expect(result).toBe("");
    });

    it("returns an empty string when registryOptions does not contain the registry type", () => {
      const result = translateRegistryRecord({
        registryRecordId: "123",
        registryOptions: {
          some_type: { collapsed_field_names: ["field1"] }
        },
        locale: { current: "en", default: "en" },
        incompleteDataLabel: "Incomplete Data",
        field: {
          registry_type: "missing_type",
          registry_option_labels: {
            field1: {
              option_labels: [{ id: "123", display_text: { en: "Option A" } }]
            }
          }
        }
      });

      expect(result).toBe("");
    });

    it("returns the joined display text for valid data", () => {
      const result = translateRegistryRecord({
        registryRecordId: "456",
        field: {
          registry_type: "some_type",
          registry_option_labels: {
            field1: {
              option_labels: [{ id: "456", display_text: { en: "Option A", fr: "Option A FR" } }]
            },
            field2: {
              option_labels: [{ id: "456", display_text: { en: "Option B", fr: "Option B FR" } }]
            }
          }
        },
        registryOptions: {
          some_type: { collapsed_field_names: ["field1", "field2"] }
        },
        locale: { current: "en", default: "en" },
        incompleteDataLabel: "Incomplete Data"
      });

      expect(result).toBe("Option A - Option B");
    });

    it("returns an empty string when no matching option id is found in option_labels", () => {
      const result = translateRegistryRecord({
        registryRecordId: "456",
        field: {
          registry_type: "some_type",
          registry_option_labels: {
            field1: {
              option_labels: [{ id: "789", display_text: { en: "Option B", fr: "Option B FR" } }]
            }
          }
        },
        registryOptions: {
          some_type: { collapsed_field_names: ["field1"] }
        },
        locale: { current: "en", default: "en" },
        incompleteDataLabel: "Incomplete Data"
      });

      expect(result).toBe("");
    });

    it("uses locale.default when locale.current is not present", () => {
      const result = translateRegistryRecord({
        registryRecordId: "456",
        field: {
          registry_type: "some_type",
          registry_option_labels: {
            field1: {
              option_labels: [{ id: "456", display_text: { fr: "Option A FR" } }]
            }
          }
        },
        registryOptions: {
          some_type: { collapsed_field_names: ["field1"] }
        },
        locale: { current: undefined, default: "fr" },
        incompleteDataLabel: "Incomplete Data"
      });

      expect(result).toBe("Option A FR");
    });

    it("returns empty string when option_labels are empty", () => {
      const result = translateRegistryRecord({
        registryRecordId: "456",
        field: {
          registry_type: "some_type",
          registry_option_labels: {
            field1: { option_labels: [] }
          }
        },
        registryOptions: {
          some_type: { collapsed_field_names: ["field1"] }
        },
        locale: { current: "en", default: "en" },
        incompleteDataLabel: "Incomplete Data"
      });

      expect(result).toBe("");
    });
  });
});
