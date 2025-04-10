// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import reducers from "./reducer";
import NAMESPACE from "./namespace";
import { KEY_PERFORMANCE_INDICATORS } from "./constants";

describe("KeyPerformanceIndicators - Reducer", () => {
  const reducer = reducers[NAMESPACE];

  it("shouldn't update the state for non-KPI events", () => {
    expect(reducer(new Map(), { type: "TEST_EVENT", payload: "test" })).toEqual(new Map());
  });

  it("should update the state for successful responses from the api", () => {
    expect(
      reducer(new Map(), {
        type: `${KEY_PERFORMANCE_INDICATORS}/test_SUCCESS`,
        payload: "test"
      })
    ).toEqual(new Map([["test", "test"]]));
  });

  it("shouldn't update the state for KPI events that aren't successful api responses", () => {
    expect(
      reducer(new Map(), {
        type: `${KEY_PERFORMANCE_INDICATORS}/test`,
        payload: "test"
      })
    ).not.toEqual(new Map([["test", "test"]]));
  });
});
