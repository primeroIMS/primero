// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import clone from "lodash/clone";

import * as actions from "./actions";

describe("<Nav /> - Actions", () => {
  const actionsNav = clone(actions);

  it("should have known properties", () => {
    expect(typeof actions).toEqual("object");
    ["FETCH_ALERTS", "FETCH_ALERTS_SUCCESS"].forEach(property => {
      expect(actionsNav).toHaveProperty(property);
      delete actionsNav[property];
    });

    expect(Object.keys(actionsNav)).toHaveLength(0);
  });
});
