import actions from "./actions";

describe("<UsersList /> - Actions", () => {
  it("should have known properties", () => {
    const clonedActions = { ...actions };

    expect(clonedActions).to.be.an("object");
    ["USERS", "USERS_FINISHED", "USERS_STARTED", "USERS_SUCCESS"].forEach(
      property => {
        expect(clonedActions).to.have.property(property);
        delete clonedActions[property];
      }
    );

    expect(clonedActions).to.be.empty;
  });
});
