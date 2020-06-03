import * as constants from "./constants";

describe("<ReportsForm /> - Constants", () => {
  it("should have known constant", () => {
    const clone = { ...constants };

    [
      "AGGREGATE_BY_FIELD",
      "DESCRIPTION_FIELD",
      "DISAGGREGATE_BY_FIELD",
      "GROUP_AGES_FIELD",
      "GROUP_DATES_BY_FIELD",
      "IS_GRAPH_FIELD",
      "MODULES_FIELD",
      "NAME",
      "NAME_FIELD",
      "RECORD_TYPE_FIELD",
      "REPORT_FIELD_TYPES",
      "REPORTABLE_TYPES"
    ].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
