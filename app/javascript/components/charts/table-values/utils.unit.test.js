// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import generateKey from "./utils";

describe("<TableValues/> - utils", () => {
  describe("generateKey", () => {
    describe("when name prop is empty", () => {
      it("returns the last element with total label", () => {
        global.Math.random = () => 0.1234;
        expect(generateKey()).toBe(12340001);
      });
    });

    describe("when name prop is not empty", () => {
      it("returns an array with a single and empty element", () => {
        global.Math.random = () => 0.1234;
        const expected = "12340001-test";

        expect(generateKey("test")).toBe(expected);
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });
});
