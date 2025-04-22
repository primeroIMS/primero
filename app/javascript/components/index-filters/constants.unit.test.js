// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<IndexFilters /> - Constants", () => {
  it("should have known constant", () => {
    const clone = { ...constants };

    [
      "FILTER_TYPES",
      "HIDDEN_FIELDS",
      "PRIMARY_FILTERS",
      "OR_FIELDS",
      "MY_CASES_FILTER_NAME",
      "OR_FILTER_NAME",
      "DEFAULT_FILTERS",
      "DEFAULT_SELECTED_RECORDS_VALUE",
      "FILTER_CATEGORY",
      "INDIVIDUAL_VICTIM_FILTER_NAMES",
      "VIOLATIONS_FILTER_NAMES",
      "ID_SEARCH"
    ].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
