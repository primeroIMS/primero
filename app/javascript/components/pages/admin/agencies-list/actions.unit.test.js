// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("<AgenciesList /> - Actions", () => {
  it("should have known properties", () => {
    const clonedActions = { ...actions };

    expect(typeof clonedActions).toEqual("object");
    [
      "AGENCIES",
      "AGENCIES_STARTED",
      "AGENCIES_SUCCESS",
      "AGENCIES_FAILURE",
      "AGENCIES_FINISHED",
      "CLEAR_METADATA",
      "SET_AGENCIES_FILTER"
    ].forEach(property => {
      expect(clonedActions).toHaveProperty(property);
      delete clonedActions[property];
    });

    expect(Object.keys(clonedActions)).toHaveLength(0);
  });
});
