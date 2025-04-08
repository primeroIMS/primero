// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as moduleToTest from "./index";

describe("pages/account/index.js", () => {
  it("exports an object", () => {
    expect(typeof moduleToTest).toEqual("object");
  });

  describe("properties", () => {
    let clone;

    beforeAll(() => {
      clone = { ...moduleToTest };
    });

    afterAll(() => {
      expect(Object.keys(clone)).toHaveLength(0);
    });

    ["default", "reducer"].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(moduleToTest).toHaveProperty(property);
        delete clone[property];
      });
    });
  });
});
