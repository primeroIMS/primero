import * as constants from "./constants";

describe("<RecordForm>/form/subforms/<SubformTraces> - constants", () => {
  const clone = { ...constants };

  it("should have known constant", () => {
    ["FORMS", "NAME"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
