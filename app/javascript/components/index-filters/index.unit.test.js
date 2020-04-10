import * as constants from "./index";

describe("<IndexFilters /> - index", () => {
  const clone = { ...constants };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
    [
      "default",
      "reducer",
      "applyFilters",
      "getFiltersValuesByRecordType",
      "OR_FIELDS",
      "FILTER_TYPES",
      "DEFAULT_FILTERS"
    ].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });
    expect(clone).to.be.empty;
  });
});
