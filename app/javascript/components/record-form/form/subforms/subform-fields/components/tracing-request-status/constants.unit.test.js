import * as constants from "./constants";

describe("<RecordForm>/form/subforms/<SubformFields>/components/<TracingRequestStatus> - constants", () => {
  it("should have known constant", () => {
    ["NAME"].forEach(property => {
      expect(constants).to.have.property(property);
      expect(constants[property]).to.be.a("string");
      delete constants[property];
    });

    expect(constants).to.be.empty;
  });
});
