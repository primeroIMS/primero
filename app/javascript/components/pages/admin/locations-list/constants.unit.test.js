// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<LocationsList /> - Constants", () => {
  describe("constants", () => {
    let clone;

    beforeAll(() => {
      clone = { ...constants };
    });

    afterAll(() => {
      expect(Object.keys(clone)).toHaveLength(0);
    });

    [
      "ACTION_NAME",
      "NAME",
      "DISABLED",
      "DEFAULT_LOCATION_METADATA",
      "NAME_DELIMITER",
      "COLUMNS",
      "LOCATION_TYPE_LOOKUP",
      "LOCATIONS_DIALOG"
    ].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(constants).toHaveProperty(property);
        delete clone[property];
      });
    });
  });
});
