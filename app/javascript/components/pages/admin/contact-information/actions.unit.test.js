// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("<ContactInformation /> - Actions", () => {
  it("should have known properties", () => {
    const clonedActions = { ...actions };

    expect(typeof clonedActions).toEqual("object");
    [
      "SAVE_CONTACT_INFORMATION",
      "SAVE_CONTACT_INFORMATION_STARTED",
      "SAVE_CONTACT_INFORMATION_FINISHED",
      "SAVE_CONTACT_INFORMATION_SUCCESS",
      "SAVE_CONTACT_INFORMATION_FAILURE"
    ].forEach(property => {
      expect(clonedActions).toHaveProperty(property);
      delete clonedActions[property];
    });

    expect(Object.keys(clonedActions)).toHaveLength(0);
  });
});
