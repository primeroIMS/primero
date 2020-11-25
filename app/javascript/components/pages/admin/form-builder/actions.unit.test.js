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
      "CLEAR_SUBFORMS",
      "CREATE_SELECTED_FIELD",
      "FETCH_FORM",
      "FETCH_FORM_FAILURE",
      "FETCH_FORM_FINISHED",
      "FETCH_FORM_STARTED",
      "FETCH_FORM_SUCCESS",
      "MERGE_SUBFORM_DATA",
      "REORDER_FIELDS",
      "SAVE_FORM",
      "SAVE_FORM_FAILURE",
      "SAVE_FORM_FINISHED",
      "SAVE_FORM_STARTED",
      "SAVE_FORM_SUCCESS",
      "SAVE_SUBFORMS",
      "SAVE_SUBFORMS_FAILURE",
      "SAVE_SUBFORMS_FINISHED",
      "SAVE_SUBFORMS_STARTED",
      "SAVE_SUBFORMS_SUCCESS",
      "SAVE_SUBFORMS_FIELDS",
      "SAVE_SUBFORMS_FIELDS_FAILURE",
      "SAVE_SUBFORMS_FIELDS_FINISHED",
      "SAVE_SUBFORMS_FIELDS_STARTED",
      "SAVE_SUBFORMS_FIELDS_SUCCESS",
      "SELECT_EXISTING_FIELDS",
      "SET_NEW_FIELD",
      "SET_NEW_FIELD_SUBFORM",
      "SET_NEW_SUBFORM",
      "SET_SELECTED_FIELD",
      "SET_SELECTED_SUBFORM",
      "SET_SELECTED_SUBFORM_FIELD",
      "SET_TEMPORARY_SUBFORM",
      "UPDATE_FIELD_TRANSLATIONS",
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
