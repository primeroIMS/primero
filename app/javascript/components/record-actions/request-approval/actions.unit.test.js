// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as actions from "./actions";

describe("<RequestApproval /> - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = { ...actions };

    [
      "APPROVE_RECORD",
      "APPROVE_RECORD_STARTED",
      "APPROVE_RECORD_SUCCESS",
      "APPROVE_RECORD_FINISHED",
      "APPROVE_RECORD_FAILURE"
    ].forEach(property => {
      expect(cloneActions).toHaveProperty(property);
      expect(typeof cloneActions[property]).toBe("string");
      delete cloneActions[property];
    });

    expect(Object.keys(cloneActions)).toHaveLength(0);
  });
});
