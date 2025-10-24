// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import clone from "lodash/clone";

import actions from "./actions";

describe("<SelfRegistration /> - Actions", () => {
  const actionsNav = clone(actions);

  it("should have known properties", () => {
    expect(typeof actions).toEqual("object");
    [
      "REGISTER",
      "REGISTER_STARTED",
      "REGISTER_SUCCESS",
      "REGISTER_FINISHED",
      "REGISTER_FAILURE",
      "REGISTER_SUCCESS_CALLBACK",
      "REGISTER_SUCCESS_REDIRECT"
    ].forEach(property => {
      expect(actionsNav).toHaveProperty(property);
      delete actionsNav[property];
    });

    expect(Object.keys(actionsNav)).toHaveLength(0);
  });
});
