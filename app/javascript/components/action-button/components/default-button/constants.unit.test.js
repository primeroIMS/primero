// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<ActionButton />  - components/default-button/constants", () => {
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

    ["NAME"].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(constants).toHaveProperty(property);
        delete clone[property];
      });
    });
  });
});
