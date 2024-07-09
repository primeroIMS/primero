// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<ImportDialog /> - Constants", () => {
  describe("constants", () => {
    let clone;

    before(() => {
      clone = { ...constants };
    });

    after(() => {
      expect(clone).to.be.empty;
    });

    ["NAME", "IMPORT", "FORM_ID"].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(constants).to.have.property(property);
        delete clone[property];
      });
    });
  });
});
