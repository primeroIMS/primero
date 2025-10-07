// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("<ReportsForm /> - actions", () => {
  it("should have known actions", () => {
    const clone = { ...actions };

    [
      "CLEAR_SELECTED_REPORT",
      "SAVE_REPORT",
      "SAVE_REPORT_FAILURE",
      "SAVE_REPORT_FINISHED",
      "SAVE_REPORT_STARTED",
      "SAVE_REPORT_SUCCESS"
    ].forEach(property => {
      expect(clone).toHaveProperty(property);
      expect(typeof clone[property]).toBe("string");
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
