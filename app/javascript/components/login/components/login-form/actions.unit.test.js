// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("<LoginForm /> - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = { ...actions };

    ["LOGIN", "LOGIN_STARTED", "LOGIN_SUCCESS", "LOGIN_FINISHED", "LOGIN_FAILURE", "LOGIN_SUCCESS_CALLBACK"].forEach(
      property => {
        expect(cloneActions).toHaveProperty(property);
        expect(typeof cloneActions[property]).toBe("string");
        delete cloneActions[property];
      }
    );

    expect(Object.keys(cloneActions)).toHaveLength(0);
  });
});
