// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("<TransferRequest /> - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = { ...actions };

    [
      "TRANSFER_REQUEST",
      "TRANSFER_REQUEST_SUCCESS",
      "TRANSFER_REQUEST_STARTED",
      "TRANSFER_REQUEST_FAILURE",
      "TRANSFER_REQUEST_FINISHED",
      "TRANSFER_REQUEST_URL"
    ].forEach(property => {
      expect(cloneActions).toHaveProperty(property);
      delete cloneActions[property];
    });

    expect(Object.keys(cloneActions)).toHaveLength(0);
  });
});
