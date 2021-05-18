import * as searchableConstants from "./constants";

describe("<SearchableSelect /> - Constants", () => {
  it("should have known constant", () => {
    const constants = { ...searchableConstants };

    expect(constants).to.have.property("NAME", "LISTBOX_PADDING");
    expect(constants.NAME).to.be.a("string");
    delete constants.NAME;
    delete constants.LISTBOX_PADDING;
    expect(constants).to.be.empty;
  });
});
