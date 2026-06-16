import * as constants from "./constants";

describe("<Nav>/components/<RecordInformation>- constants", () => {
  it("should have known constant", () => {
    const clonedConstants = { ...constants };

    ["NAME"].forEach(property => {
      expect(clonedConstants).toHaveProperty(property);
      delete clonedConstants[property];
    });

    expect(clonedConstants).toEqual({});
  });
});
