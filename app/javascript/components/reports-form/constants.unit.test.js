import * as constants from "./constants";

describe("<ReportsForm /> - Constants", () => {
  it("should have known constant", () => {
    const clone = { ...constants };

    [
      "AGGREGATE_BY_FIELD",
      "ALLOWED_FIELD_TYPES",
      "CONSTRAINTS",
      "DATE",
      "DATE_CONSTRAINTS",
      "DEFAULT_FILTERS",
      "DESCRIPTION_FIELD",
      "DISABLED_FIELD",
      "DISAGGREGATE_BY_FIELD",
      "EXCLUDE_EMPTY_ROWS_FIELD",
      "FILTERS_FIELD",
      "FORM_ID",
      "GROUP_AGES_FIELD",
      "GROUP_DATES_BY_FIELD",
      "IS_GRAPH_FIELD",
      "MATCH_REPORTABLE_TYPES",
      "MINIMUM_REPORTABLE_FIELDS",
      "MODULES_FIELD",
      "NAME",
      "NAME_FIELD",
      "NOT_NULL",
      "RECORD_TYPE_FIELD",
      "REPORTABLE_TYPES",
      "REPORT_FIELD_TYPES",
      "SHARED_FILTERS"
    ].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
