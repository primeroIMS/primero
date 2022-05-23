import { expect } from "chai";

import avgOperator from "./avg";

describe("avgOperator", () => {
  const operator = avgOperator(["a", "b", "c"]);

  it("should return avg", () => {
    expect(operator.evaluate({ a: 3, b: 4, c: 2 })).to.deep.equals(3);
  });

  it("should return avg when single argument passed", () => {
    expect(operator.evaluate({ a: 3 })).to.deep.equals(3);
  });

  it("should return 0 when wrong arguments passed", () => {
    expect(operator.evaluate({ d: 3, e: 4 })).to.deep.equals(0);
  });

  it("returns 0 when no argument passed", () => {
    expect(operator.evaluate({})).to.deep.equals(0);
  });
});
