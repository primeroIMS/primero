import * as index from "./index";

describe("<LookupForms /> - components/index", () => {
  const clone = { ...index };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
    ["LookupForm"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
