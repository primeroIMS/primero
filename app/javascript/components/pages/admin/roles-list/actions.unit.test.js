// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("<RolesList /> - Actions", () => {
  it("should have known properties", () => {
    const clonedActions = { ...actions };

    expect(typeof clonedActions).toEqual("object");
    [
      "CLEAR_METADATA",
      "ROLES",
      "ROLES_STARTED",
      "ROLES_SUCCESS",
      "ROLES_FAILURE",
      "ROLES_FINISHED",
      "SET_ROLES_FILTER"
    ].forEach(property => {
      expect(clonedActions).toHaveProperty(property);
      delete clonedActions[property];
    });

    expect(Object.keys(clonedActions)).toHaveLength(0);
  });
});
