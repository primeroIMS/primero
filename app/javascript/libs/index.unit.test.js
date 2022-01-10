import * as moduleToTest from "./index";

describe("libs/index", () => {
  describe("properties", () => {
    let clone;

    before(() => {
      clone = { ...moduleToTest };
    });

    after(() => {
      expect(clone).to.be.empty;
    });

    [
      "ConditionalWrapper",
      "arrayToObject",
      "buildFieldMap",
      "compare",
      "dataToJS",
      "displayNameHelper",
      "endOfDay",
      "getObjectPath",
      "invalidCharRegexp",
      "hasApiDateFormat",
      "keyIn",
      "listAttachmentFields",
      "listEntriesToRecord",
      "mapEntriesToRecord",
      "mapListToObject",
      "mapObjectPropertiesToRecords",
      "mergeRecord",
      "namespaceActions",
      "normalizeTimezone",
      "rejectKeys",
      "toBase64",
      "toIdentifier",
      "toServerDateFormat",
      "useMemoizedSelector",
      "useThemeHelper",
      "valueFromOptionSource",
      "valuesToSearchableSelect"
    ].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(moduleToTest).to.have.property(property);
        delete clone[property];
      });
    });
  });
});
