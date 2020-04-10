import actions from "./actions";

describe("<RolesForm /> - Actions", () => {
  it("should have known properties", () => {
    const clonedActions = { ...actions };

    expect(clonedActions).to.be.an("object");
    [
      "CLEAR_SELECTED_ROLE",
      "DELETE_ROLE",
      "DELETE_ROLE_FAILURE",
      "DELETE_ROLE_FINISHED",
      "DELETE_ROLE_STARTED",
      "DELETE_ROLE_SUCCESS",
      "FETCH_ROLE",
      "FETCH_ROLE_FAILURE",
      "FETCH_ROLE_FINISHED",
      "FETCH_ROLE_STARTED",
      "FETCH_ROLE_SUCCESS",
      "SAVE_ROLE",
      "SAVE_ROLE_FAILURE",
      "SAVE_ROLE_FINISHED",
      "SAVE_ROLE_STARTED",
      "SAVE_ROLE_SUCCESS"
    ].forEach(property => {
      expect(clonedActions).to.have.property(property);
      delete clonedActions[property];
    });

    expect(clonedActions).to.be.empty;
  });
});
