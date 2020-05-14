import * as moduleToTest from "./index";

describe("libs/index", () => {
  it("exports an object", () => {
    expect(moduleToTest).to.be.an("object");
  });

  describe("properties", () => {
    let clone;

    before(() => {
      clone = { ...moduleToTest };
    });

    after(() => {
      expect(clone).to.be.empty;
    });

    [
      "arrayToObject",
      "compare",
      "dataToJS",
      "keyIn",
      "listAttachmentFields",
      "listEntriesToRecord",
      "mapEntriesToRecord",
      "mapListToObject",
      "mapObjectPropertiesToRecords",
      "mergeRecord",
      "namespaceActions",
      "rejectKeys",
      "toBase64",
      "useThemeHelper",
      "valuesToSearchableSelect",
      "ConditionalWrapper"
    ].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(moduleToTest).to.have.property(property);
        delete clone[property];
      });
    });
  });
});
