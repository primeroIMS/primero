// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import clone from "lodash/clone";

import actions from "./actions";

describe("bulk-transitons - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = clone({ ...actions });

    [
      "BULK_ASSIGN_CASES",
      "BULK_ASSIGN_INCIDENTS",
      "BULK_ASSIGN_USER_SAVE",
      "BULK_ASSIGN_USER_SAVE_SUCCESS",
      "BULK_ASSIGN_USER_SAVE_STARTED",
      "BULK_ASSIGN_USER_SAVE_FAILURE",
      "BULK_ASSIGN_USER_SAVE_FINISHED",
      "BULK_ASSIGN_USER_SELECTED_RECORDS_LENGTH",
      "CLEAR_BULK_ASSIGN_MESSAGES"
    ].forEach(property => {
      expect(cloneActions).toHaveProperty(property);
      expect(typeof cloneActions[property]).toBe("string");
      delete cloneActions[property];
    });

    expect(Object.keys(cloneActions)).toHaveLength(0);
  });
});
