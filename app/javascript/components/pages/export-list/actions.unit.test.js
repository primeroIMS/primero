// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("<ExportList /> - pages/export-list/actions", () => {
  it("should have known actions", () => {
    const clone = { ...actions };

    [
      "FETCH_EXPORTS",
      "FETCH_EXPORTS_STARTED",
      "FETCH_EXPORTS_SUCCESS",
      "FETCH_EXPORTS_FINISHED",
      "FETCH_EXPORTS_FAILURE"
    ].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
