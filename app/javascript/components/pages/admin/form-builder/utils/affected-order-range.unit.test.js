// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import affectedOrderRange from "./affected-order-range";

describe("affectedOrderRange", () => {
  describe("order is greater than current order", () => {
    it("should return the range of orders to be changed", () => {
      expect(affectedOrderRange(1, 4)).to.deep.equal([1, 2, 3, 4]);
    });
  });

  describe("order is less than current order", () => {
    it("should return the range of orders to be changed", () => {
      expect(affectedOrderRange(4, 2)).to.deep.equal([2, 3, 4]);
    });
  });

  describe("order is equal to current order", () => {
    it("should return an empty range of orders to be changed", () => {
      expect(affectedOrderRange(2, 2)).to.deep.equal([]);
    });
  });
});
