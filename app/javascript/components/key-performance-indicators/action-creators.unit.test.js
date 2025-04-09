// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import forKPI from "./action-creators";

describe("KeyPerformanceIndicators - Action Creators", () => {
  beforeAll(() => {
    // eslint-disable-next-line no-extend-native
    Date.prototype.getTimezoneOffset = jest.fn(() => 0);

    jest.useFakeTimers().setSystemTime(new Date("2021-08-01"));
  });

  afterAll(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
  });

  it("should return a function", () => {
    expect(forKPI("test")).toBeInstanceOf(Function);
  });

  describe("A created action", () => {
    const action = forKPI("test");
    const date1 = new Date(2021, 8, 1);
    const date2 = new Date(2021, 9, 1);
    const dateRange = { from: Date.parse(date1), to: Date.parse(date2) };

    it("should call dispatch with the information required", () => {
      const result = action(dateRange);

      expect(result.KPIidentifier).toBe("test");
      expect(result.api.params).toEqual({
        from: "2021-09-01",
        to: "2021-10-01"
      });
    });
  });
});
