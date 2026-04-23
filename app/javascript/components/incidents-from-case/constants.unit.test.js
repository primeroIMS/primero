import * as constants from "./constants";

describe("<IncidentFromCase /> - constants", () => {
  it("should have known constant", () => {
    const constantsValues = { ...constants };

    ["NAME", "NAME_DETAIL", "NAME_PANEL", "NAME_SUMMARY", "REDIRECT_DIALOG"].forEach(property => {
      expect(constantsValues).toHaveProperty(property);

      delete constantsValues[property];
    });

    expect(Object.keys(constantsValues)).toHaveLength(0);
  });
});
