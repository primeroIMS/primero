import forKPI from "./paths";
import NAMESPACE from "./namespace";

describe("KeyPerformanceIndicators - Paths", () => {
  it("should return the path for the given KPI", () => {
    expect(forKPI("test")).to.equal(`${NAMESPACE}/test`);
  });
});
