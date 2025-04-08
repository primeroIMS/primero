// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("<LocationsList /> - Actions", () => {
  describe("actions", () => {
    let clone = { ...actions };

    beforeAll(() => {
      clone = { ...actions };
    });

    afterAll(() => {
      expect(Object.keys(clone)).toHaveLength(0);
    });

    [
      "DISABLE_LOCATIONS",
      "DISABLE_LOCATIONS_STARTED",
      "DISABLE_LOCATIONS_SUCCESS",
      "DISABLE_LOCATIONS_FAILURE",
      "DISABLE_LOCATIONS_FINISHED",
      "LOCATIONS",
      "LOCATIONS_STARTED",
      "LOCATIONS_SUCCESS",
      "LOCATIONS_FAILURE",
      "LOCATIONS_FINISHED",
      "SET_LOCATIONS_FILTER"
    ].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(clone).toHaveProperty(property);
        delete clone[property];
      });
    });
  });
});
