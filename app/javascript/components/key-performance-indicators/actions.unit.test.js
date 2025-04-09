// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import forKPI from "./actions";

describe("KeyPerformanceIndicators - Actions", () => {
  it("should return an action name in the appropriate format", () => {
    expect(forKPI("test")).toBe("KeyPerformanceIndicators/test");
  });
});
