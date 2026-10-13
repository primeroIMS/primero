import translateData from "./translate-data";

describe("<Report /> - utils", () => {
  describe("translateData", () => {
    const i18n = {
      t: value => (value === "report.total" ? "Total" : value),
      locale: "en",
      defaultLocale: "en"
    };
    const fields = [
      {
        name: "service_response_type",
        position: { type: "horizontal", order: 0 },
        option_labels: { en: [{ id: "service_provision", display_text: "Service provision" }] }
      },
      {
        name: "service_type",
        position: { type: "vertical", order: 0 },
        option_labels: { en: [{ id: "health", display_text: "Health" }] }
      }
    ];

    it("translates the report data with query filters", () => {
      const data = {
        service_provision: {
          _total: 2,
          query: ["service_response_type=service_provision"],
          health: { _total: 2, query: ["service_response_type=service_provision", "service_type=health"] }
        }
      };

      expect(translateData(data, [...fields], i18n)).toEqual({
        "Service provision": {
          Total: 2,
          query: ["service_response_type=service_provision"],
          Health: { Total: 2, query: ["service_response_type=service_provision", "service_type=health"] }
        }
      });
    });

    it("translates the report data of a nested record type without query filters", () => {
      const data = { service_provision: { _total: 2, health: { _total: 2 } } };

      expect(translateData(data, [...fields], i18n)).toEqual({
        "Service provision": { Total: 2, Health: { Total: 2 } }
      });
    });
  });
});
