import * as constants from "./constants";

describe("<ReportFiltersDialog /> - Constants", () => {
  it("should have known constant", () => {
    const clone = { ...constants };

    ["ATTRIBUTE", "CONSTRAINT", "NAME", "VALUE"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
