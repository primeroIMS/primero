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
    expect(forKPI("wrong", state, "default")).to.equal("default");
  });

  it("should return the deep value for the given KPI", () => {
    expect(forKPI("test", state, "default")).to.equal("test");
  });
});
