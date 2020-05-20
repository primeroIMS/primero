import actions from "./actions";

describe("<FormsList /> - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = { ...actions };

    [
      "CLEAR_FORMS_REORDER",
      "ENABLE_REORDER",
      "RECORD_FORMS",
      "RECORD_FORMS_FAILURE",
      "RECORD_FORMS_FINISHED",
      "RECORD_FORMS_STARTED",
      "RECORD_FORMS_SUCCESS",
      "REORDER_FORM_GROUPS",
      "REORDER_FORM_SECTIONS",
      "SAVE_FORMS_REORDER",
      "SAVE_FORMS_REORDER_FINISHED",
      "SAVE_FORMS_REORDER_STARTED",
      "SAVE_FORMS_REORDER_SUCCESS",
      "SET_REORDERED_FORMS"
    ].forEach(property => {
      expect(cloneActions).to.have.property(property);
      delete cloneActions[property];
    });

    expect(cloneActions).to.be.empty;
  });
});
