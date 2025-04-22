// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("<ImportDialog /> - Actions", () => {
  describe("actions", () => {
    let clone = { ...actions };

    beforeAll(() => {
      clone = { ...actions };
    });

    afterAll(() => {
      expect(Object.keys(clone)).toHaveLength(0);
    });

    [
      "CLEAR_IMPORT_ERRORS",
      "IMPORT_LOCATIONS",
      "IMPORT_LOCATIONS_STARTED",
      "IMPORT_LOCATIONS_SUCCESS",
      "IMPORT_LOCATIONS_FINISHED",
      "IMPORT_LOCATIONS_FAILURE"
    ].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(clone).toHaveProperty(property);
        delete clone[property];
      });
    });
  });
});
