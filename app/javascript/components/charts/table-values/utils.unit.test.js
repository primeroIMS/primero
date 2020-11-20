import { stub } from "../../../test";

import generateKey from "./utils";

describe("<TableValues/> - utils", () => {
  describe("generateKey", () => {
    describe("when name prop is empty", () => {
      it("returns the last element with total label", () => {
        stub(Math, "random").returns(1234);
        expect(generateKey()).to.be.equals(12340001);
      });
    });

    describe("when name prop is not empty", () => {
      it("returns an array with a single and empty element", () => {
        stub(Math, "random").returns(1234);
        const expected = "12340001-test";

        expect(generateKey("test")).to.be.equal(expected);
      });
    });

    afterEach(() => {
      if (Math.random.restore) {
        Math.random.restore();
      }
    });
  });
});
