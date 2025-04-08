// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import forKPI from "./selectors";
import NAMESPACE from "./namespace";

describe("KeyPerformanceIndicators - Selectors", () => {
  const state = fromJS({
    records: {
      [NAMESPACE]: {
        test: "test"
      }
    }
  });

  it("should return default value for missing keys", () => {
    expect(forKPI("wrong", state, "default")).toBe("default");
  });

  it("should return the deep value for the given KPI", () => {
    expect(forKPI("test", state, "default")).toBe("test");
  });
});
