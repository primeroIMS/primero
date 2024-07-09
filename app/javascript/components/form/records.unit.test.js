// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as records from "./records";

describe("Verifying records", () => {
  describe("properties", () => {
    let clone;

    before(() => {
      clone = { ...records };
    });

    after(() => {
      expect(clone).to.be.empty;
    });

    ["FieldRecord", "FormSectionRecord", "Option"].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(records).to.have.property(property);
        delete clone[property];
      });
    });
  });
});
