import { forKPI } from "./paths";

describe("KeyPerformanceIndicators - Paths", () => {
  it("should return the path for the given KPI", () => {
    expect(forKPI("test")).to.equal("key_performance_indicators/test");
  });
});
