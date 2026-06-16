import forKPI from "./paths";
import NAMESPACE from "./namespace";

describe("KeyPerformanceIndicators - Paths", () => {
  it("should return the path for the given KPI", () => {
    expect(forKPI("test")).toBe(`${NAMESPACE}/test`);
  });
});
