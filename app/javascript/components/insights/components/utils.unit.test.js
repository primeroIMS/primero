// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as utils from "./utils";

describe("components/report/components/utils.js", () => {
  describe("utils", () => {
    let clone;

    before(() => {
      clone = { ...utils };
    });

    after(() => {
      expect(clone).to.be.empty;
    });

    ["tableToCsv", "downloadFile"].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(utils).to.have.property(property);
        delete clone[property];
      });
    });
  });
});
