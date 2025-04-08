// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<ReportsForm /> - Constants", () => {
  it("should have known constant", () => {
    const clone = { ...constants };

    [
      "AGGREGATE_BY_FIELD",
      "ALLOWED_FIELD_NAMES",
      "ALLOWED_FIELD_TYPES",
      "CONSENT_REPORTING_FIELD",
      "CONSTRAINTS",
      "DATE",
      "DATE_CONSTRAINTS",
      "DEFAULT_CONSTRAINTS",
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
      "RECORD_STATE_FIELD",
      "RECORD_TYPE_FIELD",
      "REPORTABLE_TYPES",
      "REPORT_FIELD_TYPES",
      "SHARED_FILTERS",
      "STATUS_FIELD"
    ].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
