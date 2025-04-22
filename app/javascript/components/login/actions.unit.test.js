// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("<Login /> - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = { ...actions };

    ["LOGIN", "LOGIN_SUCCESS", "LOGIN_STARTED", "LOGIN_FAILURE", "LOGIN_FINISHED"].forEach(property => {
      expect(cloneActions).toHaveProperty(property);
      expect(typeof cloneActions[property]).toBe("string");
      delete cloneActions[property];
    });

    expect(Object.keys(cloneActions)).toHaveLength(0);
  });
});
