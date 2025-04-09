// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("configurations-form/constants.js", () => {
  it("exports an object", () => {
    expect(typeof constants).toEqual("object");
  });

  describe("constants", () => {
    let clone;

    beforeAll(() => {
      clone = { ...constants };
    });

    afterAll(() => {
      expect(Object.keys(clone)).toHaveLength(0);
    });

    ["APPLY_CONFIGURATION_MODAL", "DELETE_CONFIGURATION_MODAL", "NAME", "SEND_CONFIGURATION_MODAL", "FORM_ID"].forEach(
      property => {
        it(`exports '${property}'`, () => {
          expect(constants).toHaveProperty(property);
          delete clone[property];
        });
      }
    );
  });
});
