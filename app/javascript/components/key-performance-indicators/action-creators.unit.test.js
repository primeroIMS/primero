import { forKPI } from "./action-creators";

describe("KeyPerformanceIndicators - Action Creators", () => {
  it("should return a function", () => {
    expect(forKPI("test")).to.be.a("function");
  });

  describe("A created action", () => {
    const action = forKPI("test");
    const dateRange = { from: 1, to: 2 };

    it("should call dispatch with the information required", done => {
      action(dateRange)(result => {
        expect(result.KPIidentifier).to.equal("test");
        expect(result.api.params).to.deep.equal(dateRange);
        done();
      });
    });
  });
});
