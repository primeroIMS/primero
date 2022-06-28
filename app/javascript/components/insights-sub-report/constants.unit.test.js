import * as constants from "./constants";

describe("<Report /> - constants", () => {
  const clone = { ...constants };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
    ["COMBINED_INDICATORS", "GROUPED_BY_FILTER", "NAME", "GHN_VIOLATIONS_INDICATORS_IDS"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
