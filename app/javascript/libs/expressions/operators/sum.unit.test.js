// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import sumOperator from "./sum";

describe("sumOperator", () => {
  const operator = sumOperator(["a", "b", "c"]);

  it("should return sum", () => {
    expect(operator.evaluate({ a: 3, b: 4, c: 2 })).toEqual(9);
  });

  it("should return 0 when wrong arguments passed", () => {
    expect(operator.evaluate({ d: 3, e: 4 })).toEqual(0);
  });

  it("returns 0 when no argument passed", () => {
    expect(operator.evaluate({})).toEqual(0);
  });
});
