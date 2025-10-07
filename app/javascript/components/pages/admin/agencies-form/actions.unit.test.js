// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("<AgenciesForm /> - Actions", () => {
  it("should have known properties", () => {
    const clonedActions = { ...actions };

    expect(typeof clonedActions).toEqual("object");
    [
      "CLEAR_SELECTED_AGENCY",
      "FETCH_AGENCY",
      "FETCH_AGENCY_STARTED",
      "FETCH_AGENCY_SUCCESS",
      "FETCH_AGENCY_FINISHED",
      "FETCH_AGENCY_FAILURE",
      "SAVE_AGENCY",
      "SAVE_AGENCY_STARTED",
      "SAVE_AGENCY_FINISHED",
      "SAVE_AGENCY_SUCCESS",
      "SAVE_AGENCY_FAILURE"
    ].forEach(property => {
      expect(clonedActions).toHaveProperty(property);
      delete clonedActions[property];
    });

    expect(Object.keys(clonedActions)).toHaveLength(0);
  });
});
