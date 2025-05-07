// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import getOrderDirection from "./get-order-direction";

describe("getOrderDirection", () => {
  it("should return the difference of order values", () => {
    expect(getOrderDirection(1, 4)).toBe(3);
  });
});
