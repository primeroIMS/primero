// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("<UserGroupsList /> - Actions", () => {
  it("should have known properties", () => {
    const clonedActions = { ...actions };

    expect(typeof clonedActions).toEqual("object");
    [
      "CLEAR_METADATA",
      "SET_USER_GROUPS_FILTER",
      "USER_GROUPS",
      "USER_GROUPS_STARTED",
      "USER_GROUPS_SUCCESS",
      "USER_GROUPS_FAILURE",
      "USER_GROUPS_FINISHED"
    ].forEach(property => {
      expect(clonedActions).toHaveProperty(property);
      delete clonedActions[property];
    });

    expect(Object.keys(clonedActions)).toHaveLength(0);
  });
});
