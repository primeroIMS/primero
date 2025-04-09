// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("<UsersList /> - Actions", () => {
  it("should have known properties", () => {
    const clonedActions = { ...actions };

    expect(typeof clonedActions).toEqual("object");
    ["CLEAR_METADATA", "USERS", "USERS_FINISHED", "USERS_STARTED", "USERS_SUCCESS", "SET_USERS_FILTER"].forEach(
      property => {
        expect(clonedActions).toHaveProperty(property);
        delete clonedActions[property];
      }
    );

    expect(Object.keys(clonedActions)).toHaveLength(0);
  });
});
