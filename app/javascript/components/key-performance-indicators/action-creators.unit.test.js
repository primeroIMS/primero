import forKPI from "./action-creators";

describe("KeyPerformanceIndicators - Action Creators", () => {
  it("should return a function", () => {
    expect(forKPI("test")).to.be.a("function");
  });

  describe("A created action", () => {
    const action = forKPI("test");
    const date1 = "2021-08-01T00:00:00Z";
    const date2 = "2021-09-01T00:00:00Z";
    const dateRange = { from: Date.parse(date1), to: Date.parse(date2) };

    it("should call dispatch with the information required", () => {
      const result = action(dateRange);

      expect(result.KPIidentifier).to.equal("test");
      expect(result.api.params).to.deep.equal({
        from: date1,
        to: date2
      });
    });
  });
});
