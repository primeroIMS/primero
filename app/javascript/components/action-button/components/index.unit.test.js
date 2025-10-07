// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as index from "./index";

describe("<ActionButton />  - index", () => {
  it("exports an object", () => {
    expect(typeof index).toEqual("object");
  });

  describe("properties", () => {
    let clone;

    beforeAll(() => {
      clone = { ...index };
    });

    afterAll(() => {
      expect(Object.keys(clone)).toHaveLength(0);
    });

    ["DefaultButton", "IconButton", "Link"].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(index).toHaveProperty(property);
        delete clone[property];
      });
    });
  });
});
