import actions from "./actions";

describe("<UserGroupsList /> - Actions", () => {
  it("should have known properties", () => {
    const clonedActions = { ...actions };

    expect(clonedActions).to.be.an("object");
    [
      "USER_GROUPS",
      "USER_GROUPS_STARTED",
      "USER_GROUPS_SUCCESS",
      "USER_GROUPS_FAILURE",
      "USER_GROUPS_FINISHED"
    ].forEach(property => {
      expect(clonedActions).to.have.property(property);
      delete clonedActions[property];
    });

    expect(clonedActions).to.be.empty;
  });
});
