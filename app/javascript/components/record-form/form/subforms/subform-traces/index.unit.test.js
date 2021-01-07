import * as indexValues from "./index";

describe("<RecordForm>/form/subforms/<SubformTraces> - index", () => {
  const clone = { ...indexValues };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
    ["default"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });
    expect(clone).to.be.empty;
  });
});
