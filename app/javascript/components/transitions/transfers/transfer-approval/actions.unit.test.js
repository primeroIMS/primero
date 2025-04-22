// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("<TransferApproval /> - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = { ...actions };

    [
      "APPROVE_TRANSFER",
      "APPROVE_TRANSFER_STARTED",
      "APPROVE_TRANSFER_SUCCESS",
      "APPROVE_TRANSFER_FINISHED",
      "APPROVE_TRANSFER_FAILURE"
    ].forEach(property => {
      expect(cloneActions).toHaveProperty(property);
      expect(typeof cloneActions[property]).toBe("string");
      delete cloneActions[property];
    });

    expect(Object.keys(cloneActions)).toHaveLength(0);
  });
});
