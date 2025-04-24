// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import clone from "lodash/clone";

import * as Actions from "./actions";

describe("<TaskList /> - Actions", () => {
  const actions = clone(Actions);

  it("should have known properties", () => {
    expect(typeof actions).toEqual("object");
    ["TASKS", "TASKS_STARTED", "TASKS_SUCCESS", "TASKS_FINISHED", "TASKS_FAILURE"].forEach(property => {
      expect(actions).toHaveProperty(property);
      delete actions[property];
    });

    expect(Object.keys(actions)).toHaveLength(0);
  });
});
