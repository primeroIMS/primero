import * as searchableConstants from "./constants";

describe("<SearchableSelect /> - Constants", () => {
  it("should have known constant", () => {
    const constants = { ...searchableConstants };

    ["NAME", "LISTBOX_PADDING"].forEach(cnst => {
      expect(constants).to.have.property(cnst);
      delete constants[cnst];
    });

    expect(constants).to.be.empty;
  });
});
