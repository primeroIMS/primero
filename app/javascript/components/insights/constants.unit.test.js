import * as constants from "./constants";

describe("<Report /> - constants", () => {
  const clone = { ...constants };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
    [
      "CONTROLS_GROUP",
      "CUSTOM",
      "DATE_CONTROLS",
      "DATE_CONTROLS_GROUP",
      "DATE_PATTERN",
      "DELETE_MODAL",
      "EXPORT_INSIGHTS_PATH",
      "INSIGHTS_CONFIG",
      "INSIGHTS_EXPORTER_DIALOG",
      "LAST_MONTH",
      "LAST_QUARTER",
      "LAST_YEAR",
      "MANAGED_REPORTS",
      "MONTH",
      "MONTH_OPTION_IDS",
      "NAME",
      "NAMESPACE",
      "QUARTER",
      "QUARTER_OPTION_IDS",
      "SHARED_FILTERS",
      "THIS_MONTH",
      "THIS_QUARTER",
      "THIS_YEAR",
      "TOTAL",
      "TOTAL_KEY",
      "VIOLATION",
      "YEAR",
      "YEAR_OPTION_IDS"
    ].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
