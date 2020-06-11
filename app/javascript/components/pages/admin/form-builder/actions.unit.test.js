import actions from "./actions";

describe("<FormBuilder /> - Actions", () => {
  it("should have known properties", () => {
    const clonedActions = { ...actions };

    expect(clonedActions).to.be.an("object");
    [
      "CLEAR_SELECTED_FIELD",
      "CLEAR_SELECTED_FORM",
      "CLEAR_SELECTED_SUBFORM",
      "CLEAR_SELECTED_SUBFORM_FIELD",
      "CREATE_SELECTED_FIELD",
      "FETCH_FORM",
      "FETCH_FORM_FAILURE",
      "FETCH_FORM_FINISHED",
      "FETCH_FORM_STARTED",
      "FETCH_FORM_SUCCESS",
      "REORDER_FIELDS",
      "SAVE_FORM",
      "SAVE_FORM_FAILURE",
      "SAVE_FORM_FINISHED",
      "SAVE_FORM_STARTED",
      "SAVE_FORM_SUCCESS",
      "SET_NEW_FIELD",
      "SET_SELECTED_FIELD",
      "SET_SELECTED_SUBFORM",
      "SET_SELECTED_SUBFORM_FIELD",
      "UPDATE_SELECTED_FIELD",
      "UPDATE_SELECTED_SUBFORM",
      "UPDATE_SELECTED_SUBFORM_FIELD"
    ].forEach(property => {
      expect(clonedActions).to.have.property(property);
      delete clonedActions[property];
    });

    expect(clonedActions).to.be.empty;
  });
});
