// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as index from "./index";

describe("<ImportDialog /> - Index", () => {
  describe("index", () => {
    let clone;

    before(() => {
      clone = { ...index };
    });

    after(() => {
      expect(clone).to.be.empty;
    });

    ["default", "importReducer"].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(index).to.have.property(property);
        delete clone[property];
      });
    });
  });
});
