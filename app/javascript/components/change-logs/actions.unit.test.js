import actions from "./actions";

describe("ChangeLogs - Actions", () => {
  it("should have known properties", () => {
    const clonedActions = { ...actions };

    [
      "FETCH_CHANGE_LOGS",
      "FETCH_CHANGE_LOGS_STARTED",
      "FETCH_CHANGE_LOGS_SUCCESS",
      "FETCH_CHANGE_LOGS_FAILURE",
      "FETCH_CHANGE_LOGS_FINISHED"
    ].forEach(property => {
      expect(clonedActions).to.have.property(property);
      delete clonedActions[property];
    });

    expect(clonedActions).to.be.empty;
  });
});
