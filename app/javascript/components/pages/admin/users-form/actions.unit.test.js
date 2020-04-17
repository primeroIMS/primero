import actions from "./actions";

describe("<UsersForm /> - Actions", () => {
  it("should have known properties", () => {
    const clonedActions = { ...actions };

    expect(clonedActions).to.be.an("object");
    [
      "CLEAR_SELECTED_USER",
      "FETCH_USER",
      "FETCH_USER_STARTED",
      "FETCH_USER_SUCCESS",
      "FETCH_USER_FINISHED",
      "FETCH_USER_FAILURE",
      "SAVE_USER",
      "SAVE_USER_STARTED",
      "SAVE_USER_FINISHED",
      "SAVE_USER_SUCCESS",
      "SAVE_USER_FAILURE"
    ].forEach(property => {
      expect(clonedActions).to.have.property(property);
      delete clonedActions[property];
    });

    expect(clonedActions).to.be.empty;
  });
});
