// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("<FormsList /> - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = { ...actions };

    [
      "CLEAR_EXPORT_FORMS",
      "CLEAR_FORMS_REORDER",
      "ENABLE_REORDER",
      "EXPORT_FORMS",
      "EXPORT_FORMS_FAILURE",
      "EXPORT_FORMS_FINISHED",
      "EXPORT_FORMS_STARTED",
      "EXPORT_FORMS_SUCCESS",
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
      expect(cloneActions).toHaveProperty(property);
      delete cloneActions[property];
    });

    expect(Object.keys(cloneActions)).toHaveLength(0);
  });
});
