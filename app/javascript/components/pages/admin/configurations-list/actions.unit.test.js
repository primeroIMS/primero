// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("configurations-list/actions.js", () => {
  it("exports an object", () => {
    expect(typeof actions).toEqual("object");
  });

  describe("properties", () => {
    let clone;

    beforeAll(() => {
      clone = { ...actions };
    });

    afterAll(() => {
      expect(Object.keys(clone)).toHaveLength(0);
    });

    [
      "CLEAR_METADATA",
      "FETCH_CONFIGURATIONS",
      "FETCH_CONFIGURATIONS_STARTED",
      "FETCH_CONFIGURATIONS_SUCCESS",
      "FETCH_CONFIGURATIONS_FAILURE",
      "FETCH_CONFIGURATIONS_FINISHED"
    ].forEach(property => {
      it(`exports '${property}' action`, () => {
        expect(actions).toHaveProperty(property);
        delete clone[property];
      });
    });
  });
});
