// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as index from "./index";

describe("<LocationsList /> - Index", () => {
  describe("index", () => {
    let clone;

    beforeAll(() => {
      clone = { ...index };
    });

    afterAll(() => {
      expect(Object.keys(clone)).toHaveLength(0);
    });

    ["default", "reducer", "importReducer"].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(index).toHaveProperty(property);
        delete clone[property];
      });
    });
  });
});
