// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import forKPI from "./paths";
import NAMESPACE from "./namespace";

describe("KeyPerformanceIndicators - Paths", () => {
  it("should return the path for the given KPI", () => {
    expect(forKPI("test")).toBe(`${NAMESPACE}/test`);
  });
});
