// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as records from "./records";

describe("Verifying records", () => {
  describe("properties", () => {
    let clone;

    beforeAll(() => {
      clone = { ...records };
    });

    afterAll(() => {
      expect(Object.keys(clone)).toHaveLength(0);
    });

    ["FieldRecord", "FormSectionRecord", "Option"].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(records).toHaveProperty(property);
        delete clone[property];
      });
    });
  });
});
