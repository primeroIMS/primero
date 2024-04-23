// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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
      "hasApiDateFormat",
      "invalidCharRegexp",
      "keyIn",
      "listAttachmentFields",
      "listEntriesToRecord",
      "mapEntriesToRecord",
      "mapListToObject",
      "mapObjectPropertiesToRecords",
      "mergeRecord",
      "namespaceActions",
      "normalizeTimezone",
      "overwriteMerge",
      "reduceMapToObject",
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
