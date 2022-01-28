import * as constants from "./constants";

describe("<Report /> - constants", () => {
  const clone = { ...constants };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
    [
      "DELETE_MODAL",
      "NAME",
      "DATE_PATTERN",
      "TOTAL",
      "TOTAL_KEY",
      "DATE_CONTROLS",
      "DATE_CONTROLS_GROUP",
      "CONTROLS_GROUP",
      "THIS_QUARTER",
      "LAST_QUARTER",
      "THIS_YEAR",
      "LAST_YEAR",
      "THIS_MONTH",
      "LAST_MONTH",
      "CUSTOM",
      "INSIGHTS_CONFIG"
    ].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
