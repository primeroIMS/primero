import clone from "lodash/clone";

import actions from "./actions";

describe("<RecordForm /> - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = clone({ ...actions });

    [
      "CLEAR_DATA_PROTECTION_INITIAL_VALUES",
      "CLEAR_VALIDATION_ERRORS",
      "FETCH_AGENCIES",
      "FETCH_AGENCIES_FAILURE",
      "FETCH_AGENCIES_FINISHED",
      "FETCH_AGENCIES_STARTED",
      "FETCH_AGENCIES_SUCCESS",
      "RECORD_FORMS",
      "RECORD_FORMS_FAILURE",
      "RECORD_FORMS_FINISHED",
      "RECORD_FORMS_STARTED",
      "RECORD_FORMS_SUCCESS",
      "SET_DATA_PROTECTION_INITIAL_VALUES",
      "SET_FORMS",
      "SET_LOCATIONS",
      "SET_LOCATIONS_FAILURE",
      "SET_LOCATIONS_FINISHED",
      "SET_LOCATIONS_STARTED",
      "SET_LOCATIONS_SUCCESS",
      "SET_OPTIONS",
      "SET_OPTIONS_FAILURE",
      "SET_OPTIONS_FINISHED",
      "SET_OPTIONS_STARTED",
      "SET_OPTIONS_SUCCESS",
      "SET_SELECTED_FORM",
      "SET_SELECTED_RECORD",
      "SET_SERVICE_TO_REFER",
      "SET_VALIDATION_ERRORS",
      "SET_PREVIOUS_RECORD",
      "CLEAR_PREVIOUS_RECORD"
    ].forEach(property => {
      expect(cloneActions).to.have.property(property);
      delete cloneActions[property];
    });

    expect(cloneActions).to.be.empty;
  });
});
