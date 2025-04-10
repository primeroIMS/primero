// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("<Reports /> - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = { ...actions };

    [
      "FETCH_REPORT",
      "FETCH_REPORT_STARTED",
      "FETCH_REPORT_SUCCESS",
      "FETCH_REPORT_FAILURE",
      "FETCH_REPORT_FINISHED",
      "DELETE_REPORT",
      "DELETE_REPORT_STARTED",
      "DELETE_REPORT_SUCCESS",
      "DELETE_REPORT_FAILURE",
      "DELETE_REPORT_FINISHED"
    ].forEach(property => {
      expect(cloneActions).toHaveProperty(property);
      expect(typeof cloneActions[property]).toBe("string");
      delete cloneActions[property];
    });

    expect(Object.keys(cloneActions)).toHaveLength(0);
  });
});
