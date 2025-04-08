// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as index from "./index";

describe("app/javascript/components/dashboard/flag-box/index", () => {
  describe("properties", () => {
    let clone;

    beforeAll(() => {
      clone = { ...index };
    });

    afterAll(() => {
      expect(Object.keys(clone)).toHaveLength(0);
    });

    ["default"].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(index).toHaveProperty(property);
        delete clone[property];
      });
    });
  });
});
