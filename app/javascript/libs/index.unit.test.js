// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as moduleToTest from "./index";

describe("libs/index", () => {
  describe("properties", () => {
    let clone;

    beforeAll(() => {
      clone = { ...moduleToTest };
    });

    afterAll(() => {
      expect(Object.keys(clone)).toHaveLength(0);
    });

    [
      "ConditionalWrapper",
      "arrayToObject",
      "buildFieldMap",
      "compare",
      "dataToJS",
      "displayNameHelper",
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
        expect(moduleToTest).toHaveProperty(property);
        delete clone[property];
      });
    });
  });
});
