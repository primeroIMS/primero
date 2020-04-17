import actions from "./actions";

describe("<FormBuilder /> - Actions", () => {
  it("should have known properties", () => {
    const clonedActions = { ...actions };

    expect(clonedActions).to.be.an("object");
    [
      "CLEAR_SELECTED_FORM",
      "SAVE_FORM",
      "SAVE_FORM_STARTED",
      "SAVE_FORM_FINISHED",
      "SAVE_FORM_SUCCESS",
      "SAVE_FORM_FAILURE"
    ].forEach(property => {
      expect(clonedActions).to.have.property(property);
      delete clonedActions[property];
    });

    expect(clonedActions).to.be.empty;
  });
});
