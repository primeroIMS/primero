import getOrderDirection from "./get-order-direction";

describe("getOrderDirection", () => {
  it("should return the difference of order values", () => {
    expect(getOrderDirection(1, 4)).to.equal(3);
  });
});
