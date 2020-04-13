import * as searchableConstants from "./constants";

describe("<SearchableSelect /> - Constants", () => {
  it("should have known constant", () => {
    const constants = { ...searchableConstants };

    expect(constants).to.have.property("NAME");
    expect(constants.NAME).to.be.a("string");
    delete constants.NAME;

    expect(constants).to.be.empty;
  });
});
