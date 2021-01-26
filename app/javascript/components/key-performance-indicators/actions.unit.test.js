import forKPI from "./actions";

describe("KeyPerformanceIndicators - Actions", () => {
  it("should return an action name in the appropriate format", () => {
    expect(forKPI("test")).to.equal("KeyPerformanceIndicators/test");
  });
});
