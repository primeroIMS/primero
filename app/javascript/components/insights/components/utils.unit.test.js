// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as utils from "./utils";

describe("components/report/components/utils.js", () => {
  describe("utils", () => {
    let clone;

    beforeAll(() => {
      clone = { ...utils };
    });

    afterAll(() => {
      expect(Object.keys(clone)).toHaveLength(0);
    });

    ["tableToCsv", "downloadFile"].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(utils).toHaveProperty(property);
        delete clone[property];
      });
    });
  });
});
