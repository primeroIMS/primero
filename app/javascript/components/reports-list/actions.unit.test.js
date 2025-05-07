// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as actions from "./actions";

describe("<Reports /> - Actions", () => {
  describe("properties", () => {
    let clone;

    beforeAll(() => {
      clone = { ...actions };
    });

    afterAll(() => {
      expect(Object.keys(clone)).toHaveLength(0);
    });

    [
      "FETCH_REPORTS",
      "FETCH_REPORTS_STARTED",
      "FETCH_REPORTS_SUCCESS",
      "FETCH_REPORTS_FINISHED",
      "FETCH_REPORTS_FAILURE",
      "CLEAR_METADATA"
    ].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(actions).toHaveProperty(property);
        delete clone[property];
      });
    });
  });
});
