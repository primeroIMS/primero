import { expect } from "../../../../test/unit-test-helpers";

import actions from "./actions";

describe("<RolesList /> - Actions", () => {
  it("should have known properties", () => {
    const clonedActions = { ...actions };

    expect(clonedActions).to.be.an("object");
    [
      "ROLES",
      "ROLES_STARTED",
      "ROLES_SUCCESS",
      "ROLES_FAILURE",
      "ROLES_FINISHED"
    ].forEach(property => {
      expect(clonedActions).to.have.property(property);
      delete clonedActions[property];
    });

    expect(clonedActions).to.be.empty;
  });
});
