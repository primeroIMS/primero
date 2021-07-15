import actions from "./actions";

describe("<RolesList /> - Actions", () => {
  it("should have known properties", () => {
    const clonedActions = { ...actions };

    expect(clonedActions).to.be.an("object");
    [
      "CLEAR_METADATA",
      "ROLES",
      "ROLES_STARTED",
      "ROLES_SUCCESS",
      "ROLES_FAILURE",
      "ROLES_FINISHED",
      "SET_ROLES_FILTER"
    ].forEach(property => {
      expect(clonedActions).to.have.property(property);
      delete clonedActions[property];
    });

    expect(clonedActions).to.be.empty;
  });
});
