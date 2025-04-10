// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as actions from "./actions";

describe("<RecordActions /> - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = { ...actions };

    ["SET_DIALOG", "SET_DIALOG_PENDING", "CLEAR_DIALOG"].forEach(property => {
      expect(cloneActions).toHaveProperty(property);
      expect(typeof cloneActions[property]).toBe("string");
      delete cloneActions[property];
    });

    expect(Object.keys(cloneActions)).toHaveLength(0);
  });
});
