// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as utils from "./utils";

describe("<Records /> - utils", () => {
  describe("properties", () => {
    let clone;

    beforeAll(() => {
      clone = { ...utils };
    });

    afterAll(() => {
      expect(Object.keys(clone)).toHaveLength(0);
    });

    ["cleanUpFilters", "useMetadata", "getShortIdFromUniqueId"].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(utils).toHaveProperty(property);
        delete clone[property];
      });
    });
  });
});
