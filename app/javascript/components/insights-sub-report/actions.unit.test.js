// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("<Insights /> - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = { ...actions };

    [
      "FETCH_INSIGHT",
      "FETCH_INSIGHT_STARTED",
      "FETCH_INSIGHT_SUCCESS",
      "FETCH_INSIGHT_FAILURE",
      "FETCH_INSIGHT_FINISHED",
      "SET_SUB_REPORT"
    ].forEach(property => {
      expect(cloneActions).toHaveProperty(property);
      expect(typeof cloneActions[property]).toBe("string");
      delete cloneActions[property];
    });

    expect(Object.keys(cloneActions)).toHaveLength(0);
  });
});
