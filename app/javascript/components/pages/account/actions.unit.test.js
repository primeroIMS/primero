// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("pages/account/actions.js", () => {
  describe("properties", () => {
    let clone;

    beforeAll(() => {
      clone = { ...actions };
    });

    afterAll(() => {
      expect(Object.keys(clone)).toHaveLength(0);
    });

    [
      "CLEAR_CURRENT_USER",
      "FETCH_CURRENT_USER",
      "FETCH_CURRENT_USER_STARTED",
      "FETCH_CURRENT_USER_SUCCESS",
      "FETCH_CURRENT_USER_FINISHED",
      "FETCH_CURRENT_USER_FAILURE",
      "UPDATE_CURRENT_USER",
      "UPDATE_CURRENT_USER_FAILURE",
      "UPDATE_CURRENT_USER_STARTED",
      "UPDATE_CURRENT_USER_SUCCESS"
    ].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(actions).toHaveProperty(property);
        delete clone[property];
      });
    });
  });
});
