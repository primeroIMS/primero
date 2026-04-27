import * as constants from "./constants";

describe("<ReportFiltersDialog /> - Constants", () => {
  it("should have known constant", () => {
    const clone = { ...constants };

    ["ATTRIBUTE", "CONSTRAINT", "NAME", "VALUE", "FORM_ID"].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
