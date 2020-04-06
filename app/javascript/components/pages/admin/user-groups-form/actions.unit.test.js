import { expect } from "../../../../test";

import actions from "./actions";

describe("<UserGroupsForm /> - Actions", () => {
  it("should have known properties", () => {
    const clonedActions = { ...actions };

    expect(clonedActions).to.be.an("object");
    [
      "CLEAR_SELECTED_USER_GROUP",
      "FETCH_USER_GROUP",
      "FETCH_USER_GROUP_STARTED",
      "FETCH_USER_GROUP_SUCCESS",
      "FETCH_USER_GROUP_FINISHED",
      "FETCH_USER_GROUP_FAILURE",
      "SAVE_USER_GROUP",
      "SAVE_USER_GROUP_STARTED",
      "SAVE_USER_GROUP_FINISHED",
      "SAVE_USER_GROUP_SUCCESS",
      "SAVE_USER_GROUP_FAILURE"
    ].forEach(property => {
      expect(clonedActions).to.have.property(property);
      delete clonedActions[property];
    });

    expect(clonedActions).to.be.empty;
  });
});
