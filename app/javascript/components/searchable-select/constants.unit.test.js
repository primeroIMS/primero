import * as searchableConstants from "./constants";

describe("<SearchableSelect /> - Constants", () => {
  it("should have known constant", () => {
    const constants = { ...searchableConstants };

    ["NAME", "LISTBOX_PADDING"].forEach(cnst => {
      expect(constants).toHaveProperty(cnst);
      delete constants[cnst];
    });

    expect(Object.keys(constants)).toHaveLength(0);
  });
});
