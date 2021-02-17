import * as constants from "./constants";

describe("<ReportFiltersDialog /> - Constants", () => {
  it("should have known constant", () => {
    const clone = { ...constants };

    ["ATTRIBUTE", "CONSTRAINT", "NAME", "VALUE", "FORM_ID"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
