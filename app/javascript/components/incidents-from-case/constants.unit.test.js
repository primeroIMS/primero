import * as constants from "./constants";

describe("<IncidentFromCase /> - constants", () => {
  it("should have known constant", () => {
    const constantsValues = { ...constants };

    ["NAME", "NAME_DETAIL", "NAME_PANEL", "NAME_SUMMARY", "REDIRECT_DIALOG"].forEach(property => {
      expect(constantsValues).to.have.property(property);

      delete constantsValues[property];
    });

    expect(constantsValues).to.be.empty;
  });
});
