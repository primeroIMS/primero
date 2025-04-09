// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("record-form/form/field-types/attachments/constants", () => {
  describe("constants", () => {
    let clone;

    beforeAll(() => {
      clone = { ...constants };
    });

    afterAll(() => {
      expect(Object.keys(clone)).toHaveLength(0);
    });

    [
      "ATTACHMENT_FIELDS",
      "ATTACHMENT_FIELDS_INITIAL_VALUES",
      "ATTACHMENT_TYPES",
      "FIELD_ATTACHMENT_TYPES",
      "ATTACHMENT_ACCEPTED_TYPES"
    ].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(constants).toHaveProperty(property);
        delete clone[property];
      });
    });

    it("should have known ATTACHMENT_ACCEPTED_TYPES properties", () => {
      const clonedAcceptedTypes = { ...constants.ATTACHMENT_ACCEPTED_TYPES };

      ["audio", "image", "document"].forEach(property => {
        expect(clonedAcceptedTypes).toHaveProperty(property);
        delete clonedAcceptedTypes[property];
      });
      expect(Object.keys(clonedAcceptedTypes)).toHaveLength(0);
    });
  });
});
