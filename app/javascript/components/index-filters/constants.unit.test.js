import { expect } from "chai";

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
      "DEFAULT_FILTERS"
    ].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
