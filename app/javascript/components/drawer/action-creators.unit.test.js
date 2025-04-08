// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as actionCreators from "./action-creators";
import * as actions from "./actions";

describe("components/drawer/action-creators.js", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    ["setDrawer", "toggleDrawer"].forEach(property => {
      expect(creators).toHaveProperty(property);
      delete creators[property];
    });

    expect(Object.keys(creators)).toHaveLength(0);
  });

  it("should create an action to set the drawer", () => {
    const payload = { formName: "some-form", open: true };

    const expectedAction = {
      type: actions.SET_DRAWER,
      payload
    };

    expect(actionCreators.setDrawer(payload)).toEqual(expectedAction);
  });

  it("should create an action to toggle the drawer", () => {
    const expectedAction = {
      type: actions.TOGGLE_DRAWER,
      payload: true
    };

    expect(actionCreators.toggleDrawer(true)).toEqual(expectedAction);
  });
});
